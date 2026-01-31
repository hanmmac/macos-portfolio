"use client"

interface AirPollutionAnalysisProps {
  isDarkMode?: boolean
}

export default function AirPollutionAnalysis({ isDarkMode = true }: AirPollutionAnalysisProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  return (
    <div className={`h-full ${bgColor} overflow-auto`}>
      <iframe
        src="/pollution_report.pdf"
        className="w-full h-full border-0"
        title="Air Pollution Analysis PDF"
      />
    </div>
  )
}
