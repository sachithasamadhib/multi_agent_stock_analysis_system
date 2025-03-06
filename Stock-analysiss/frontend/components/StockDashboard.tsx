"use client"

import { useState, useEffect } from "react"
import { analyzeStocks } from "@/lib/api"
import styles from "@/styles/StockDashboard.module.css"

export default function StockDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await analyzeStocks()
      setData(result)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>No data available</div>
  }

  return (
    <div className={styles.dashboard}>
      <h2>Market Overview</h2>
      <div className={styles.marketOverview}>
        {Object.entries(data.marketData.indices).map(([name, index]: [string, any]) => (
          <div key={name} className={styles.indexCard}>
            <h3>{name}</h3>
            <p>Value: {index.value.toFixed(2)}</p>
            <p className={index.change >= 0 ? styles.positive : styles.negative}>Change: {index.change.toFixed(2)}%</p>
          </div>
        ))}
      </div>

      <h2>Top Stocks</h2>
      <table className={styles.stockTable}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Score</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {data.topStocks.map((stock: any) => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.name}</td>
              <td>${stock.price.toFixed(2)}</td>
              <td className={stock.change >= 0 ? styles.positive : styles.negative}>{stock.change.toFixed(2)}%</td>
              <td>{(stock.score * 100).toFixed(0)}%</td>
              <td>{stock.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={fetchData} className={styles.refreshButton}>
        Refresh Data
      </button>
    </div>
  )
}

