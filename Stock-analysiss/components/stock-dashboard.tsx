"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { Loader2, RefreshCw } from "lucide-react"
import StockList from "@/components/stock-list"
import AgentExplanation from "@/components/agent-explanation"

export default function StockDashboard() {
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [topStocks, setTopStocks] = useState<any[]>([])
  const [marketData, setMarketData] = useState<any>({})

  const runAnalysis = async () => {
    setAnalyzing(true)
    try {
      const response = await fetch("/api/analyze")
      const data = await response.json()
      setTopStocks(data.topStocks)
      setMarketData(data.marketData)
    } catch (error) {
      console.error("Error running analysis:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/market-data")
        const data = await response.json()
        setMarketData(data)

        // Set some sample stocks for initial UI
        setTopStocks([
          { symbol: "AAPL", name: "Apple Inc.", score: 0.92, recommendation: "Buy", price: 187.43, change: 1.23 },
          { symbol: "MSFT", name: "Microsoft Corp.", score: 0.89, recommendation: "Buy", price: 417.88, change: 2.15 },
          { symbol: "AMZN", name: "Amazon.com Inc.", score: 0.85, recommendation: "Buy", price: 178.75, change: -0.45 },
          { symbol: "NVDA", name: "NVIDIA Corp.", score: 0.83, recommendation: "Hold", price: 950.02, change: 5.67 },
          { symbol: "GOOGL", name: "Alphabet Inc.", score: 0.81, recommendation: "Buy", price: 147.68, change: 0.89 },
        ])
      } catch (error) {
        console.error("Error fetching initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Current market conditions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">S&P 500</span>
                  <span className="font-medium">
                    5,187.67 <span className="text-green-500">+0.32%</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NASDAQ</span>
                  <span className="font-medium">
                    16,315.70 <span className="text-green-500">+0.18%</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DOW</span>
                  <span className="font-medium">
                    38,996.39 <span className="text-red-500">-0.12%</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VIX</span>
                  <span className="font-medium">
                    13.72 <span className="text-red-500">-3.45%</span>
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector Performance</CardTitle>
            <CardDescription>Today's sector movements</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PieChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Controls</CardTitle>
            <CardDescription>Run multi-agent analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Run the multi-agent analysis to identify the top 5 investable stocks in the US market based on current
                data.
              </p>
              <Button onClick={runAnalysis} className="w-full" disabled={analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stocks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stocks">Top Stocks</TabsTrigger>
          <TabsTrigger value="charts">Market Charts</TabsTrigger>
          <TabsTrigger value="agents">Agent System</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Recommended Stocks</CardTitle>
              <CardDescription>Based on multi-agent analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <StockList stocks={topStocks} loading={loading || analyzing} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>By sector</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="agents" className="mt-6">
          <AgentExplanation />
        </TabsContent>
      </Tabs>
    </div>
  )
}

