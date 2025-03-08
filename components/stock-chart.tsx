"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type StockChartProps = {
  symbol: string
  detailed?: boolean
}

export default function StockChart({ symbol, detailed = false }: StockChartProps) {
  const [data, setData] = useState<{ date: string; value: number }[]>([])

  useEffect(() => {
    // In a real app, this would fetch from Yahoo Finance API
    // For the hackathon, we'll simulate realistic stock data
    const fetchStockData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Generate realistic stock data based on the symbol
        const stockData = generateRealisticStockData(symbol)
        setData(stockData)
      } catch (error) {
        console.error("Error fetching stock data:", error)
      }
    }

    fetchStockData()
  }, [symbol])

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        <span className="ml-2 text-sm">Loading {symbol} data...</span>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {detailed ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(value) => value.split("-")[1] + "/" + value.split("-")[2]}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(value) => "$" + value.toFixed(0)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-md">
                      <p className="text-xs text-slate-400">{payload[0].payload.date}</p>
                      <p className="font-medium text-white">${payload[0].value?.toFixed(2)}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#3b82f6", stroke: "#1e3a8a" }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <Line type="monotone" dataKey="value" stroke="var(--color-price)" strokeWidth={2} dot={false} />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{payload[0].payload.date}</span>
                        <span className="font-bold">${payload[0].value?.toFixed(2)}</span>
                      </div>
                    </ChartTooltipContent>
                  )
                }
                return null
              }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  )
}

// Generate realistic stock data based on the symbol
function generateRealisticStockData(symbol: string) {
  // Base values for different stocks
  const baseValues: Record<string, number> = {
    AAPL: 189.84,
    MSFT: 425.52,
    NVDA: 950.02,
    AMZN: 178.75,
    GOOGL: 147.68,
    // Default value if symbol not found
    DEFAULT: 100.0,
  }

  // Get base price for this symbol
  const basePrice = baseValues[symbol] || baseValues["DEFAULT"]

  // Volatility based on the stock (NVDA more volatile than MSFT for example)
  const volatilityMap: Record<string, number> = {
    AAPL: 1.2,
    MSFT: 1.0,
    NVDA: 2.5,
    AMZN: 1.8,
    GOOGL: 1.5,
    DEFAULT: 1.5,
  }

  const volatility = volatilityMap[symbol] || volatilityMap["DEFAULT"]

  // Generate 30 days of data
  const result = []
  let currentValue = basePrice

  // Start from 30 days ago
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  for (let i = 0; i < 30; i++) {
    // More realistic market movements
    // Weekend days have no change
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const dayOfWeek = currentDate.getDay()

    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Market movements are often correlated
      // Use a random walk with momentum
      const momentum = i > 0 ? (result[result.length - 1].value > currentValue ? 0.1 : -0.1) : 0

      const change = (Math.random() - 0.5 + momentum) * volatility
      currentValue = currentValue * (1 + change / 100)
    }

    // Format date as YYYY-MM-DD
    const dateStr = currentDate.toISOString().split("T")[0]

    result.push({
      date: dateStr,
      value: Number.parseFloat(currentValue.toFixed(2)),
    })
  }

  return result
}

