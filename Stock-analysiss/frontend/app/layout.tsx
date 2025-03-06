import type React from "react"
import "@/styles/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stock Analysis Dashboard",
  description: "A multi-agent stock analysis system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

