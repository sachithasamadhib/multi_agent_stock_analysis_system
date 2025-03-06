import { NextResponse } from "next/server"
import { fetchStockPrices } from "@/lib/api/alpha-vantage"
import { fetchCompanyFundamentals } from "@/lib/api/financial-modeling-prep"
import { fetchNewsSentiment } from "@/lib/api/news-api"

// This is the coordinator agent that combines data from all other agents
export async function GET() {
  try {
    // Step 1: Data Collection Agent - Gather data from multiple sources
    const [priceData, fundamentalsData, sentimentData] = await Promise.all([
      fetchStockPrices(["AAPL", "MSFT", "AMZN", "NVDA", "GOOGL", "META", "TSLA", "JPM", "V", "WMT"]),
      fetchCompanyFundamentals(["AAPL", "MSFT", "AMZN", "NVDA", "GOOGL", "META", "TSLA", "JPM", "V", "WMT"]),
      fetchNewsSentiment(["AAPL", "MSFT", "AMZN", "NVDA", "GOOGL", "META", "TSLA", "JPM", "V", "WMT"]),
    ])

    // Step 2: Technical Analysis Agent - Analyze price patterns and indicators
    const technicalScores = analyzeTechnicalFactors(priceData)

    // Step 3: Fundamental Analysis Agent - Evaluate company financials
    const fundamentalScores = analyzeFundamentalFactors(fundamentalsData)

    // Step 4: Sentiment Analysis Agent - Analyze news and market sentiment
    const sentimentScores = analyzeSentimentFactors(sentimentData)

    // Step 5: Risk Assessment Agent - Evaluate volatility and market conditions
    const riskScores = assessRiskFactors(priceData)

    // Step 6: Coordinator Agent - Combine all analyses and rank stocks
    const combinedScores = combineScores(technicalScores, fundamentalScores, sentimentScores, riskScores)

    // Get the top 5 stocks
    const topStocks = getTopStocks(combinedScores, priceData, 5)

    // Get market data summary
    const marketData = summarizeMarketData(priceData)

    return NextResponse.json({ topStocks, marketData })
  } catch (error) {
    console.error("Error in analysis:", error)
    return NextResponse.json({ error: "Failed to analyze stocks" }, { status: 500 })
  }
}

// Technical Analysis Agent
function analyzeTechnicalFactors(priceData) {
  const scores = {}

  // Calculate technical scores based on price data
  // In a real implementation, this would include moving averages, RSI, MACD, etc.
  Object.keys(priceData).forEach((symbol) => {
    const data = priceData[symbol]

    // Simple scoring based on price momentum (last 5 days)
    const priceChanges = data.slice(0, 5).map((d, i) => {
      if (i === 0) return 0
      return ((d.close - data[i - 1].close) / data[i - 1].close) * 100
    })

    const momentum = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length

    // Volume trend
    const volumeChanges = data.slice(0, 5).map((d, i) => {
      if (i === 0) return 0
      return ((d.volume - data[i - 1].volume) / data[i - 1].volume) * 100
    })

    const volumeTrend = volumeChanges.reduce((sum, change) => sum + change, 0) / volumeChanges.length

    // Combine factors into a technical score (0-1)
    scores[symbol] = Math.min(1, Math.max(0, 0.5 + momentum * 0.03 + volumeTrend * 0.01))
  })

  return scores
}

// Fundamental Analysis Agent
function analyzeFundamentalFactors(fundamentalsData) {
  const scores = {}

  // Calculate fundamental scores based on company data
  // In a real implementation, this would include P/E ratio, EPS growth, etc.
  Object.keys(fundamentalsData).forEach((symbol) => {
    const data = fundamentalsData[symbol]

    // Simple scoring based on P/E ratio (lower is better, but not negative)
    let peScore = 0
    if (data.peRatio > 0) {
      peScore = Math.min(1, Math.max(0, 1 - data.peRatio / 50))
    }

    // EPS growth score
    const epsGrowthScore = Math.min(1, Math.max(0, 0.5 + data.epsGrowth * 0.05))

    // Revenue growth score
    const revenueGrowthScore = Math.min(1, Math.max(0, 0.5 + data.revenueGrowth * 0.05))

    // Combine factors into a fundamental score (0-1)
    scores[symbol] = peScore * 0.3 + epsGrowthScore * 0.4 + revenueGrowthScore * 0.3
  })

  return scores
}

