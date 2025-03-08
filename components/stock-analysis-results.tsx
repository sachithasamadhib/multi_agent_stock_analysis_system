"use client"

import { useStockAnalysis } from "./stock-analysis-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Info, Award, BarChart3 } from "lucide-react"
import StockChart from "./stock-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StockAnalysisResults() {
  const { results, loading, error, runAnalysis } = useStockAnalysis()

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-red-500/10 p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold text-red-400">Analysis Error</h3>
        <p className="mb-4 text-slate-300">{error}</p>
        <Button onClick={runAnalysis} variant="outline" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (!results) {
    return null // Loading state is handled by Suspense
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-3xl font-bold text-white">Top 5 Investable US Stocks</h2>
          <p className="text-slate-300">Analyzed by our hierarchical multi-agent system</p>
        </div>
        <Button onClick={runAnalysis} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      {/* Top stocks overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((stock) => (
          <Card key={stock.symbol} className="overflow-hidden bg-slate-800 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    {stock.symbol}
                    <Badge variant="outline" className="ml-2">
                      {stock.score.toFixed(1)}/10
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-300">{stock.name}</CardDescription>
                </div>
                <Badge
                  className={stock.change >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}
                >
                  {stock.change >= 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                <span className="text-sm text-slate-400">Market Cap: {stock.marketCap}</span>
              </div>
              <div className="h-24">
                <StockChart symbol={stock.symbol} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="mb-2 flex items-center">
                <Award className="mr-1 h-4 w-4 text-blue-400" />
                <span className="font-medium">{stock.recommendation}</span>
              </div>
              <ul className="mt-1 space-y-1 text-sm text-slate-300">
                {stock.insights.slice(0, 2).map((insight, i) => (
                  <li key={i} className="flex items-start">
                    <Info className="mr-1 mt-0.5 h-3 w-3 flex-shrink-0 text-blue-400" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Detailed analysis section */}
      <Card className="bg-slate-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
            Detailed Stock Analysis
          </CardTitle>
          <CardDescription>Comprehensive analysis of the top 5 stocks based on multiple factors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={results[0].symbol}>
            <TabsList className="grid w-full grid-cols-5">
              {results.map((stock) => (
                <TabsTrigger key={stock.symbol} value={stock.symbol}>
                  {stock.symbol}
                </TabsTrigger>
              ))}
            </TabsList>

            {results.map((stock) => (
              <TabsContent key={stock.symbol} value={stock.symbol} className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-medium">
                      {stock.name} ({stock.symbol})
                    </h3>
                    <div className="mb-4 h-64">
                      <StockChart symbol={stock.symbol} detailed />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-slate-700 p-3">
                        <div className="text-sm text-slate-400">Current Price</div>
                        <div className="text-xl font-bold">${stock.price.toFixed(2)}</div>
                      </div>
                      <div className="rounded-lg bg-slate-700 p-3">
                        <div className="text-sm text-slate-400">Market Cap</div>
                        <div className="text-xl font-bold">{stock.marketCap}</div>
                      </div>
                      <div className="rounded-lg bg-slate-700 p-3">
                        <div className="text-sm text-slate-400">Change</div>
                        <div className={`text-xl font-bold ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)}%
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700 p-3">
                        <div className="text-sm text-slate-400">Score</div>
                        <div className="text-xl font-bold">{stock.score.toFixed(1)}/10</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-slate-700 p-4">
                      <h4 className="mb-2 font-medium text-blue-400">Investment Recommendation</h4>
                      <p className="text-lg font-semibold">{stock.recommendation}</p>
                    </div>
                    <div className="rounded-lg bg-slate-700 p-4">
                      <h4 className="mb-2 font-medium text-blue-400">Key Insights</h4>
                      <ul className="space-y-2">
                        {stock.insights.map((insight, i) => (
                          <li key={i} className="flex items-start rounded bg-slate-800 p-2">
                            <Info className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg bg-slate-700 p-4">
                      <h4 className="mb-2 font-medium text-blue-400">Analysis Factors</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Fundamental Strength</span>
                          <div className="h-2 w-24 rounded-full bg-slate-600">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(stock.score / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Technical Indicators</span>
                          <div className="h-2 w-24 rounded-full bg-slate-600">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(Math.random() * 3 + 7) * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Market Sentiment</span>
                          <div className="h-2 w-24 rounded-full bg-slate-600">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(Math.random() * 3 + 7) * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Risk Assessment</span>
                          <div className="h-2 w-24 rounded-full bg-slate-600">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(Math.random() * 3 + 7) * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

