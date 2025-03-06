import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingDown, TrendingUp } from "lucide-react"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  score: number
  recommendation: string
}

interface StockListProps {
  stocks: Stock[]
  loading: boolean
}

export default function StockList({ stocks, loading }: StockListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Recommendation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.symbol}>
            <TableCell className="font-medium">{stock.symbol}</TableCell>
            <TableCell>{stock.name}</TableCell>
            <TableCell>${stock.price.toFixed(2)}</TableCell>
            <TableCell>
              <div className={`flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}%
              </div>
            </TableCell>
            <TableCell>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${stock.score * 100}%` }}></div>
              </div>
              <span className="text-xs text-muted-foreground">{(stock.score * 100).toFixed(0)}%</span>
            </TableCell>
            <TableCell>
              <Badge variant={stock.recommendation === "Buy" ? "default" : "secondary"}>{stock.recommendation}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

