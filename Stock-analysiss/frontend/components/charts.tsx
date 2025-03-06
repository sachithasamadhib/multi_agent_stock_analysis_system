"use client"

import { useEffect, useRef } from "react"

export function LineChart({ data }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Find min and max values
    const values = Object.values(data).map((d: any) => d.value)
    const maxValue = Math.max(...values) * 1.1
    const minValue = Math.min(...values) * 0.9

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

    Object.entries(data).forEach(([name, d]: [string, any], i) => {
      const x = padding + (i * (width - 2 * padding)) / (Object.keys(data).length - 1)
      const y = height - padding - ((d.value - minValue) / (maxValue - minValue)) * (height - 2 * padding)

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

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(name, x, height - padding + 15)
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
  }, [data])

  return (
    <div className="w-full h-60 relative">
      <canvas ref={canvasRef} width={500} height={240} className="w-full h-full" />
    </div>
  )
}

export function BarChart({ data }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Find max value
    const maxValue = Math.max(...Object.values(data).map((d: any) => d.performance)) * 1.1

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw bars
    const barWidth = ((width - 2 * padding) / Object.keys(data).length) * 0.7
    const barSpacing = (width - 2 * padding) / Object.keys(data).length

    Object.entries(data).forEach(([name, d]: [string, any], i) => {
      const x = padding + i * barSpacing + (barSpacing - barWidth) / 2
      const barHeight = (d.performance / maxValue) * (height - 2 * padding)
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top of bar
      ctx.fillStyle = "#1e40af"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(d.performance.toFixed(1) + "%", x + barWidth / 2, y - 5)

      // Draw label below bar
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(name, x + barWidth / 2, height - padding + 15)
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
  }, [data])

  return (
    <div className="w-full h-60 relative">
      <canvas ref={canvasRef} width={500} height={240} className="w-full h-full" />
    </div>
  )
}

export function PieChart({ data }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

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

    // Calculate total
    const total = Object.values(data).reduce((sum: number, d: any) => sum + d.weight, 0)

    // Colors for sectors
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"]

    // Draw pie chart
    let startAngle = 0

    Object.entries(data).forEach(([name, d]: [string, any], index) => {
      const sliceAngle = (2 * Math.PI * d.weight) / total

      // Draw slice
      ctx.beginPath()
      ctx.fillStyle = colors[index % colors.length]
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
      if (d.weight / total > 0.05) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${d.weight}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw legend
    const legendX = width - 100
    const legendY = 20

    Object.entries(data).forEach(([name, d]: [string, any], index) => {
      const y = legendY + index * 20

      // Draw color box
      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(legendX, y, 12, 12)

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(name, legendX + 18, y + 6)
    })
  }, [data])

  return (
    <div className="w-full h-60 relative">
      <canvas ref={canvasRef} width={500} height={240} className="w-full h-full" />
    </div>
  )
}

