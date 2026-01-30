"use client"

import { FileText, ExternalLink, Play } from "lucide-react"

interface IntelligentAIJournalLinksProps {
  isDarkMode?: boolean
  onOpenVideo?: () => void
}

export default function IntelligentAIJournalLinks({ isDarkMode = true, onOpenVideo }: IntelligentAIJournalLinksProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"

  const handlePdfClick = () => {
    window.open("/ai_journal_pres.pdf", "_blank", "noopener,noreferrer")
  }

  const handleVideoClick = () => {
    if (onOpenVideo) {
      onOpenVideo()
    }
  }

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 overflow-auto`}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold mb-4">AI Journal Project Resources</h2>
        
        <button
          onClick={handlePdfClick}
          className={`block w-full p-4 rounded-lg border ${borderColor} ${cardBg} ${hoverBg} transition-all cursor-pointer text-left`}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 flex-shrink-0 text-blue-500" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Presentation</h3>
              <p className="text-sm opacity-70">View project presentation</p>
            </div>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </div>
        </button>

        <button
          onClick={handleVideoClick}
          className={`block w-full p-4 rounded-lg border ${borderColor} ${cardBg} ${hoverBg} transition-all cursor-pointer text-left`}
        >
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 flex-shrink-0 text-blue-500" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Demo Video</h3>
              <p className="text-sm opacity-70">Watch the project demo</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
