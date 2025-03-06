"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { Loader2, RefreshCw } from "lucide-react"
import StockList from "@/components/stock-list"
import AgentExplanation from "@/components/agent-explanation"
import { analyzeStocks } from "@/lib/api"

export default function StockDashboard() {
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [topStocks, setTopStocks] = useState<any[]>([])
  const [marketData, setMarketData] = useState<any>({})

  const runAnalysis = async () => {
    setAnalyzing(true)
    try {
      const data = await analyzeStocks()
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
        const data = await analyzeStocks()
        setTopStocks(data.topStocks)
        setMarketData(data.marketData)
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
                {Object.entries(marketData.indices || {}).map(([name, data]: [string, any]) => (
                  <div key={name} className="flex justify-between">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-medium">
                      {data.value.toFixed(2)}
                      <span className={data.change >= 0 ? "text-green-500" : "text-red-500"}>
                        {data.change >= 0 ? "+" : ""}
                        {data.change.toFixed(2)}%
                      </span>
                    </span>
                  </div>
                ))}
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
              <PieChart data={marketData.sectors || {}} />
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
                <LineChart data={marketData.indices || {}} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>By sector</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={marketData.sectors || {}} />
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

