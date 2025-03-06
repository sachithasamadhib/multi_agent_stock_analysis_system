// News API for sentiment analysis
// Documentation: https://newsapi.org/docs

const API_KEY = process.env.NEWS_API_KEY || "demo"
const BASE_URL = "https://newsapi.org/v2"

export async function fetchNewsSentiment(symbols: string[]) {
  try {
    // For a hackathon, we'll use mock data if no API key is provided
    if (API_KEY === "demo") {
      return generateMockSentimentData(symbols)
    }

    // In a real implementation, we would fetch news for each symbol
    const promises = symbols.map((symbol) =>
      fetch(`${BASE_URL}/everything?q=${symbol}+stock&sortBy=publishedAt&language=en&apiKey=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          // Process the articles
          const articles = data.articles || []

          // Analyze sentiment (in a real app, you'd use NLP)
          let positive = 0
          let negative = 0
          let neutral = 0

          articles.forEach((article) => {
            // Simple keyword-based sentiment analysis
            const title = article.title?.toLowerCase() || ""
            const description = article.description?.toLowerCase() || ""
            const content = title + " " + description

            // Positive keywords
            const positiveKeywords = ["up", "rise", "gain", "growth", "profit", "positive", "buy", "bullish"]
            // Negative keywords
            const negativeKeywords = ["down", "fall", "drop", "loss", "negative", "sell", "bearish"]

            let posCount = 0
            let negCount = 0

            positiveKeywords.forEach((keyword) => {
              if (content.includes(keyword)) posCount++
            })

            negativeKeywords.forEach((keyword) => {
              if (content.includes(keyword)) negCount++
            })

            if (posCount > negCount) positive++
            else if (negCount > posCount) negative++
            else neutral++
          })

          // Mock analyst ratings
          const buy = Math.floor(5 + Math.random() * 10)
          const hold = Math.floor(3 + Math.random() * 5)
          const sell = Math.floor(Math.random() * 5)

          return {
            [symbol]: {
              articles: articles.length,
              positive,
              negative,
              neutral,
              buy,
              hold,
              sell,
            },
          }
        }),
    )

    // Combine results
    const results = await Promise.all(promises)
    return results.reduce((acc, result) => ({ ...acc, ...result }), {})
  } catch (error) {
    console.error("Error fetching news sentiment:", error)
    // Fallback to mock data in case of error
    return generateMockSentimentData(symbols)
  }
}

// Generate mock sentiment data for testing/demo
function generateMockSentimentData(symbols: string[]) {
  const result = {}

  symbols.forEach((symbol) => {
    // Get base sentiment for the symbol
    const baseSentiment = getBaseSentiment(symbol)

    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2

    // Calculate positive and negative sentiment
    let positive = Math.floor(baseSentiment.positive * randomFactor)
    let negative = Math.floor(baseSentiment.negative * randomFactor)

    // Ensure positive + negative doesn't exceed total articles
    const totalArticles = 20
    if (positive + negative > totalArticles) {
      const ratio = totalArticles / (positive + negative)
      positive = Math.floor(positive * ratio)
      negative = Math.floor(negative * ratio)
    }

    const neutral = totalArticles - positive - negative

    // Analyst ratings
    const buy = Math.floor(baseSentiment.buy * randomFactor)
    const hold = Math.floor(baseSentiment.hold * randomFactor)
    const sell = Math.floor(baseSentiment.sell * randomFactor)

    result[symbol] = {
      articles: totalArticles,
      positive,
      negative,
      neutral,
      buy,
      hold,
      sell,
    }
  })

  return result
}

// Base sentiment data for mock generation
function getBaseSentiment(symbol: string) {
  const sentiments = {
    AAPL: {
      positive: 12,
      negative: 5,
      buy: 15,
      hold: 8,
      sell: 2,
    },
    MSFT: {
      positive: 14,
      negative: 3,
      buy: 18,
      hold: 5,
      sell: 1,
    },
    AMZN: {
      positive: 10,
      negative: 7,
      buy: 14,
      hold: 9,
      sell: 2,
    },
    NVDA: {
      positive: 15,
      negative: 2,
      buy: 20,
      hold: 3,
      sell: 1,
    },
    GOOGL: {
      positive: 11,
      negative: 6,
      buy: 16,
      hold: 7,
      sell: 2,
    },
  }

  // Default values for symbols not in the list
  const defaultSentiment = {
    positive: 10,
    negative: 5,
    buy: 12,
    hold: 6,
    sell: 3,
  }

  return sentiments[symbol] || defaultSentiment
}

