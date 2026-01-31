"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Folder } from "lucide-react"
import type { AppWindow } from "@/types"

// Updated app list with Snake game
const dockApps = [
  { id: "launchpad", title: "Launchpad", icon: "/launchpad.png", component: "Launchpad", isSystem: true },
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub" },
  { id: "linkedin", title: "LinkedIn", icon: "/new_linkedin_icon.png", component: "LinkedIn" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify" },
  { id: "chat", title: "Mac - Hannah's portfolio assistant", icon: "/face-id.svg", component: "ChatApp" },
]

interface DockProps {
  onAppClick: (app: AppWindow) => void
  onLaunchpadClick: () => void
  activeAppIds: string[]
  minimizedWindows: string[]
  onRestoreWindow: (id: string) => void
  openWindows: AppWindow[]
  isDarkMode: boolean
}

export default function Dock({ onAppClick, onLaunchpadClick, activeAppIds, minimizedWindows, onRestoreWindow, openWindows, isDarkMode }: DockProps) {
  // Check if Projects/Files window is open
  const filesWindow = openWindows.find((w) => w.component === "Files")
  
  // Check if any project window is open (project windows or project description windows)
  const hasProjectWindowsOpen = openWindows.some((w) => 
    w.component === "IntelligentAIJournal" ||
    w.component === "BiasDoctorFinalReport" ||
    w.component === "BiasDoctorLinks" ||
    w.component === "GraphInvestment" ||
    w.component === "GraphInvestmentLinks" ||
    w.component === "DiloSpanish" ||
    w.component === "DiloSpanishLinks" ||
    w.component === "AirPollutionAnalysis" ||
    w.component === "ProjectDescription"
  )
  
  // Show Projects folder if Files window is open OR any project window is open
  const shouldShowProjectsFolder = !!filesWindow || hasProjectWindowsOpen
  const hasProjectsOpen = !!filesWindow
  
  const [mouseX, setMouseX] = useState<number | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMacTooltip, setShowMacTooltip] = useState(true)

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!showMobileMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMobileMenu])

  // Close Mac tooltip when clicking anywhere on screen or any window
  useEffect(() => {
    if (!showMacTooltip || !hasProjectsOpen) return

    const handleClickAnywhere = () => {
      setShowMacTooltip(false)
    }

    // Add listener with a small delay to avoid closing immediately when opening project
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickAnywhere, true)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("mousedown", handleClickAnywhere, true)
    }
  }, [showMacTooltip, hasProjectsOpen])

  const handleAppClick = (app: (typeof dockApps)[0]) => {
    if (app.id === "launchpad") {
      onLaunchpadClick()
      return
    }

    // Check if window is minimized - if so, restore it first
    const existingWindow = openWindows.find((w) => w.id === app.id)
    if (existingWindow && minimizedWindows.includes(app.id)) {
      onRestoreWindow(app.id)
      return
    }

    // Special handling for Chat when projects are open
    const isChat = app.id === "chat"
    if (isChat && hasProjectsOpen) {
      // Hide tooltip when clicking Mac icon
      setShowMacTooltip(false)
      
      // Find the project description window to match its size and position
      const projectDescWindow = openWindows.find((w) => w.component === "ProjectDescription")
      
      if (projectDescWindow) {
        // Use same width as project description window (both are wider now)
        const chatWidth = projectDescWindow.size.width
        const chatHeight = Math.min(400, projectDescWindow.size.height * 0.95) // A little longer
        const gap = 10 // Closer to project description
        
        // Position overlapping the project description slightly, aligned with it
        // Ensure it doesn't go below the dock (dock is at bottom, ~80px height)
        const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
        const dockHeight = 80
        const maxY = screenHeight - chatHeight - dockHeight - 10 // Leave 10px gap above dock
        
        const chatX = projectDescWindow.position.x
        const calculatedY = projectDescWindow.position.y + projectDescWindow.size.height - 40 // Overlap by 40px
        const chatY = Math.min(calculatedY, maxY) // Ensure it doesn't go below dock
        
        // Open or move chat window to match project description size and position below it
        onAppClick({
          id: "chat",
          title: "Mac - Hannah's portfolio assistant",
          component: "ChatApp",
          position: { x: chatX, y: chatY },
          size: { width: chatWidth, height: chatHeight },
        })
      } else {
        // Fallback if no project description window found
        const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
        const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
        const chatWidth = 450
        const chatHeight = 350
        const dockHeight = 80
        const padding = 20
        const chatX = screenWidth - chatWidth - padding
        const chatY = screenHeight - chatHeight - dockHeight - padding
        
        onAppClick({
          id: "chat",
          title: "Mac - Hannah's portfolio assistant",
          component: "ChatApp",
          position: { x: chatX, y: chatY },
          size: { width: chatWidth, height: chatHeight },
        })
      }
      return
    }

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

    // Special size for Chat - smaller window (default behavior when projects not open)
    const chatWidth = 480
    const chatHeight = 450
    // Reuse screenHeight from Safari section above, or calculate if not already defined
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

    // Close mobile menu after clicking an app
    if (showMobileMenu) {
      setShowMobileMenu(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dockRef.current && !isMobile) {
      const rect = dockRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      setMouseX(x)
    }
  }

  const handleMouseLeave = () => {
    setMouseX(null)
  }

  // Calculate scale for each icon based on distance from mouse
  const getIconScale = (index: number, iconCount: number) => {
    if (mouseX === null || isMobile) return 1

    // Get the dock width and calculate the position of each icon
    const dockWidth = dockRef.current?.offsetWidth || 0
    const iconWidth = dockWidth / iconCount
    const iconPosition = iconWidth * (index + 0.5) // Center of the icon

    // Distance from mouse to icon center
    const distance = Math.abs(mouseX - iconPosition)

    // Maximum scale and distance influence
    const maxScale = 2
    const maxDistance = iconWidth * 2.5

    // Calculate scale based on distance (closer = larger)
    if (distance > maxDistance) return 1

    // Smooth parabolic scaling function
    const scale = 1 + (maxScale - 1) * Math.pow(1 - distance / maxDistance, 2)

    return scale
  }

  // Check if Files/Projects window is minimized
  const isFilesMinimized = filesWindow ? minimizedWindows.includes(filesWindow.id) : false
  
  // For mobile, we'll show only the first 4 apps plus a "more" button
  const visibleApps = isMobile ? dockApps.slice(0, 4) : dockApps
  const hiddenApps = isMobile ? dockApps.slice(4) : []

  return (
    <div ref={dockRef} className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
      {/* Mobile expanded menu */}
      {isMobile && showMobileMenu && (
        <div
          className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[280px] 
          ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-xl 
          rounded-xl border border-white/20 shadow-lg p-4 mb-2`}
        >
          <div className="grid grid-cols-4 gap-4">
            {hiddenApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col items-center justify-center"
                onClick={() => handleAppClick(app)}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <img
                    src={app.icon || "/placeholder.svg"}
                    alt={app.title}
                    className="w-12 h-12 object-contain"
                    draggable="false"
                  />
                </div>
                <span className={`text-xs mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{app.title}</span>
                {activeAppIds.includes(app.id) && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main dock */}
      <div
        className={`px-3 py-2 rounded-2xl 
          ${isDarkMode ? "bg-white/5" : "bg-white/40"} backdrop-blur-xl 
          flex items-end border border-white/20 shadow-lg
          ${isMobile ? "h-20" : "h-16"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {visibleApps.map((app, index) => {
          const scale = getIconScale(index, visibleApps.length + (shouldShowProjectsFolder ? 1 : 0))
          const isChat = app.id === "chat"

          return (
            <div
              key={app.id}
              className={`flex flex-col items-center justify-end h-full ${isMobile ? "px-3" : "px-2"}`}
              style={{
                transform: isMobile ? "none" : `translateY(${(scale - 1) * -8}px)`,
                zIndex: scale > 1 ? 10 : 1,
                transition: mouseX === null ? "transform 0.2s ease-out" : "none",
              }}
              onClick={() => handleAppClick(app)}
            >
              <div
                className="relative cursor-pointer"
                style={{
                  transform: isMobile ? "none" : `scale(${scale})`,
                  transformOrigin: "bottom center",
                  transition: mouseX === null ? "transform 0.2s ease-out" : "none",
                }}
              >
                <img
                  src={app.icon || "/placeholder.svg"}
                  alt={app.title}
                  className={`object-contain ${isMobile ? "w-14 h-14" : "w-12 h-12"}`}
                  draggable="false"
                />

                {/* Special tooltip for Mac chatbot when projects are open */}
                {!isMobile && isChat && hasProjectsOpen && showMacTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap font-sans shadow-lg z-50">
                    <div className="text-center mb-1">Ask projects questions with Mac</div>
                    <div className="flex justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Tooltip - only on desktop */}
                {!isMobile && scale > 1.5 && !(isChat && hasProjectsOpen) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/70 text-white text-xs rounded whitespace-nowrap font-sans">
                    {app.title}
                  </div>
                )}

                {/* Indicator dot for active apps */}
                {activeAppIds.includes(app.id) && (
                  <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          )
        })}

        {/* Projects/Files window icon when open or any project window is open (show in main dock, not in minimized section) */}
        {shouldShowProjectsFolder && (!filesWindow || !isFilesMinimized) && (
          <div
            className={`flex flex-col items-center justify-end h-full ${isMobile ? "px-3" : "px-2"}`}
            onClick={() => {
              if (filesWindow) {
                if (isFilesMinimized) {
                  // Restore the Files window if it's minimized
                  onRestoreWindow(filesWindow.id)
                } else {
                  // Focus the Files window if it exists and is not minimized
                  onAppClick({
                    id: filesWindow.id,
                    title: filesWindow.title,
                    component: filesWindow.component,
                    position: filesWindow.position,
                    size: filesWindow.size,
                  })
                }
              } else {
                // Open the Files window if it doesn't exist
                const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
                const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
                const menubarHeight = 26
                const dockHeight = 80
                const padding = 20
                const gap = 20
                const descWidth = 400
                const filesWidth = Math.min(880, screenWidth - descWidth - gap - padding * 2)
                const filesHeight = Math.min(700, screenHeight - menubarHeight - dockHeight - padding * 2)
                const filesX = padding
                const filesY = menubarHeight + padding
                
                onAppClick({
                  id: "files",
                  title: "Projects",
                  component: "Files",
                  position: { x: filesX, y: filesY },
                  size: { width: filesWidth, height: filesHeight },
                })
              }
            }}
          >
            <div
              className="relative cursor-pointer"
              style={{
                transform: isMobile ? "none" : `scale(1)`,
                transformOrigin: "bottom center",
                transition: "transform 0.2s ease-out",
              }}
            >
              <img
                src="/mac_blue_folder.png"
                alt={filesWindow?.title || "Projects"}
                className={`object-contain ${isMobile ? "w-14 h-14" : "w-12 h-12"}`}
                draggable="false"
              />

              {/* Indicator dot for active window */}
              {filesWindow && activeAppIds.includes(filesWindow.id) && (
                <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        )}

        {/* Minimized windows */}
        {minimizedWindows.length > 0 && (
          <div className="flex items-center gap-1 px-2 border-l border-white/20 ml-2 pl-2">
            {minimizedWindows.map((windowId) => {
              const window = openWindows.find((w) => w.id === windowId)
              if (!window) return null
              
              // Use blue folder icon for Files/Projects window
              if (window.component === "Files") {
                return (
                  <div
                    key={windowId}
                    className="w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => onRestoreWindow(windowId)}
                    title={window.title}
                  >
                    <img
                      src="/mac_blue_folder.png"
                      alt={window.title}
                      className="w-12 h-12 object-contain"
                      draggable="false"
                    />
                  </div>
                )
              }
              
              // For other windows, use their app icon
              const app = dockApps.find((a) => a.id === window.id) || { icon: "/placeholder.svg", title: window.title }
              return (
                <div
                  key={windowId}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => onRestoreWindow(windowId)}
                  title={window.title}
                >
                  <img
                    src={app.icon || "/placeholder.svg"}
                    alt={window.title}
                    className="w-8 h-8 object-contain"
                    draggable="false"
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* More button for mobile */}
        {isMobile && (
          <div
            className="flex flex-col items-center justify-end h-full px-3"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <div className="relative cursor-pointer">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center 
                ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} 
                ${showMobileMenu ? (isDarkMode ? "bg-blue-700" : "bg-blue-200") : ""}`}
              >
                <MoreHorizontal className={`w-8 h-8 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
