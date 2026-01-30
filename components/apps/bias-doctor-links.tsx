"use client"

import { ExternalLink, Github } from "lucide-react"
import type { AppWindow } from "@/types"

interface BiasDoctorLinksProps {
  isDarkMode?: boolean
}

export default function BiasDoctorLinks({ isDarkMode = true }: BiasDoctorLinksProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 overflow-auto`}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold mb-4">Doctor Bias Project Resources</h2>
        
        <a
          href="https://github.com/hanmmac/doctor-gender-bias-study/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          className={`block p-4 rounded-lg border ${borderColor} ${cardBg} ${hoverBg} transition-all cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <Github className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">GitHub Repository</h3>
              <p className="text-sm opacity-70">View code and documentation</p>
            </div>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </div>
        </a>

        <a
          href="https://doctor-survey.web.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={`block p-4 rounded-lg border ${borderColor} ${cardBg} ${hoverBg} transition-all cursor-pointer`}
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Survey Demo</h3>
              <p className="text-sm opacity-70">Interactive prototype</p>
            </div>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </div>
        </a>
      </div>
    </div>
  )
}
