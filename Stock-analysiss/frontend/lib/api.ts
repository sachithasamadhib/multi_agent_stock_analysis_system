const API_BASE_URL = "http://localhost:8000"

export async function analyzeStocks() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`)
    if (!response.ok) {
      throw new Error("Failed to fetch analysis data")
    }
    return await response.json()
  } catch (error) {
    console.error("Error analyzing stocks:", error)
    throw error
  }
}

