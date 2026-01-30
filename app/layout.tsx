import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Hannah | macOS Portfolio',
  description: 'Personal portfolio of Hannah, showcasing web development projects and skills',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children} <Analytics /></body>
    </html>
  )
}
