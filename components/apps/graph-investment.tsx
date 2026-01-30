"use client"

import Image from "next/image"

interface GraphInvestmentProps {
  isDarkMode?: boolean
}

export default function GraphInvestment({ isDarkMode = true }: GraphInvestmentProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  const screenshots = [
    "/Stock_p1.png",
    "/Stock_p2.png",
    "/Stock_p3.png",
  ]

  return (
    <div className={`h-full ${bgColor} overflow-auto`}>
      <div className="flex flex-col items-center gap-0">
        {screenshots.map((screenshot, index) => (
          <div key={index} className="w-full">
            <Image
              src={screenshot}
              alt={`Graph Investment Project Screenshot ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  )
}
