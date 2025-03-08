import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-24">
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
          <rect fill="none" stroke="#1E88E5" strokeWidth="2" x="0" y="0" width="800" height="800"></rect>
          <path
            fill="none"
            stroke="#1E88E5"
            strokeWidth="2"
            d="M50,250 L150,150 L250,250 L350,50 L450,350 L550,250 L650,150 L750,250"
          ></path>
          <path
            fill="none"
            stroke="#1E88E5"
            strokeWidth="2"
            d="M50,350 L150,250 L250,350 L350,150 L450,450 L550,350 L650,250 L750,350"
          ></path>
          <path
            fill="none"
            stroke="#1E88E5"
            strokeWidth="2"
            d="M50,450 L150,350 L250,450 L350,250 L450,550 L550,450 L650,350 L750,450"
          ></path>
        </svg>
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
          Multi-Agent Stock Analysis
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-300">
          A hierarchical multi-agent system that analyzes US stock market data to identify the top 5 investable stocks.
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400">
            <span>Live Analysis</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

