import StockDashboard from "@/components/stock-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Multi-Agent Stock Analysis System
        </h1>
        <StockDashboard />
      </div>
    </main>
  )
}

