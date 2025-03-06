// Alpha Vantage API for stock price data
// Documentation: https://www.alphavantage.co/documentation/

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo"
const BASE_URL = "https://www.alphavantage.co/query"

export async function fetchStockPrices(symbols: string[]) {
  try {
    // For a hackathon, we'll use mock data if no API key is provided
    if (API_KEY === "demo") {
      return generateMockPriceData(symbols)
    }

    // In a real implementation, we would fetch data for each symbol
    const promises = symbols.map((symbol) =>
      fetch(`${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          // Process the data
          const timeSeries = data["Time Series (Daily)"]
          if (!timeSeries) {
            throw new Error(`No data found for ${symbol}`)
          }

          // Convert to array of daily data
          const dailyData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
            date,
            open: Number.parseFloat(values["1. open"]),
            high: Number.parseFloat(values["2. high"]),
            low: Number.parseFloat(values["3. low"]),
            close: Number.parseFloat(values["4. close"]),
            volume: Number.parseInt(values["5. volume"], 10),
          }))

          // Sort by date (newest first)
          dailyData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          return { [symbol]: dailyData }
        }),
    )

    // Combine results
    const results = await Promise.all(promises)
    return results.reduce((acc, result) => ({ ...acc, ...result }), {})
  } catch (error) {
    console.error("Error fetching stock prices:", error)
    // Fallback to mock data in case of error
    return generateMockPriceData(symbols)
  }
}

// Generate mock price data for testing/demo
function generateMockPriceData(symbols: string[]) {
  const result = {}

  symbols.forEach((symbol) => {
    // Generate 30 days of mock data
    const dailyData = []
    let price = getBasePrice(symbol)

    for (let i = 0; i < 30; i++) {
      // Random daily change (-3% to +3%)
      const change = (Math.random() * 6 - 3) / 100

      // Add some trend based on the symbol
      const trend = getTrend(symbol) / 100

      // Calculate new price
      price = price * (1 + change + trend)

      // Generate daily data
      const date = new Date()
      date.setDate(date.getDate() - i)

      dailyData.push({
        date: date.toISOString().split("T")[0],
        open: price * (1 - Math.random() * 0.01),
        high: price * (1 + Math.random() * 0.015),
        low: price * (1 - Math.random() * 0.015),
        close: price,
        volume: Math.floor(1000000 + Math.random() * 9000000),
      })
    }

    result[symbol] = dailyData
  })

  return result
}

// Get base price for mock data
function getBasePrice(symbol: string) {
  const prices = {
    AAPL: 187,
    MSFT: 418,
    AMZN: 179,
    NVDA: 950,
    GOOGL: 148,
    META: 485,
    TSLA: 175,
    JPM: 198,
    V: 275,
    WMT: 60,
  }

  return prices[symbol] || 100
}

// Get trend for mock data (some stocks trend up, some down)
function getTrend(symbol: string) {
  const trends = {
    AAPL: 0.2,
    MSFT: 0.5,
    AMZN: 0.1,
    NVDA: 0.8,
    GOOGL: 0.3,
    META: 0.4,
    TSLA: -0.1,
    JPM: 0.2,
    V: 0.3,
    WMT: 0.1,
  }

  return trends[symbol] || 0
}

