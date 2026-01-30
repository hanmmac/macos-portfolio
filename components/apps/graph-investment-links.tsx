"use client"

import { Github, FileText, BookOpen } from "lucide-react"

interface GraphInvestmentLinksProps {
  isDarkMode?: boolean
}

export default function GraphInvestmentLinks({ isDarkMode = true }: GraphInvestmentLinksProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"

  const links = [
    {
      name: "GitHub Repository",
      url: "https://github.com/hanmmac/graph-stock-analysis-project",
      icon: Github,
    },
    {
      name: "Presentation",
      url: "https://github.com/hanmmac/graph-stock-analysis-project/blob/main/slides/205%20Final%20Presentation.pdf",
      icon: FileText,
    },
    {
      name: "Medium Article",
      url: "https://medium.com/@maia_kennedy/beyond-the-matrix-a-graph-data-science-approach-to-smarter-stock-portfolio-diversification-e220047548ac",
      icon: BookOpen,
    },
  ]

  return (
    <div className={`h-full ${bgColor} ${textColor} p-4 flex flex-col`}>
      <h2 className="text-xl font-semibold mb-4">Stock Analysis Project Resources</h2>
      <div className="flex-1 space-y-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 rounded-lg border ${borderColor} ${cardBg} ${hoverBg} cursor-pointer transition-colors`}
          >
            <link.icon className="w-6 h-6 text-blue-500" />
            <span className="text-base font-medium">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
