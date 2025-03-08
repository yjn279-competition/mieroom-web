import { useState, useEffect } from "react";
import { useParams, useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import type { Shelter } from "../tokyo_.$city/route";
import { Button } from "@/components/ui/button";

// Map of city name in URL to city name in JSON
const cityNameMap: Record<string, string> = {
  'chiyoda': '千代田区',
  'chuo': '中央区',
  'minato': '港区',
  'shinjuku': '新宿区',
  'bunkyo': '文京区',
  'taito': '台東区',
  'sumida': '墨田区',
  'koto': '江東区',
  'shinagawa': '品川区',
  'meguro': '目黒区',
  'ota': '大田区',
  'setagaya': '世田谷区',
  'shibuya': '渋谷区',
  'nakano': '中野区',
  'suginami': '杉並区',
  'toshima': '豊島区',
  'kita': '北区',
  'arakawa': '荒川区',
  'itabashi': '板橋区',
  'nerima': '練馬区',
  'adachi': '足立区',
  'katsushika': '葛飾区',
  'edogawa': '江戸川区',
};

// ローダーの戻り値の型を定義
type LoaderData = {
  shelter: Shelter | null;
};

export const loader: LoaderFunction = async ({ params, request }): Promise<LoaderData> => {
  const cityParam = params.city || '';
  const shelterIndex = parseInt(params.shelter || '0', 10);
  const cityNameInJapanese = cityNameMap[cityParam] || cityParam;
  
  // 避難所データの読み込み
  const sheltersUrl = new URL("/data/shelters.json", request.url);
  const sheltersResponse = await fetch(sheltersUrl.href);
  const shelters = await sheltersResponse.json() as Shelter[];
  
  // 避難所を市区町村でフィルタリング
  const filteredShelters = shelters.filter(
    (shelter: Shelter) => shelter.指定市区町村名 === cityNameInJapanese
  );
  
  // 特定の避難所を取得
  const selectedShelter = filteredShelters[shelterIndex] || null;
  
  return { shelter: selectedShelter };
};

// セキュアなトークンを生成する関数
const generateSecureToken = (shelterId: string): string => {
  const timestamp = Date.now();  // 現在のタイムスタンプを取得
  const uuid = uuidv4();  // UUIDを生成
  
  return `${shelterId}-${timestamp}-${uuid}`;
}

export default function QRCodePage() {
  const { shelter } = useLoaderData<LoaderData>();
  const params = useParams();
  
  const shelterId = params.shelter;
  const shelterName = shelter ? shelter['避難所_施設名称'] : "避難所";  // 避難所名を取得
  const qrValue = generateSecureToken(shelterId ?? '');
    
  console.log('QRコードID:', qrValue);

  return (
    <div className="w-full p-8">
      <div className="grid gap-8 items-center justify-items-center">
        <div className="text-center grid gap-4">
          <h1 className="text-3xl font-bold">{shelterName} 受付QRコード</h1>
          <p className="text-lg">このQRコードを避難者に提示して、受付を行ってください。</p>
        </div>
        <div className="grid gap-4 items-center justify-items-center">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            {qrValue && (
              <QRCodeSVG
                value={`${qrValue}`}
                size={420}
                level="H"  // 高い誤り訂正レベル
              />
            )}
          </div>
          <p className="text-md">生成日時: {new Date().toLocaleString()}</p>
        </div>
        <Button asChild>
          <Link to={`/tokyo/${params.city}/${params.shelter}`}>
            ダッシュボードに戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
