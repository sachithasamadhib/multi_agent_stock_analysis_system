export default function LoadingResults() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <h3 className="text-xl font-semibold text-white">Analyzing Stock Market Data</h3>
      <p className="mt-2 text-slate-300">Our multi-agent system is processing market data...</p>
      <div className="mt-8 grid w-full max-w-4xl gap-4 md:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg bg-slate-800 p-4">
              <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-slate-700"></div>
              <div className="mb-2 h-4 w-full animate-pulse rounded bg-slate-700"></div>
              <div className="mb-2 h-4 w-5/6 animate-pulse rounded bg-slate-700"></div>
              <div className="h-4 w-4/6 animate-pulse rounded bg-slate-700"></div>
            </div>
          ))}
      </div>
    </div>
  )
}

