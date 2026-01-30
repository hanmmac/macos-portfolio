"use client"

import { useState } from "react"
import { Folder, File, Image as ImageIcon, FileText, Music, Video } from "lucide-react"
import type { AppWindow } from "@/types"

interface FilesProps {
  isDarkMode?: boolean
  onOpenProject?: (projectName: string) => void
  onMinimizeWindow?: () => void
}

export default function Files({ isDarkMode = false, onOpenProject, onMinimizeWindow }: FilesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-50"
  const cardBorder = isDarkMode ? "border-gray-700" : "border-gray-200"

  const folders = [
    { name: "Documents", icon: Folder, count: 12 },
    { name: "Downloads", icon: Folder, count: 8 },
    { name: "Pictures", icon: Folder, count: 45 },
    { name: "Music", icon: Folder, count: 23 },
    { name: "Videos", icon: Folder, count: 5 },
  ]

  const files = [
    { 
      name: "intelligent_ai_journal", 
      icon: Folder,
      info: "Full Stack | RAG | Prompt Engineering | Python | JS/React",
      description: "An AI-powered CBT journaling app that helps users reflect and reframe their thoughts through guided, evidence-based prompts. It combines a calm, trust-centered UI with a RAG chatbot grounded in vetted mental-health resources. The product was iteratively tested with real users, with a focus on safety, transparency, and responsible AI design."
    },
    { 
      name: "bias_in_doctor_selection", 
      icon: Folder,
      info: "Design of Experiments | Causal Inference | R | Statistical Analysis",
      description: "A causal experiment examining whether provider gender influences patient selection in a mock doctor-booking platform. Participants chose between male- and female-presenting doctors with equivalent qualifications, using randomized profiles to isolate gender effects. The study focused on experimental design, internal validity, and bias measurement."
    },
    { 
      name: "graph_based_investment_insight", 
      icon: Folder,
      info: "Graph Algorithms | Network Analysis | Neo4j | Python",
      description: "A graph-based financial analysis using Neo4j to model relationships between stocks, sectors, and shared risk factors. Using Python, we implemented graph algorithms such as PageRank, community detection, and shortest-path analysis to identify influential stocks, sector clusters, and systemic connections. The approach highlighted diversification insights and risk concentrations that are difficult to detect with traditional correlation-based methods."
    },
    { 
      name: "air_pollution_analysis", 
      icon: Folder,
      info: "ML | EDA | Feature Engineering | Python",
      description: "A machine learning project analyzing the relationship between electric vehicle adoption, environmental factors, and PM2.5 air pollution levels across Europe. The work emphasized data preprocessing, feature engineering, and model interpretability to identify key drivers of pollution rather than pure forecasting."
    },
    { 
      name: "dilo_spanish_phrases", 
      icon: Folder,
      info: "Web Application | UX Design | Open AI API | JS React | Supabase",
      description: "An AI-powered language tool designed to help users practice practical Spanish through region-aware, context-specific phrases. The project generated multiple phrasing variants and translations tailored to real-world scenarios, emphasizing usability and cultural nuance. It focused on lightweight AI integration, prompt design, and rapid product iteration."
    },
  ]

  return (
    <div className={`h-full flex ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`w-48 ${sidebarBg} border-r ${borderColor} p-4`}>
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm">Favorites</h3>
          <div className="space-y-1">
            {folders.map((folder, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-2 py-1.5 rounded ${hoverBg} cursor-pointer text-sm`}
              >
                <folder.icon className="w-4 h-4" />
                <span className="flex-1">{folder.name}</span>
                <span className="text-xs opacity-60">{folder.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex gap-6">
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">Projects</h2>
            <p className="text-sm opacity-60">Click through my project folders</p>
          </div>

          <div className="flex flex-col gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  if ((file.name === "intelligent_ai_journal" || file.name === "bias_in_doctor_selection" || file.name === "graph_based_investment_insight" || file.name === "dilo_spanish_phrases") && onOpenProject) {
                    onOpenProject(file.name)
                    // Minimize the Projects window
                    if (onMinimizeWindow) {
                      onMinimizeWindow()
                    }
                  }
                }}
              >
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor} ${hoverBg} cursor-pointer`}
                >
                  <file.icon className="w-8 h-8 opacity-80 flex-shrink-0" />
                  <span className="text-sm">{file.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        {hoveredIndex !== null && files[hoveredIndex]?.info && (
          <div 
            className={`w-80 max-h-full overflow-y-auto ${cardBg} border ${cardBorder} rounded-lg p-4 shadow-lg`}
            onMouseEnter={() => setHoveredIndex(hoveredIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <h3 className="font-semibold mb-3 text-sm">{files[hoveredIndex].name}</h3>
            {files[hoveredIndex].description && (
              <p className="text-xs mb-3 opacity-80 leading-relaxed">
                {files[hoveredIndex].description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {files[hoveredIndex].info.split(" | ").map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className={`px-2 py-1 rounded text-xs ${
                    isDarkMode 
                      ? "bg-gray-700 text-gray-200" 
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
