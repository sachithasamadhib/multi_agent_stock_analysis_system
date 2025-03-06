import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AgentExplanation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Agent System Architecture</CardTitle>
          <CardDescription>How our system analyzes stock data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Our multi-agent system uses a hierarchical approach with specialized agents coordinated by a central
              agent. Each agent has a specific role in analyzing different aspects of stock market data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Data Collection Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Gathers real-time and historical stock data from various sources.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Technical Analysis Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluates price patterns, volume, and technical indicators.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Fundamental Analysis Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Assesses company financials, earnings, and growth potential.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Sentiment Analysis Agent</h3>
                <p className="text-sm text-muted-foreground">Analyzes news, social media, and market sentiment.</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Risk Assessment Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluates volatility, market conditions, and potential risks.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-primary/10">
                <h3 className="font-medium mb-2">Coordinator Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Aggregates all analyses and makes final recommendations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Methodology</CardTitle>
          <CardDescription>How stocks are evaluated and ranked</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Our system uses a weighted scoring approach that combines multiple factors:</p>

          <ul className="space-y-2 list-disc pl-5">
            <li>Technical indicators (30%): Moving averages, RSI, MACD, and volume analysis</li>
            <li>Fundamental metrics (30%): P/E ratio, EPS growth, revenue trends, and profit margins</li>
            <li>Market sentiment (20%): News sentiment, analyst ratings, and social media trends</li>
            <li>Risk factors (20%): Volatility, beta, and market correlation</li>
          </ul>

          <p className="mt-4">
            The coordinator agent combines these scores using a proprietary algorithm to identify the top 5 investable
            stocks.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

