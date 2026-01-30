"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, RefreshCw, Home, Star, Plus, Search, Wifi } from "lucide-react"

interface SafariProps {
  isDarkMode?: boolean
}

export default function Safari({ isDarkMode = true }: SafariProps) {
  const [url, setUrl] = useState("https://hannah-marie-macdonald.com")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [wifiEnabled, setWifiEnabled] = useState(true)

  // Get WiFi status from localStorage or default to true
  useEffect(() => {
    const checkWifiStatus = () => {
      const status = localStorage.getItem("wifiEnabled")
      setWifiEnabled(status === null ? true : status === "true")
    }

    checkWifiStatus()

    // Check every second in case it changes
    const interval = setInterval(checkWifiStatus, 1000)

    return () => clearInterval(interval)
  }, [])

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const toolbarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-gray-200"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Updated bookmarks with social links
  const socialLinks = [
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/hannah-marie-macdonald/",
      icon: "/new_linkedin_icon.png",
    },
    {
      title: "GitHub",
      url: "https://github.com/hanmmac",
      icon: "/github.png",
    },
    {
      title: "Email",
      url: "mailto:hannahmarief15@gmail.com",
      icon: "/mail.png",
    },
  ]

  const frequentlyVisited = [
    {
      title: "GitHub",
      url: "https://github.com",
      icon: "/github.png",
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com",
      icon: "/new_linkedin_icon.png",
    },
    {
      title: "YouTube",
      url: "https://youtube.com",
      icon: "/youtube.png",
    },
    {
      title: "Reddit",
      url: "https://reddit.com",
      icon: "/reddit.png",
    },
    {
      title: "ChatGPT",
      url: "https://chatgpt.com",
      icon: "/chatgpt.png",
    },
    {
      title: "Stack Overflow",
      url: "https://stackoverflow.com",
      icon: "/stackoverflow.png",
    },
  ]

  // Add a no internet connection view
  const NoInternetView = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div
        className={`w-24 h-24 mb-6 flex items-center justify-center rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
      >
        <Wifi className={`w-12 h-12 ${isDarkMode ? "text-gray-600" : "text-gray-500"}`} />
      </div>
      <h2 className={`text-xl font-semibold mb-2 ${textColor}`}>You Are Not Connected to the Internet</h2>
      <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
        This page can't be displayed because your computer is currently offline.
      </p>
      <button
        className={`px-4 py-2 rounded ${
          isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
        onClick={handleRefresh}
      >
        Try Again
      </button>
    </div>
  )

  return (
    <div className={`h-full flex flex-col ${bgColor} ${textColor}`}>
      {/* Toolbar */}
      <div className={`${toolbarBg} border-b ${borderColor} p-2 flex items-center space-x-2`}>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          onClick={handleRefresh}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <Home className="w-4 h-4" />
        </button>

        <div className={`flex-1 flex items-center ${inputBg} rounded px-3 py-1`}>
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full bg-transparent focus:outline-none text-sm ${textColor}`}
          />
        </div>

        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Tab bar */}
      <div className={`${toolbarBg} border-b ${borderColor} px-2 flex items-center`}>
        <div
          className={`px-3 py-1 text-sm rounded-t flex items-center cursor-pointer ${activeTab === "home" ? (isDarkMode ? "bg-gray-900" : "bg-white") : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <span className="mr-2">Home</span>
          <button className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-500">
            <span className="text-xs">×</span>
          </button>
        </div>
        <div
          className={`px-3 py-1 text-sm rounded-t flex items-center cursor-pointer ml-1 ${activeTab === "about" ? (isDarkMode ? "bg-gray-900" : "bg-white") : ""}`}
          onClick={() => setActiveTab("about")}
        >
          <span className="mr-2">About the Website</span>
          <button className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-500">
            <span className="text-xs">×</span>
          </button>
        </div>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!wifiEnabled ? (
          <NoInternetView />
        ) : activeTab === "home" ? (
          <div className={`${isDarkMode ? "bg-white" : "bg-white"} min-h-full`}>
            <div className="p-8 text-gray-900">
              <h1 className="text-3xl font-bold mb-4">Hi, I'm Hannah MacDonald</h1>
              <p className="text-base mb-6">Product-Minded Data Scientist</p>
              <hr className="mb-6 border-gray-300" />
              <div className="space-y-4">
                <section>
                  <h2 className="text-xl font-semibold mb-2">About me</h2>
                  <p className="mb-4 text-sm">
                    I'm a recent grad from <span className="font-bold text-blue-900">UC Berkeley's Master's in Data Science</span> program, where I studied applied statistics, machine learning, and data engineering. I'm drawn to the overlap between data, AI, and user experience, especially projects where I can get creative with the problem - whether that's <span className="font-bold">designing experiments, product and feature ideation, or making complex analysis understandable</span>. What excites me most is building products people actually use, keeping the data story and user metrics front and center.
                  </p>
                  <p className="mb-4 text-sm">
                    In my spare time, I'm constantly experimenting with AI to automate work and prototype ideas quickly. My current stack is Python + SQL + Supabase (Neo4j when graph structure helps), OpenAI APIs for LLM features, and Streamlit or lightweight React frontends. I use tools like Figma AI, Orchid, and Cursor to move fast from concept to working product, staying grounded in real data and production constraints while keeping things creative.
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-base font-semibold mb-2">Data Science & Analytics</h3>
                    <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
                      <li>Statistical modeling, regression, and causal inference</li>
                      <li>Experimental design & A/B testing</li>
                      <li>Feature engineering & model evaluation</li>
                      <li>Data visualization & interpretability</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-base font-semibold mb-2">Product & Engineering</h3>
                    <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
                      <li>Python, R, SQL, JavaScript</li>
                      <li>Rapid prototyping & MVP development</li>
                      <li>User-centered design & iteration</li>
                      <li>Responsible AI, privacy, and transparency considerations</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-base font-semibold mb-2">Machine Learning & AI</h3>
                    <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
                      <li>Supervised learning & classification</li>
                      <li>RAG systems & prompt design</li>
                      <li>Model evaluation and bias analysis</li>
                      <li>Python ML workflows (scikit-learn, pandas, NumPy)</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-base font-semibold mb-2">Data Engineering & Databases</h3>
                    <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
                      <li>SQL (data modeling, transformations, analytics)</li>
                      <li>Graph databases (Neo4j) & network analysis</li>
                      <li>ETL pipelines & data cleaning</li>
                      <li>API integration & structured data ingestion</li>
                    </ul>
                  </div>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">Education</h2>
                  <p className="mb-2 text-sm">Master of Information and Data Science - UC Berkeley (GPA 3.9)</p>
                  <p className="mb-4 text-sm">B.S. Statistics - University of Florida (GPA 3.7)</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">Contact</h2>
                  <p className="mb-2 text-sm">Email: <a href="mailto:hannahmarief15@gmail.com" className="text-blue-600 hover:underline">hannahmarief15@gmail.com</a></p>
                  <p className="text-sm">LinkedIn: <a href="https://www.linkedin.com/in/hannah-marie-macdonald/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.linkedin.com/in/hannah-marie-macdonald/</a></p>
                </section>
              </div>
            </div>
          </div>
        ) : activeTab === "about" ? (
          <div className={`${isDarkMode ? "bg-white" : "bg-white"} min-h-full`}>
            <div className="p-8 text-gray-900">
              <h1 className="text-3xl font-bold mb-4">About the Website</h1>
              <hr className="mb-6 border-gray-300" />
              <div className="space-y-4">
                <section>
                  <p className="mb-4 text-sm">
                    This portfolio is an interactive macOS-inspired interface built to showcase my projects, product thinking, and data work in a way that feels playful but still usable.
                  </p>
                  <h2 className="text-lg font-semibold mb-3 mt-6">Acknowledgments</h2>
                  <ul className="list-disc list-inside mb-4 space-y-1 text-sm">
                    <li>
                      Special thanks to Daniel Prior for creating and sharing this amazing portfolio<br />
                      <span className="ml-6">template - original template: <a href="https://github.com/daprior/danielprior-macos" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/daprior/danielprior-macos</a></span>
                    </li>
                    <li>Icons from <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lucide React</a></li>
                    <li>UI components from <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">shadcn/ui</a></li>
                    <li>Initial layout jump-started with <a href="https://v0.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">v0/Vercel</a></li>
                    <li>Built with <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Next.js</a> and <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Tailwind CSS</a></li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
