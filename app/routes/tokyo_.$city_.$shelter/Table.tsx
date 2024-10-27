import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const outData = [
  { name: '山田太郎', age: 45, gender: '男性', elapsedTime: '2:30', plannedTime: '2:00' },
  { name: '佐藤花子', age: 32, gender: '女性', elapsedTime: '1:45', plannedTime: '2:00' },
  { name: '鈴木一郎', age: 58, gender: '男性', elapsedTime: '3:15', plannedTime: '3:00' },
  { name: '田中美咲', age: 28, gender: '女性', elapsedTime: '0:45', plannedTime: '1:00' },
  { name: '高橋健太', age: 52, gender: '男性', elapsedTime: '4:00', plannedTime: '3:30' },
  { name: '渡辺明子', age: 39, gender: '女性', elapsedTime: '2:15', plannedTime: '2:30' },
  { name: '伊藤大輔', age: 41, gender: '男性', elapsedTime: '1:30', plannedTime: '1:45' },
  { name: '小林由美', age: 36, gender: '女性', elapsedTime: '3:45', plannedTime: '3:00' },
  { name: '加藤正樹', age: 63, gender: '男性', elapsedTime: '2:00', plannedTime: '2:15' },
  { name: '吉田恵子', age: 47, gender: '女性', elapsedTime: '1:15', plannedTime: '1:30' },
  { name: '山本和也', age: 33, gender: '男性', elapsedTime: '0:30', plannedTime: '1:00' },
  { name: '中村真理', age: 29, gender: '女性', elapsedTime: '2:45', plannedTime: '2:30' },
  { name: '斎藤健一', age: 55, gender: '男性', elapsedTime: '3:30', plannedTime: '3:15' },
  { name: '松本さくら', age: 26, gender: '女性', elapsedTime: '1:00', plannedTime: '1:15' },
  { name: '木村拓哉', age: 49, gender: '男性', elapsedTime: '2:30', plannedTime: '2:45' },
  { name: '林美穂', age: 37, gender: '女性', elapsedTime: '3:00', plannedTime: '2:45' },
  { name: '清水俊介', age: 44, gender: '男性', elapsedTime: '1:45', plannedTime: '2:00' },
  { name: '阿部千尋', age: 31, gender: '女性', elapsedTime: '2:15', plannedTime: '2:00' },
  { name: '山口博之', age: 59, gender: '男性', elapsedTime: '4:15', plannedTime: '3:45' },
  { name: '池田美香', age: 35, gender: '女性', elapsedTime: '1:30', plannedTime: '1:45' },
  { name: '橋本健太郎', age: 42, gender: '男性', elapsedTime: '2:45', plannedTime: '2:30' },
  { name: '森田優子', age: 27, gender: '女性', elapsedTime: '0:45', plannedTime: '1:00' },
  { name: '長谷川誠', age: 51, gender: '男性', elapsedTime: '3:30', plannedTime: '3:15' },
  { name: '石川裕子', age: 38, gender: '女性', elapsedTime: '2:00', plannedTime: '2:15' },
  { name: '前田隆太', age: 46, gender: '男性', elapsedTime: '1:15', plannedTime: '1:30' },
  { name: '藤田麻衣', age: 30, gender: '女性', elapsedTime: '3:45', plannedTime: '3:30' },
  { name: '中島健二', age: 57, gender: '男性', elapsedTime: '2:30', plannedTime: '2:45' },
  { name: '岡田美咲', age: 34, gender: '女性', elapsedTime: '1:00', plannedTime: '1:15' },
  { name: '後藤雄太', age: 40, gender: '男性', elapsedTime: '2:15', plannedTime: '2:00' },
  { name: '村上愛子', age: 25, gender: '女性', elapsedTime: '0:30', plannedTime: '1:00' },
  { name: '近藤勇', age: 61, gender: '男性', elapsedTime: '4:00', plannedTime: '3:30' },
  { name: '遠藤真由美', age: 43, gender: '女性', elapsedTime: '2:45', plannedTime: '2:30' },
  { name: '川島直人', age: 48, gender: '男性', elapsedTime: '3:15', plannedTime: '3:00' },
  { name: '野村智子', age: 39, gender: '女性', elapsedTime: '1:45', plannedTime: '2:00' },
  { name: '坂本龍一', age: 54, gender: '男性', elapsedTime: '2:30', plannedTime: '2:15' },
  { name: '大野美香', age: 29, gender: '女性', elapsedTime: '0:45', plannedTime: '1:15' },
  { name: '菊池健太', age: 47, gender: '男性', elapsedTime: '3:30', plannedTime: '3:00' },
  { name: '原田由美子', age: 36, gender: '女性', elapsedTime: '2:15', plannedTime: '2:30' },
  { name: '西田隆志', age: 50, gender: '男性', elapsedTime: '1:30', plannedTime: '2:00' },
  { name: '杉山真理', age: 33, gender: '女性', elapsedTime: '3:45', plannedTime: '3:15' },
  { name: '竹内浩二', age: 62, gender: '男性', elapsedTime: '4:15', plannedTime: '3:45' },
  { name: '平野美穂', age: 28, gender: '女性', elapsedTime: '1:00', plannedTime: '1:30' },
  { name: '福田健一', age: 45, gender: '男性', elapsedTime: '2:45', plannedTime: '2:30' },
  { name: '内田さおり', age: 31, gender: '女性', elapsedTime: '0:30', plannedTime: '1:00' },
  { name: '横山隆', age: 56, gender: '男性', elapsedTime: '3:15', plannedTime: '3:00' },
  { name: '柴田美咲', age: 27, gender: '女性', elapsedTime: '1:15', plannedTime: '1:45' },
  { name: '宮崎健太郎', age: 41, gender: '男性', elapsedTime: '2:30', plannedTime: '2:15' },
  { name: '榊原由美', age: 38, gender: '女性', elapsedTime: '3:00', plannedTime: '2:45' },
  { name: '岩田誠', age: 53, gender: '男性', elapsedTime: '1:45', plannedTime: '2:00' },
  { name: '浜田真理子', age: 30, gender: '女性', elapsedTime: '2:15', plannedTime: '2:30' },
  { name: '小川健太', age: 44, gender: '男性', elapsedTime: '3:45', plannedTime: '3:30' },
  { name: '北村美香', age: 35, gender: '女性', elapsedTime: '1:30', plannedTime: '2:00' },
]

export function OutTable({
  gender,
}: {
  gender: "男性" | "女性" | "その他" | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>外出中の避難市民</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">氏名</TableHead>
              <TableHead>年齢</TableHead>
              <TableHead>性別</TableHead>
              <TableHead className="text-right">経過時間</TableHead>
              <TableHead className="text-right">予定時間</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {outData.filter((person) => gender === null || person.gender === gender).map((person) => (
            <TableRow key={person.name}>
              <TableCell className="font-medium">{person.name}</TableCell>
              <TableCell>{person.age}</TableCell>
              <TableCell>{person.gender}</TableCell>
              <TableCell className="text-right">{person.elapsedTime}</TableCell>
              <TableCell className="text-right">{person.plannedTime}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
