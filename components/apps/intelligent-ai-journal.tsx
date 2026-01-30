"use client"

import Image from "next/image"

interface IntelligentAIJournalProps {
  isDarkMode?: boolean
}

export default function IntelligentAIJournal({ isDarkMode = false }: IntelligentAIJournalProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"

  return (
    <div className={`h-full ${bgColor} ${textColor} overflow-y-auto`}>
      {/* Scrolling Content */}
      <div className="p-0">
        {/* Screenshot 1 - Project Overview */}
        <div className="w-full overflow-hidden">
          <Image
            src="/intelligent-ai-journal-1.png"
            alt="refrAIme Project Overview"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{ clipPath: 'inset(0 2% 0 2%)' }}
            unoptimized
          />
        </div>

        {/* Screenshot 2 - Evaluation Details */}
        <div className="w-full overflow-hidden">
          <Image
            src="/intelligent-ai-journal-2.png"
            alt="Evaluation and CTRS Details"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{ clipPath: 'inset(0 2% 0 2%)' }}
            unoptimized
          />
        </div>

        {/* Screenshot 3 - Results Chart */}
        <div className="w-full overflow-hidden">
          <Image
            src="/intelligent-ai-journal-3.png"
            alt="CTRS Results Comparison"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{ clipPath: 'inset(0 2% 0 2%)' }}
            unoptimized
          />
        </div>

        {/* Screenshot 4 - Key Learnings */}
        <div className="w-full overflow-hidden">
          <Image
            src="/intelligent-ai-journal-4.png"
            alt="Key Learnings and Impact"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{ clipPath: 'inset(0 2% 0 2%)' }}
            unoptimized
          />
        </div>

        {/* Screenshot 5 */}
        <div className="w-full overflow-hidden">
          <Image
            src="/intelligent-ai-journal-5.png"
            alt="Additional Project Information"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{ clipPath: 'inset(0 2% 0 2%)' }}
            unoptimized
          />
        </div>
      </div>
    </div>
  )
}
