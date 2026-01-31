"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
          <div className="bg-white min-h-full">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-6xl mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  {/* Picture */}
                  <div className="flex-shrink-0">
                    <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src="/hannah-profile.png"
                        alt="Hannah MacDonald"
                        width={176}
                        height={176}
                        className="w-full h-full object-cover"
                        priority
                        style={{ objectPosition: 'center 20%' }}
                      />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Hi, I'm Hannah MacDonald</h1>
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <p className="text-xl text-blue-600 font-medium">Product-Minded Data Scientist</p>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-300 whitespace-nowrap">
                        Open to Work
                      </span>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">
                      I'm a data scientist and product-minded builder with a background in applied statistics, machine learning, and data engineering from <span className="font-semibold">UC Berkeley's Master of Information and Data Science program</span>. I'm drawn to work at the intersection of data, AI, and user experience - especially problems where creativity matters as much as rigor, whether that's designing experiments, shaping product direction, or translating complex analysis into something people can actually use.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-8 py-12">
              <div className="space-y-8">
                {/* Motivation & Interest Section */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Motivation & Interest</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-base">
                      What motivates me most is building products that don't stop at "interesting models," but make it into real workflows, with clear data stories and user metrics guiding decisions. I enjoy working close to the product, collaborating across design and engineering, and iterating quickly based on feedback and evidence.
                    </p>
                    <p className="text-base">
                      In my spare time, I'm constantly experimenting with AI to prototype ideas and automate parts of my workflow. My current stack often includes Python, SQL, and Supabase (with Neo4j when graph structure helps), OpenAI APIs for LLM-driven features, and Streamlit or lightweight React frontends. I use tools like Figma AI, Orchid, Cursor, and Claude to move quickly from concept to working product - balancing speed, creativity, and production constraints.
                    </p>
                  </div>
                </section>

                {/* Skills Section */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Skills</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Science & Analytics</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Statistical modeling, regression, and causal inference</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Experimental design & A/B testing</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Feature engineering & model evaluation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Data visualization & interpretability</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product & Engineering</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Python, R, SQL, JavaScript</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Rapid prototyping & MVP development</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>User-centered design & iteration</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Responsible AI, privacy, and transparency considerations</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Learning & AI</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Supervised learning & classification</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>RAG systems & prompt design</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Model evaluation and bias analysis</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Python ML workflows (scikit-learn, pandas, NumPy)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Engineering & Databases</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>SQL (data modeling, transformations, analytics)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Graph databases (Neo4j) & network analysis</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>ETL pipelines & data cleaning</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>API integration & structured data ingestion</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Education Section */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <p className="text-base font-semibold text-gray-900">Master of Information and Data Science</p>
                        <p className="text-sm text-gray-600">UC Berkeley (GPA 3.9)</p>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900">B.S. Statistics</p>
                        <p className="text-sm text-gray-600">University of Florida (GPA 3.7)</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact</h2>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <a href="mailto:hannahmarief15@gmail.com" className="text-base text-blue-600 hover:text-blue-700 hover:underline font-medium">
                          hannahmarief15@gmail.com
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                        <a href="https://www.linkedin.com/in/hannah-marie-macdonald/" target="_blank" rel="noopener noreferrer" className="text-base text-blue-600 hover:text-blue-700 hover:underline font-medium">
                          linkedin.com/in/hannah-marie-macdonald
                        </a>
                      </div>
                    </div>
                  </div>
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
                  <h2 className="text-lg font-semibold mb-3 mt-6">AI Chatbot</h2>
                  <p className="mb-4 text-sm">
                    The portfolio includes a RAG (Retrieval-Augmented Generation) chatbot that can answer questions about my background, projects, skills, and experience. The bot uses OpenAI for embeddings and completions, with Supabase and pgvector for vector storage. You can access it through the "Mac AI" app on the desktop or in the dock.
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
