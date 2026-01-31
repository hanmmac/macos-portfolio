"use client"

import { useState, useEffect, useRef } from "react"
import type { AppWindow } from "@/types"

const spotlightApps = [
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub" },
  { id: "linkedin", title: "LinkedIn", icon: "/new_linkedin_icon.png", component: "LinkedIn" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify" },
  { id: "snake", title: "Snake", icon: "/snake.png", component: "Snake" },
  { id: "weather", title: "Weather", icon: "/weather.png", component: "Weather" },
  { id: "analytics", title: "Analytics", icon: "/chart-679.png", component: "Analytics" },
  { id: "chat", title: "Mac - Hannah's portfolio assistant", icon: "/face-id.svg", component: "ChatApp" },
]

interface SpotlightProps {
  onClose: () => void
  onAppClick: (app: AppWindow) => void
}

export default function Spotlight({ onClose, onAppClick }: SpotlightProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApps, setFilteredApps] = useState(spotlightApps)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input when spotlight opens
    inputRef.current?.focus()

    // Handle escape key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < filteredApps.length - 1 ? prev + 1 : prev))
        e.preventDefault()
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        e.preventDefault()
      } else if (e.key === "Enter" && filteredApps.length > 0) {
        handleAppClick(filteredApps[selectedIndex])
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredApps, selectedIndex])

  useEffect(() => {
    if (searchTerm) {
      const filtered = spotlightApps.filter((app) => app.title.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredApps(filtered)
      setSelectedIndex(0) // Reset selection when search changes
    } else {
      setFilteredApps(spotlightApps)
    }
  }, [searchTerm])

  const handleAppClick = (app: (typeof spotlightApps)[0]) => {
    // Special positioning for Spotify - top right corner, smaller size
    const isSpotify = app.id === "spotify"
    const spotifyWidth = 240
    const spotifyHeight = 250
    const spotifyX = typeof window !== "undefined" ? window.innerWidth - spotifyWidth - 20 : 100
    const spotifyY = 40 // Below menubar (26px) + padding

    // Special size for Safari - responsive to screen
    const isSafari = app.id === "safari"
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
    const padding = 40
    const menubarHeight = 26
    const dockHeight = 80
    const safariWidth = Math.min(800, screenWidth - padding * 2)
    const safariHeight = Math.min(1000, screenHeight - menubarHeight - dockHeight - padding * 2)
    const safariX = padding + 50 // Farther to the left, near the left edge
    const safariY = menubarHeight + 20 // Near the top

    // Special size for Notes - smaller window
    const isNotes = app.id === "notes"
    const notesWidth = 600
    const notesHeight = 500

    // Special size for Terminal - smaller window
    const isTerminal = app.id === "terminal"
    const terminalWidth = 600
    const terminalHeight = 400

    // Special size for Analytics - larger window for dashboard
    const isAnalytics = app.id === "analytics"
    const analyticsWidth = 1000
    const analyticsHeight = 600

    // Special size for Chat - smaller window
    const isChat = app.id === "chat"
    const chatWidth = 480
    const chatHeight = 450
    const chatScreenHeight = typeof window !== "undefined" ? window.innerHeight : 800
    const chatY = chatScreenHeight - chatHeight - 150 // Increased padding to move window up
    const chatX = 10 // More to the left

    // Helper to ensure windows fit screen
    const fitToScreen = (width: number, height: number, x: number, y: number) => {
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
      const menubarHeight = 26
      const dockHeight = 80
      const padding = 20
      
      const finalWidth = Math.min(width, screenWidth - padding * 2)
      const finalHeight = Math.min(height, screenHeight - menubarHeight - dockHeight - padding * 2)
      const finalX = Math.max(padding, Math.min(x, screenWidth - finalWidth - padding))
      const finalY = Math.max(menubarHeight + padding, Math.min(y, screenHeight - finalHeight - dockHeight - padding))
      
      return { width: finalWidth, height: finalHeight, x: finalX, y: finalY }
    }

    let position, size
    if (isSpotify) {
      const fitted = fitToScreen(spotifyWidth, spotifyHeight, spotifyX, spotifyY)
      position = { x: fitted.x, y: fitted.y }
      size = { width: fitted.width, height: fitted.height }
    } else if (isSafari) {
      const fitted = fitToScreen(safariWidth, safariHeight, safariX, safariY)
      position = { x: fitted.x, y: fitted.y }
      size = { width: fitted.width, height: fitted.height }
    } else if (isChat) {
      const fitted = fitToScreen(chatWidth, chatHeight, chatX, chatY)
      position = { x: fitted.x, y: fitted.y }
      size = { width: fitted.width, height: fitted.height }
    } else if (isNotes) {
      const randomX = Math.random() * 200 + 100
      const randomY = Math.random() * 100 + 50
      const fitted = fitToScreen(notesWidth, notesHeight, randomX, randomY)
      position = { x: fitted.x, y: fitted.y }
      size = { width: fitted.width, height: fitted.height }
    } else if (isTerminal) {
      const randomX = Math.random() * 200 + 100
      const randomY = Math.random() * 100 + 50
      const fitted = fitToScreen(terminalWidth, terminalHeight, randomX, randomY)
      position = { x: fitted.x, y: fitted.y }
      size = { width: fitted.width, height: fitted.height }
    } else if (isAnalytics) {
      const randomX = Math.random() * 200 + 100
      const randomY = Math.random() * 100 + 50
      const fitted = fitToScreen(analyticsWidth, analyticsHeight, randomX, randomY)
      position = { x: fitted.x, y: fitted.y }
      size = { width: fitted.width, height: fitted.height }
    } else {
      const randomX = Math.random() * 200 + 100
      const randomY = Math.random() * 100 + 50
      const fitted = fitToScreen(800, 600, randomX, randomY)
      position = { x: fitted.x, y: fitted.y }
      size = { width: fitted.width, height: fitted.height }
    }

    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position,
      size,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-transparent z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-white border-0 py-4 pl-12 pr-4 focus:outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredApps.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className={`flex items-center px-4 py-3 cursor-pointer ${
                  index === selectedIndex ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
                onClick={() => handleAppClick(app)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <img src={app.icon || "/placeholder.svg"} alt={app.title} className="w-6 h-6 object-contain" style={app.id === "analytics" ? { transform: "scale(0.9)" } : undefined} />
                </div>
                <span className="text-white font-sans">{app.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
