import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface TableColumn {
  key: string
  header: string
  align?: "left" | "center" | "right"
  width?: string
  formatter?: (value: any) => React.ReactNode
}

export interface EvacueeData {
  name: string
  age: number
  gender: string
  status: string
  elapsedTime: string
  plannedTime: string
  [key: string]: string | number
}

export interface EvacueesTableProps {
  title?: string
  description?: string
  data: EvacueeData[]
  gender: "男性" | "女性" | "その他" | null
  status: "無事" | "軽傷" | "重体" | "死亡" | "行方不明" | null
  columns?: TableColumn[]
  maxHeight?: string
}

export function EvacueesTable({
  title = "避難者一覧",
  description,
  data,
  gender,
  status,
  columns = [
    { key: "name", header: "氏名", width: "100px" },
    { key: "age", header: "年齢", align: "center" },
    { key: "gender", header: "性別", align: "center" },
    { key: "status", header: "状態", align: "center" },
    { key: "elapsedTime", header: "外出時間", align: "right" },
  ],
  maxHeight = "calc(100vh - 12rem)"
}: EvacueesTableProps) {
  const filteredData = data.filter((person) => {
    if (gender && person.gender !== gender) return false
    if (status && person.status !== status) return false
    return true
  })

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto" style={{ height: maxHeight }}>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={column.width ? `w-[${column.width}]` : ""}
                    style={{
                      textAlign: column.align || "left",
                    }}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${index}-${column.key}`}
                      className={
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : column.key === columns[0].key
                          ? "font-medium"
                          : undefined
                      }
                    >
                      {column.formatter
                        ? column.formatter(row[column.key])
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
