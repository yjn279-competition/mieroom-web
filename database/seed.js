import fs from 'fs';
import { faker } from '@faker-js/faker/locale/ja';
import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import { exec } from 'child_process';

const execAsync = util.promisify(exec);

// Configuration
const EVACUEES_PER_SHELTER = 200;
const EVACUEE_SKIP_RATE = 0.2; // 20% of shelters will have no evacuees
const SUPPLY_MIN_QUANTITY = 160;
const SUPPLY_MAX_QUANTITY = 200;

// Supply categories and items
const SUPPLIES = [
  { category: '飲料', name: '2Lペットボトル飲料水' },
  { category: '飲料', name: 'ミネラルウォーター（500mlなど）' },
  { category: '食料', name: 'アルファ米' },
  { category: '食料', name: '非常食缶詰（野菜、果物、魚、肉など種類別）' },
  { category: '食料', name: 'レトルト食品（カレー、シチュー、パスタなど）' },
  { category: '食料', name: 'ビスケット／クラッカー' },
  { category: '食料', name: 'インスタントラーメン（またはカップ麺）' },
  { category: '衛生用品', name: 'トイレットペーパー' },
  { category: '衛生用品', name: 'ウェットティッシュ' },
  { category: '衛生用品', name: 'マスク' },
  { category: '衛生用品', name: '消毒液（アルコール消毒液など）' },
  { category: '衛生用品', name: '紙おむつ' },
  { category: '衛生用品', name: '生理用品 医薬品' },
  { category: '衛生用品', name: '救急セット（包帯、ガーゼ、消毒綿、テープなどを含む）' },
  { category: '衛生用品', name: '常備薬セット（解熱剤、鎮痛剤、胃薬など）' },
  { category: '衛生用品', name: 'その他必要な医薬品（風邪薬、アレルギー対応薬など）' },
  { category: '生活必需品', name: '毛布' },
  { category: '生活必需品', name: '寝袋' },
  { category: '生活必需品', name: '使い捨てカイロ' },
  { category: '生活必需品', name: '簡易トイレ' },
  { category: '生活必需品', name: 'その他生活必需品（マット、座布団など）' },
  { category: 'その他', name: '懐中電灯' },
  { category: 'その他', name: '電池' },
  { category: 'その他', name: '携帯充電器（モバイルバッテリー）' },
  { category: 'その他', name: '簡易調理器具（携帯ガスコンロ、調理器具セット）' },
  { category: 'その他', name: '簡易食器（紙皿、カップ、割り箸など）' }
];

