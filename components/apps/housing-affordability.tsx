"use client"

import type { AppWindow } from "@/types"

interface HousingAffordabilityProps {
  isDarkMode?: boolean
}

export default function HousingAffordability({ isDarkMode = true }: HousingAffordabilityProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  return (
    <div className={`h-full ${bgColor} overflow-auto`}>
      <iframe
        src="/Zillow_Metrics_Project.pdf"
        className="w-full h-full border-0"
        title="Housing Affordability Analysis PDF"
      />
    </div>
  )
}
