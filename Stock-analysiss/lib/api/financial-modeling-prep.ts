// Financial Modeling Prep API for company fundamentals
// Documentation: https://site.financialmodelingprep.com/developer/docs/

const API_KEY = process.env.FMP_API_KEY || "demo"
const BASE_URL = "https://financialmodelingprep.com/api/v3"

export async function fetchCompanyFundamentals(symbols: string[]) {
  try {
    // For a hackathon, we'll use mock data if no API key is provided
    if (API_KEY === "demo") {
      return generateMockFundamentalsData(symbols)
    }

    // In a real implementation, we would fetch data for each symbol
    const promises = symbols.map((symbol) =>
      fetch(`${BASE_URL}/profile/${symbol}?apikey=${API_KEY}`)
        .then((res) => res.json())
        .then(async (profileData) => {
          // Fetch financial ratios
          const ratiosResponse = await fetch(`${BASE_URL}/ratios/${symbol}?limit=1&apikey=${API_KEY}`)
          const ratiosData = await ratiosResponse.json()

          // Fetch growth metrics
          const growthResponse = await fetch(`${BASE_URL}/financial-growth/${symbol}?limit=4&apikey=${API_KEY}`)
          const growthData = await growthResponse.json()

          // Combine the data
          return {
            [symbol]: {
              companyName: profileData[0]?.companyName || symbol,
              sector: profileData[0]?.sector || "Unknown",
              industry: profileData[0]?.industry || "Unknown",
              marketCap: profileData[0]?.mktCap || 0,
              peRatio: profileData[0]?.pe || 0,
              dividend: profileData[0]?.lastDiv || 0,
              beta: profileData[0]?.beta || 1,
              // Financial ratios
              priceToBook: ratiosData[0]?.priceToBookRatio || 0,
              priceToSales: ratiosData[0]?.priceToSalesRatio || 0,
              debtToEquity: ratiosData[0]?.debtToEquity || 0,
              // Growth metrics
              epsGrowth: calculateGrowth(growthData, "epsgrowth"),
              revenueGrowth: calculateGrowth(growthData, "revenuegrowth"),
              netIncomeGrowth: calculateGrowth(growthData, "netIncomegrowth"),
            },
          }
        }),
    )

    // Combine results
    const results = await Promise.all(promises)
    return results.reduce((acc, result) => ({ ...acc, ...result }), {})
  } catch (error) {
    console.error("Error fetching company fundamentals:", error)
    // Fallback to mock data in case of error
    return generateMockFundamentalsData(symbols)
  }
}

// Calculate average growth from growth data
function calculateGrowth(growthData, field) {
  if (!growthData || !growthData.length) return 0

  // Calculate average growth over available periods
  const growthValues = growthData.filter((item) => item[field] !== undefined).map((item) => item[field])

  if (growthValues.length === 0) return 0

  return growthValues.reduce((sum, value) => sum + value, 0) / growthValues.length
}

// Generate mock fundamentals data for testing/demo
function generateMockFundamentalsData(symbols: string[]) {
  const result = {}

  symbols.forEach((symbol) => {
    // Get base data for the symbol
    const baseData = getBaseFundamentals(symbol)

    // Add some randomness
    const randomFactor = 0.9 + Math.random() * 0.2 // 0.9 to 1.1

    result[symbol] = {
      companyName: baseData.companyName,
      sector: baseData.sector,
      industry: baseData.industry,
      marketCap: baseData.marketCap * randomFactor,
      peRatio: baseData.peRatio * randomFactor,
      dividend: baseData.dividend,
      beta: baseData.beta * randomFactor,
      priceToBook: baseData.priceToBook * randomFactor,
      priceToSales: baseData.priceToSales * randomFactor,
      debtToEquity: baseData.debtToEquity * randomFactor,
      epsGrowth: baseData.epsGrowth * randomFactor,
      revenueGrowth: baseData.revenueGrowth * randomFactor,
      netIncomeGrowth: baseData.netIncomeGrowth * randomFactor,
    }
  })

  return result
}

// Base fundamentals data for mock generation
function getBaseFundamentals(symbol: string) {
  const fundamentals = {
    AAPL: {
      companyName: "Apple Inc.",
      sector: "Technology",
      industry: "Consumer Electronics",
      marketCap: 3000000000000,
      peRatio: 32.5,
      dividend: 0.92,
      beta: 1.2,
      priceToBook: 45.6,
      priceToSales: 8.2,
      debtToEquity: 1.5,
      epsGrowth: 0.15,
      revenueGrowth: 0.08,
      netIncomeGrowth: 0.12,
    },
    MSFT: {
      companyName: "Microsoft Corp.",
      sector: "Technology",
      industry: "Software",
      marketCap: 2800000000000,
      peRatio: 38.2,
      dividend: 0.68,
      beta: 0.9,
      priceToBook: 15.3,
      priceToSales: 12.5,
      debtToEquity: 0.4,
      epsGrowth: 0.18,
      revenueGrowth: 0.16,
      netIncomeGrowth: 0.2,
    },
    AMZN: {
      companyName: "Amazon.com Inc.",
      sector: "Consumer Cyclical",
      industry: "Internet Retail",
      marketCap: 1800000000000,
      peRatio: 60.8,
      dividend: 0,
      beta: 1.3,
      priceToBook: 8.7,
      priceToSales: 3.2,
      debtToEquity: 0.6,
      epsGrowth: 0.25,
      revenueGrowth: 0.12,
      netIncomeGrowth: 0.18,
    },
    NVDA: {
      companyName: "NVIDIA Corp.",
      sector: "Technology",
      industry: "Semiconductors",
      marketCap: 2300000000000,
      peRatio: 75.3,
      dividend: 0.04,
      beta: 1.7,
      priceToBook: 35.2,
      priceToSales: 25.8,
      debtToEquity: 0.3,
      epsGrowth: 0.65,
      revenueGrowth: 0.55,
      netIncomeGrowth: 0.7,
    },
    GOOGL: {
      companyName: "Alphabet Inc.",
      sector: "Communication Services",
      industry: "Internet Content & Information",
      marketCap: 1900000000000,
      peRatio: 28.5,
      dividend: 0,
      beta: 1.1,
      priceToBook: 6.2,
      priceToSales: 6.8,
      debtToEquity: 0.1,
      epsGrowth: 0.12,
      revenueGrowth: 0.15,
      netIncomeGrowth: 0.1,
    },
  }

  // Default values for symbols not in the list
  const defaultFundamentals = {
    companyName: symbol,
    sector: "Unknown",
    industry: "Unknown",
    marketCap: 100000000000,
    peRatio: 20,
    dividend: 0.5,
    beta: 1.0,
    priceToBook: 5.0,
    priceToSales: 5.0,
    debtToEquity: 0.5,
    epsGrowth: 0.1,
    revenueGrowth: 0.1,
    netIncomeGrowth: 0.1,
  }

  return fundamentals[symbol] || defaultFundamentals
}

