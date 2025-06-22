import { useState } from "react"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

export interface TableColumn {
  key: string
  header: string
  align?: "left" | "center" | "right"
  width?: string
  formatter?: (value: any) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
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
  sortKey?: string
  sortDirection?: "asc" | "desc"
  onSort?: (key: string) => void
}

export function EvacueesTable({
  title = "避難者一覧",
  description,
  data,
  gender,
  status,
  columns = [
    { key: "name", header: "氏名", width: "100px", sortable: true, filterable: true },
    { key: "age", header: "年齢", align: "center", sortable: true, filterable: true },
    { key: "gender", header: "性別", align: "center", sortable: true, filterable: true },
    { key: "status", header: "状態", align: "center", sortable: true, filterable: true },
    { key: "elapsedTime", header: "外出時間", align: "right", sortable: true, filterable: true },
  ],
  maxHeight = "calc(100vh - 12rem)",
  sortKey,
  sortDirection = "asc",
  onSort
}: EvacueesTableProps) {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  const filteredData = data.filter((person) => {
    // 性別と状態のフィルタリング
    if (gender && person.gender !== gender) return false;
    if (status && person.status !== status) return false;
    
    // 各カラムのフィルタリング
    for (const [key, filterValue] of Object.entries(columnFilters)) {
      if (filterValue && String(person[key]).toLowerCase().indexOf(filterValue.toLowerCase()) === -1) {
        return false;
      }
    }
    
    return true;
  });

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
                    className={`${column.width ? `w-[${column.width}]` : ""} relative`}
                    style={{
                      textAlign: column.align || "left",
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {column.sortable && onSort ? (
                        <button
                          onClick={() => onSort(column.key)}
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          {column.header}
                          {sortKey === column.key && (
                            sortDirection === "asc" ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      ) : (
                        column.header
                      )}
                      
                      {column.filterable && (
                        <Popover>
                          <PopoverTrigger>
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-muted">
                              <Filter className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 p-2">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">{column.header}でフィルタ</h4>
                              <Input
                                placeholder="フィルタ..."
                                value={columnFilters[column.key] || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setColumnFilters({
                                    ...columnFilters,
                                    [column.key]: e.target.value
                                  });
                                }}
                              />
                              <div className="flex justify-between">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const newFilters = {...columnFilters};
                                    delete newFilters[column.key];
                                    setColumnFilters(newFilters);
                                  }}
                                >
                                  クリア
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    // ポップオーバーを閉じる（実装によっては不要）
                                  }}
                                >
                                  適用
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
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
