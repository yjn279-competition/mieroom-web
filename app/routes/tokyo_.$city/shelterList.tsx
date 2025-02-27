import { useMatches, useNavigate } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const shelterData = [
  { id: 1, name: '世田谷区体育館', currentOccupancy: 375, capacity: 500 },
  { id: 2, name: '世田谷区市民センター', currentOccupancy: 180, capacity: 300 },
  { id: 3, name: '世田谷区立学校', currentOccupancy: 340, capacity: 400 },
  { id: 4, name: '世田谷区代々木公園', currentOccupancy: 150, capacity: 200 },
  { id: 5, name: '世田谷区文化センター', currentOccupancy: 220, capacity: 250 },
  { id: 6, name: '世田谷区市民ホール', currentOccupancy: 100, capacity: 150 },
  { id: 7, name: '世田谷区体育館', currentOccupancy: 80, capacity: 100 },
  { id: 8, name: '世田谷区民会館', currentOccupancy: 300, capacity: 400 },
  { id: 9, name: '世田谷区立図書館', currentOccupancy: 50, capacity: 75 },
  { id: 10, name: '世田谷区市民センター', currentOccupancy: 90, capacity: 120 },
  { id: 11, name: '世田谷区立公園', currentOccupancy: 200, capacity: 250 },
  { id: 12, name: '世田谷区文化会館', currentOccupancy: 160, capacity: 200 },
  { id: 13, name: '世田谷区民体育館', currentOccupancy: 120, capacity: 150 },
  { id: 14, name: '世田谷区市民ホール', currentOccupancy: 140, capacity: 180 },
  { id: 15, name: '世田谷区立学校', currentOccupancy: 300, capacity: 350 },
  { id: 16, name: '世田谷区文化センター', currentOccupancy: 110, capacity: 130 },
  { id: 17, name: '世田谷区民会館', currentOccupancy: 70, capacity: 90 },
  { id: 18, name: '世田谷区立公園', currentOccupancy: 130, capacity: 160 },
  { id: 19, name: '世田谷区市民センター', currentOccupancy: 180, capacity: 200 },
  { id: 20, name: '世田谷区立体育館', currentOccupancy: 250, capacity: 300 },
]

export function ShelterList() {
  const navigate = useNavigate();
  const matches = useMatches();
  const { pathname } = matches[1]

  const handleRowClick = (shelterId: number) => {
    const city = pathname.split('/')[2]
    navigate(`/tokyo/${city}/${shelterId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>避難所一覧</CardTitle>
      </CardHeader>
      {/* h-[632px] で container とスタイルが合う */}
      <CardContent className="h-[632px] overflow-auto overscroll-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">避難所名</TableHead>
              <TableHead className="text-center">現在の避難者</TableHead>
              <TableHead className="text-center">収容可能</TableHead>
              <TableHead className="text-center">空き</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shelterData.map((shelter) => (
              <TableRow key={shelter.id} onClick={() => handleRowClick(shelter.id)}>
                <TableCell className="font-medium">{shelter.name}</TableCell>
                <TableCell className="text-center">{shelter.currentOccupancy}</TableCell>
                <TableCell className="text-center">{shelter.capacity}</TableCell>
                <TableCell className="text-center">{shelter.capacity - shelter.currentOccupancy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
