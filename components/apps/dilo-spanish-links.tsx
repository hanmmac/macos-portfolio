"use client"

import { Github, Lock, Mail } from "lucide-react"

interface DiloSpanishLinksProps {
  isDarkMode?: boolean
}

export default function DiloSpanishLinks({ isDarkMode = true }: DiloSpanishLinksProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"

  return (
    <div className={`h-full ${bgColor} ${textColor} p-4 flex flex-col`}>
      <h2 className="text-lg font-semibold mb-4">Dilo Project Resources</h2>
      
      {/* Site Password Section */}
      <div className={`mb-3 p-3 rounded-lg border ${borderColor} ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold">Site Password</h3>
        </div>
        <p className="text-sm font-mono mb-1">{`ilovebmo`}</p>
        <p className="text-xs opacity-70 italic">(My dog's name)</p>
      </div>

      {/* Demo Credentials Section */}
      <div className={`mb-3 p-3 rounded-lg border ${borderColor} ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold">Demo Credentials</h3>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-xs opacity-70 mb-1">Demo Email:</p>
            <p className="text-xs font-mono">{`demo@gmail.com`}</p>
          </div>
          <div>
            <p className="text-xs opacity-70 mb-1">Demo Password:</p>
            <p className="text-xs font-mono">{`dilodemo`}</p>
          </div>
        </div>
      </div>

      {/* GitHub Link */}
      <div className="flex-1 flex items-end">
        <a
          href="https://github.com/hanmmac/dilo_spanish_app"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 p-3 rounded-lg border ${borderColor} ${cardBg} hover:bg-gray-700 cursor-pointer transition-colors w-full`}
        >
          <Github className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">GitHub Repository</span>
        </a>
      </div>
    </div>
  )
}
