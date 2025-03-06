"use client"

import { useEffect, useRef } from "react"

export function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Sample data - in a real app, this would come from your API
    const data = [
      { date: "03/01", value: 100 },
      { date: "03/05", value: 120 },
      { date: "03/10", value: 115 },
      { date: "03/15", value: 130 },
      { date: "03/20", value: 125 },
      { date: "03/25", value: 140 },
      { date: "03/30", value: 135 },
    ]

    // Find min and max values
    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1
    const minValue = Math.min(...data.map((d) => d.value)) * 0.9

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw data points and lines
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2

    data.forEach((point, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1)
      const y = height - padding - ((point.value - minValue) / (maxValue - minValue)) * (height - 2 * padding)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw date label
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(point.date, x, height - padding + 15)
    })

    ctx.stroke()

    // Draw value labels on y-axis
    const steps = 5
    for (let i = 0; i <= steps; i++) {
      const value = minValue + (maxValue - minValue) * (i / steps)
      const y = height - padding - (i / steps) * (height - 2 * padding)

      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(value.toFixed(0), padding - 10, y + 3)

      // Draw grid line
      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0"
      ctx.setLineDash([2, 2])
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [])

  return (
    <div className="w-full h-60 relative">
      <canvas ref={canvasRef} width={500} height={240} className="w-full h-full" />
    </div>
  )
}

export function BarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Sample data - in a real app, this would come from your API
    const data = [
      { label: "Tech", value: 8.2 },
      { label: "Energy", value: 5.7 },
      { label: "Finance", value: 3.9 },
      { label: "Health", value: 6.5 },
      { label: "Consumer", value: 4.8 },
    ]

    // Find max value
    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw bars
    const barWidth = ((width - 2 * padding) / data.length) * 0.7
    const barSpacing = (width - 2 * padding) / data.length

    data.forEach((item, i) => {
      const x = padding + i * barSpacing + (barSpacing - barWidth) / 2
      const barHeight = (item.value / maxValue) * (height - 2 * padding)
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top of bar
      ctx.fillStyle = "#1e40af"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.value.toFixed(1) + "%", x + barWidth / 2, y - 5)

      // Draw label below bar
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.label, x + barWidth / 2, height - padding + 15)
    })

    // Draw value labels on y-axis
    const steps = 5
    for (let i = 0; i <= steps; i++) {
      const value = (maxValue * i) / steps
      const y = height - padding - (i / steps) * (height - 2 * padding)

      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(value.toFixed(1) + "%", padding - 10, y + 3)

      // Draw grid line
      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0"
      ctx.setLineDash([2, 2])
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [])

  return (
    <div className="w-full h-60 relative">
      <canvas ref={canvasRef} width={500} height={240} className="w-full h-full" />
    </div>
  )
}

export function PieChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 40

    // Sample data - in a real app, this would come from your API
    const data = [
      { label: "Technology", value: 35, color: "#3b82f6" },
      { label: "Healthcare", value: 20, color: "#10b981" },
      { label: "Financials", value: 15, color: "#f59e0b" },
      { label: "Consumer", value: 12, color: "#ef4444" },
      { label: "Energy", value: 10, color: "#8b5cf6" },
      { label: "Other", value: 8, color: "#6b7280" },
    ]

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw pie chart
    let startAngle = 0

    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / total

      // Draw slice
      ctx.beginPath()
      ctx.fillStyle = item.color
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      // Calculate label position
      const middleAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + labelRadius * Math.cos(middleAngle)
      const labelY = centerY + labelRadius * Math.sin(middleAngle)

      // Draw label if slice is big enough
      if (item.value / total > 0.05) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${item.value}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw legend
    const legendX = width - 100
    const legendY = 20

    data.forEach((item, i) => {
      const y = legendY + i * 20

      // Draw color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(item.label, legendX + 18, y + 6)
    })
  }, [])

  return (
    <div className="w-full h-60 relative">
      <canvas ref={canvasRef} width={500} height={240} className="w-full h-full" />
    </div>
  )
}

