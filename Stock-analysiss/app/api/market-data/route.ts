import { NextResponse } from "next/server"

export async function GET() {
  // In a real implementation, you would fetch data from a stock API
  // For the hackathon, we're using mock data

  const marketData = {
    indices: {
      sp500: { value: 5187.67, change: 0.32 },
      nasdaq: { value: 16315.7, change: 0.18 },
      dow: { value: 38996.39, change: -0.12 },
      vix: { value: 13.72, change: -3.45 },
    },
    sectors: {
      technology: { performance: 1.2, weight: 35 },
      healthcare: { performance: 0.5, weight: 20 },
      financials: { performance: -0.3, weight: 15 },
      energy: { performance: 1.8, weight: 10 },
      consumer: { performance: 0.2, weight: 12 },
      utilities: { performance: -0.5, weight: 8 },
    },
    topMovers: [
      { symbol: "NVDA", change: 5.67 },
      { symbol: "TSLA", change: 3.21 },
      { symbol: "AMD", change: 2.85 },
      { symbol: "ORCL", change: -2.14 },
      { symbol: "META", change: 1.92 },
    ],
  }

  return NextResponse.json(marketData)
}

