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
  const [mouseX, setMouseX] = useState<number | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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

  const handleAppClick = (app: (typeof dockApps)[0]) => {
    if (app.id === "launchpad") {
      onLaunchpadClick()
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

    // Special size for Chat - smaller window
    const isChat = app.id === "chat"
    const chatWidth = 550
    const chatHeight = 500

    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position: isSpotify 
        ? { x: spotifyX, y: spotifyY }
        : isSafari
        ? { x: safariX, y: safariY }
        : { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
      size: isSpotify 
        ? { width: spotifyWidth, height: spotifyHeight }
        : isSafari
        ? { width: safariWidth, height: safariHeight }
        : isNotes
        ? { width: notesWidth, height: notesHeight }
        : isChat
        ? { width: chatWidth, height: chatHeight }
        : { width: 800, height: 600 },
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

  // Check if Files/Projects window is open (minimized or not)
  const filesWindow = openWindows.find((w) => w.component === "Files")
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
          const scale = getIconScale(index, visibleApps.length + (filesWindow ? 1 : 0))

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

                {/* Tooltip - only on desktop */}
                {!isMobile && scale > 1.5 && (
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

        {/* Projects/Files window icon when open (show in main dock, not in minimized section) */}
        {filesWindow && !isFilesMinimized && (
          <div
            className={`flex flex-col items-center justify-end h-full ${isMobile ? "px-3" : "px-2"}`}
            onClick={() => {
              // Focus the Files window
              onAppClick({
                id: filesWindow.id,
                title: filesWindow.title,
                component: filesWindow.component,
                position: filesWindow.position,
                size: filesWindow.size,
              })
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
                alt={filesWindow.title}
                className={`object-contain ${isMobile ? "w-14 h-14" : "w-12 h-12"}`}
                draggable="false"
              />

              {/* Indicator dot for active window */}
              {activeAppIds.includes(filesWindow.id) && (
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