// Helper function to escape single quotes for SQL
const escapeSql = (str) => {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

// Helper function to execute D1 command
async function executeD1Command(command) {
  try {
    await execAsync(`pnpm wrangler d1 execute mieroom --command="${command}" --local`);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    return false;
  }
}

// Helper function to create a batch INSERT statement
function createBatchInsertStatement(tableName, columns, valuesList) {
  if (valuesList.length === 0) return null;
  
  const columnsStr = columns.map(col => `${col}`).join(', ');
  const valuesStr = valuesList.map(values => `(${values.join(', ')})`).join(',\n');
  
  return `INSERT INTO ${tableName} (${columnsStr}) VALUES ${valuesStr};`;
}

// Main function
async function main() {
  console.log('Starting data insertion...');

  // Delete existing data
  console.log('Deleting existing data...');
  await executeD1Command('DELETE FROM shelter_evacuees;');
  await executeD1Command('DELETE FROM shelter_supplies;');
  await executeD1Command('DELETE FROM cities;');
  await executeD1Command('DELETE FROM shelters;');
  await executeD1Command('DELETE FROM evacuees;');
  await executeD1Command('DELETE FROM supplies;');
  
  
  // Read shelters data
  console.log('Reading shelters data...');
  const sheltersData = JSON.parse(fs.readFileSync('public/data/shelters.json', 'utf8'));
  
  // Extract unique cities
  console.log('Extracting unique cities...');
  const citiesMap = new Map();
  sheltersData.forEach(shelter => {
    const code = shelter['地方公共団体コード'];
    if (!citiesMap.has(code)) {
      citiesMap.set(code, {
        code,
        name: shelter['指定市区町村名'],
        prefecture: shelter['都道府県']
      });
    }
  });
  const cities = Array.from(citiesMap.values());
  
  // Insert cities - all at once
  console.log(`Inserting ${cities.length} cities...`);
  const cityValues = cities.map(city => [
    escapeSql(city.code),
    escapeSql(city.name),
    escapeSql(city.prefecture)
  ]);
  
  const cityInsertStatement = createBatchInsertStatement(
    'cities',
    ['code', 'name', 'prefecture'],
    cityValues
  );
  
  if (cityInsertStatement) {
    await executeD1Command(cityInsertStatement);
  }
  
  // Generate shelter codes and store them for later use
  console.log(`Generating shelter codes for ${sheltersData.length} shelters...`);
  const shelterCodes = new Map();
  sheltersData.forEach(shelter => {
    const code = shelter['地方公共団体コード'] + '_' + uuidv4().substring(0, 8);
    shelterCodes.set(JSON.stringify(shelter), code);
  });
  
  // Insert shelters in batches of 100
  console.log(`Inserting ${sheltersData.length} shelters...`);
  const shelterValues = sheltersData.map(shelter => {
    const code = shelterCodes.get(JSON.stringify(shelter));
    return [
      escapeSql(code),
      escapeSql(shelter['避難所_施設名称']),
      escapeSql(shelter['地方公共団体コード']),
      escapeSql(shelter['指定市区町村名']),
      escapeSql(shelter['都道府県']),
      escapeSql(shelter['所在地住所']),
      escapeSql(shelter['緯度']),
      escapeSql(shelter['経度']),
      escapeSql(shelter['エレベーター有/避難スペースが１階']),
      escapeSql(shelter['スロープ等']),
      escapeSql(shelter['点字ブロック']),
      escapeSql(shelter['車椅子使用者対応トイレ']),
      escapeSql(shelter['その他']),
      escapeSql('OPEN'),
    ];
  });
  
  // Split shelter inserts into batches of 100 to avoid query size limits
  const shelterBatchSize = 100;
  for (let i = 0; i < shelterValues.length; i += shelterBatchSize) {
    const batchValues = shelterValues.slice(i, i + shelterBatchSize);
    const shelterInsertStatement = createBatchInsertStatement(
      'shelters',
      [
        'code', 'name', 'city_code', 'city_name', 'prefecture', 
        'address', 'latitude', 'longitude', 'elevator_info', 
        'slope', 'braille_blocks', 'wheelchair_toilet', 
        'other_facilities', 'status'
      ],
      batchValues
    );
    
    if (shelterInsertStatement) {
      console.log(`Inserting shelters batch ${Math.floor(i/shelterBatchSize) + 1}/${Math.ceil(shelterValues.length/shelterBatchSize)}`);
      await executeD1Command(shelterInsertStatement);
    }
  }
  
  // Create supplies
  console.log(`Creating ${SUPPLIES.length} supply types...`);
  const supplyIds = SUPPLIES.map(supply => {
    return {
      id: uuidv4(),
      ...supply
    };
  });
  
  // Insert supplies - all at once
  console.log('Inserting supplies...');
  const supplyValues = supplyIds.map(supply => [
    escapeSql(supply.id),
    escapeSql(supply.name),
    escapeSql(supply.category),
    escapeSql(faker.date.future().toISOString().split('T')[0]),
  ]);
  
  const supplyInsertStatement = createBatchInsertStatement(
    'supplies',
    ['id', 'name', 'category', 'expiration_date'],
    supplyValues
  );
  
  if (supplyInsertStatement) {
    await executeD1Command(supplyInsertStatement);
  }
  
  // Process each shelter for evacuees and supplies
  console.log('Processing evacuees and supplies for each shelter...');
  for (let i = 0; i < sheltersData.length; i++) {
    const shelter = sheltersData[i];
    const shelterCode = shelterCodes.get(JSON.stringify(shelter));
    
    console.log(`Processing shelter ${i + 1}/${sheltersData.length}: ${shelter['避難所_施設名称']}`);
    
    // Skip evacuees for some shelters based on EVACUEE_SKIP_RATE
    const skipEvacuees = Math.random() < EVACUEE_SKIP_RATE;
    
    if (!skipEvacuees) {
      // Create evacuees for this shelter
      const evacueeCount = EVACUEES_PER_SHELTER;
      console.log(`Creating ${evacueeCount} evacuees for shelter: ${shelter['避難所_施設名称']}`);
      
      const evacueeValues = [];
      const shelterEvacueeValues = [];
      
      for (let j = 0; j < evacueeCount; j++) {
        const myNumber = faker.string.numeric(12);
        const gender = Math.random() > 0.5 ? '男性' : '女性';
        const birthDate = faker.date.birthdate({ min: 1940, max: 2020, mode: 'year' }).toISOString().split('T')[0];
        const healthStatus = Math.random() > 0.7 ? faker.helpers.arrayElement(['良好', '要観察', '要治療', '要介護']) : null;
        const specialNotes = Math.random() > 0.8 ? faker.lorem.sentence() : null;
        
        // Prepare evacuee values
        evacueeValues.push([
          escapeSql(myNumber),
          escapeSql(faker.person.lastName()),
          escapeSql(faker.person.firstName()),
          escapeSql(gender),
          escapeSql(birthDate),
          escapeSql(faker.location.streetAddress()),
          escapeSql(faker.phone.number()),
          escapeSql(healthStatus),
          escapeSql(specialNotes),
        ]);
        
        // Prepare shelter_evacuee values
        shelterEvacueeValues.push([
          escapeSql(shelterCode),
          escapeSql(myNumber),
        ]);
      }
      
      // Insert all evacuees for this shelter at once
      const evacueeInsertStatement = createBatchInsertStatement(
        'evacuees',
        [
          'my_number', 'family_name', 'given_name', 'gender', 'birth_date',
          'address', 'phone_number', 'health_status', 'special_notes'
        ],
        evacueeValues
      );
      
      if (evacueeInsertStatement) {
        console.log(`Inserting all ${evacueeValues.length} evacuees for shelter: ${shelter['避難所_施設名称']}`);
        await executeD1Command(evacueeInsertStatement);
      }
      
      // Insert all shelter_evacuees for this shelter at once
      const shelterEvacueeInsertStatement = createBatchInsertStatement(
        'shelter_evacuees',
        ['shelter_code', 'my_number'],
        shelterEvacueeValues
      );
      
      if (shelterEvacueeInsertStatement) {
        console.log(`Inserting all ${shelterEvacueeValues.length} shelter_evacuees for shelter: ${shelter['避難所_施設名称']}`);
        await executeD1Command(shelterEvacueeInsertStatement);
      }
    } else {
      console.log(`Skipping evacuees for shelter: ${shelter['避難所_施設名称']}`);
    }
    
    // Create shelter supplies
    console.log(`Creating supplies for shelter: ${shelter['避難所_施設名称']}`);
    const shelterSupplyValues = [];
    
    for (const supply of supplyIds) {
      const quantity = Math.floor(Math.random() * (SUPPLY_MAX_QUANTITY - SUPPLY_MIN_QUANTITY + 1)) + SUPPLY_MIN_QUANTITY;
      
      shelterSupplyValues.push([
        escapeSql(shelterCode),
        escapeSql(supply.id),
        quantity,
      ]);
    }
    
    // Insert shelter supplies in a single batch (since there are only 26 supplies)
    const shelterSupplyInsertStatement = createBatchInsertStatement(
      'shelter_supplies',
      ['shelter_code', 'supply_id', 'quantity'],
      shelterSupplyValues
    );
    
    if (shelterSupplyInsertStatement) {
      console.log(`Inserting ${shelterSupplyValues.length} supplies for shelter: ${shelter['避難所_施設名称']}`);
      await executeD1Command(shelterSupplyInsertStatement);
    }
  }
  
  console.log('Data insertion completed successfully!');
}

// Run the main function
main().catch(error => {
  console.error('Error in main function:', error);
  process.exit(1);
});
