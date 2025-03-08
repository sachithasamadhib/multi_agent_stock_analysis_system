import { Suspense } from "react"
import StockAnalysisResults from "@/components/stock-analysis-results"
import { StockAnalysisProvider } from "@/components/stock-analysis-provider"
import LoadingResults from "@/components/loading-results"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <HeroSection />
      <StockAnalysisProvider>
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingResults />}>
            <StockAnalysisResults />
          </Suspense>
        </div>
      </StockAnalysisProvider>
    </main>
  )
}