// Sentiment Analysis Agent
function analyzeSentimentFactors(sentimentData) {
  const scores = {}

  // Calculate sentiment scores based on news and social media
  Object.keys(sentimentData).forEach((symbol) => {
    const data = sentimentData[symbol]

    // News sentiment score
    const newsSentimentScore = (data.positive - data.negative + 1) / 2

    // Analyst ratings score
    const analystScore = (data.buy - data.sell + 1) / 2

    // Combine factors into a sentiment score (0-1)
    scores[symbol] = newsSentimentScore * 0.6 + analystScore * 0.4
  })

  return scores
}

// Risk Assessment Agent
function assessRiskFactors(priceData) {
  const scores = {}

  // Calculate risk scores based on volatility and market conditions
  Object.keys(priceData).forEach((symbol) => {
    const data = priceData[symbol]

    // Calculate volatility (standard deviation of daily returns)
    const returns = data.slice(0, 20).map((d, i) => {
      if (i === 0) return 0
      return (d.close - data[i - 1].close) / data[i - 1].close
    })

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
    const volatility = Math.sqrt(variance)

    // Volatility score (lower volatility = higher score)
    const volatilityScore = Math.min(1, Math.max(0, 1 - volatility * 10))

    // Combine factors into a risk score (0-1)
    scores[symbol] = volatilityScore
  })

  return scores
}

// Coordinator Agent - Combine all scores
function combineScores(technicalScores, fundamentalScores, sentimentScores, riskScores) {
  const combinedScores = {}

  // Weights for each factor
  const weights = {
    technical: 0.3,
    fundamental: 0.3,
    sentiment: 0.2,
    risk: 0.2,
  }

  // Combine scores for each stock
  Object.keys(technicalScores).forEach((symbol) => {
    combinedScores[symbol] =
      technicalScores[symbol] * weights.technical +
      fundamentalScores[symbol] * weights.fundamental +
      sentimentScores[symbol] * weights.sentiment +
      riskScores[symbol] * weights.risk
  })

  return combinedScores
}

// Get top N stocks based on combined scores
function getTopStocks(combinedScores, priceData, n) {
  // Convert scores to array for sorting
  const stockScores = Object.keys(combinedScores).map((symbol) => ({
    symbol,
    score: combinedScores[symbol],
  }))

  // Sort by score (descending)
  stockScores.sort((a, b) => b.score - a.score)

  // Take top N stocks and add additional data
  return stockScores.slice(0, n).map((stock) => {
    const symbol = stock.symbol
    const latestPrice = priceData[symbol][0].close
    const previousPrice = priceData[symbol][1].close
    const change = ((latestPrice - previousPrice) / previousPrice) * 100

    // Determine recommendation based on score
    let recommendation = "Hold"
    if (stock.score > 0.8) recommendation = "Buy"
    else if (stock.score < 0.4) recommendation = "Sell"

    // Get company name (in a real app, this would come from the API)
    const companyNames = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corp.",
      AMZN: "Amazon.com Inc.",
      NVDA: "NVIDIA Corp.",
      GOOGL: "Alphabet Inc.",
      META: "Meta Platforms Inc.",
      TSLA: "Tesla Inc.",
      JPM: "JPMorgan Chase & Co.",
      V: "Visa Inc.",
      WMT: "Walmart Inc.",
    }

    return {
      symbol,
      name: companyNames[symbol] || symbol,
      score: stock.score,
      recommendation,
      price: latestPrice,
      change,
    }
  })
}

// Summarize market data
function summarizeMarketData(priceData) {
  // In a real implementation, this would include indices, sector performance, etc.
  return {
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
  }
}

