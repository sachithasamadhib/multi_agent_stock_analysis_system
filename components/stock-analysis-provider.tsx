"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { analyzeStocks } from "@/lib/stock-analysis"

export type StockAnalysisContextType = {
  results: StockAnalysisResult[] | null
  loading: boolean
  error: string | null
  runAnalysis: () => Promise<void>
}

export type StockAnalysisResult = {
  symbol: string
  name: string
  price: number
  change: number
  marketCap: string
  score: number
  recommendation: string
  insights: string[]
}

const StockAnalysisContext = createContext<StockAnalysisContextType | undefined>(undefined)

export function StockAnalysisProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<StockAnalysisResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await analyzeStocks()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Run analysis on initial load
  if (!results && !loading && !error) {
    runAnalysis()
  }

  return (
    <StockAnalysisContext.Provider value={{ results, loading, error, runAnalysis }}>
      {children}
    </StockAnalysisContext.Provider>
  )
}

export function useStockAnalysis() {
  const context = useContext(StockAnalysisContext)
  if (context === undefined) {
    throw new Error("useStockAnalysis must be used within a StockAnalysisProvider")
  }
  return context
}

