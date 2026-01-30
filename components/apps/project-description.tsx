"use client"

interface ProjectDescriptionProps {
  isDarkMode?: boolean
  projectId?: string
}

const projectData: Record<string, { name: string; description: string; info: string }> = {
  "intelligent-ai-journal-desc": {
    name: "intelligent_ai_journal",
    description: "An AI-powered CBT journaling app that helps users reflect and reframe their thoughts through guided, evidence-based prompts. It combines a calm, trust-centered UI with a RAG chatbot grounded in vetted mental-health resources. The product was iteratively tested with real users, with a focus on safety, transparency, and responsible AI design.",
    info: "Full Stack | RAG | Prompt Engineering | Python | JS/React"
  },
  "bias-doctor-desc": {
    name: "bias_in_doctor_selection",
    description: "A causal experiment examining whether provider gender influences patient selection in a mock doctor-booking platform. Participants chose between male- and female-presenting doctors with equivalent qualifications, using randomized profiles to isolate gender effects. The study focused on experimental design, internal validity, and bias measurement.",
    info: "Design of Experiments | Causal Inference | R | Statistical Analysis"
  },
  "graph-investment-desc": {
    name: "graph_based_investment_insight",
    description: "A graph-based financial analysis using Neo4j to model relationships between stocks, sectors, and shared risk factors. Using Python, we implemented graph algorithms such as PageRank, community detection, and shortest-path analysis to identify influential stocks, sector clusters, and systemic connections. The approach highlighted diversification insights and risk concentrations that are difficult to detect with traditional correlation-based methods.",
    info: "Graph Algorithms | Network Analysis | Neo4j | Python"
  },
  "air-pollution-desc": {
    name: "air_pollution_analysis",
    description: "A machine learning project analyzing the relationship between electric vehicle adoption, environmental factors, and PM2.5 air pollution levels across Europe. The work emphasized data preprocessing, feature engineering, and model interpretability to identify key drivers of pollution rather than pure forecasting.",
    info: "ML | EDA | Feature Engineering | Python"
  },
  "dilo-spanish-desc": {
    name: "dilo_spanish_phrases",
    description: "An AI-powered language tool designed to help users practice practical Spanish through region-aware, context-specific phrases. The project generated multiple phrasing variants and translations tailored to real-world scenarios, emphasizing usability and cultural nuance. It focused on lightweight AI integration, prompt design, and rapid product iteration.",
    info: "Web Application | UX Design | Open AI API | JS React | Supabase"
  }
}

export default function ProjectDescription({ isDarkMode = true, projectId }: ProjectDescriptionProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-50"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"

  const project = projectId ? projectData[projectId] : null

  if (!project) {
    return (
      <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
        <p className="opacity-60">Project description not found</p>
      </div>
    )
  }

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 overflow-auto`}>
      <div className={`max-w-md mx-auto ${cardBg} border ${borderColor} rounded-lg p-5 shadow-lg`}>
        <h3 className="font-semibold mb-4 text-lg">{project.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</h3>
        <p className="text-sm mb-4 opacity-90 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.info.split(" | ").map((tech, techIndex) => (
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
    </div>
  )
}
