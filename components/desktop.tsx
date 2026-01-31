"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Square, Minimize2, Maximize2 } from "lucide-react"
import Dock from "@/components/dock"
import Menubar from "@/components/menubar"
import Wallpaper from "@/components/wallpaper"
import Window from "@/components/window"
import Launchpad from "@/components/launchpad"
import ControlCenter from "@/components/control-center"
import Spotlight from "@/components/spotlight"
import type { AppWindow } from "@/types"

interface DesktopProps {
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  initialDarkMode: boolean
  onToggleDarkMode: () => void
  initialBrightness: number
  onBrightnessChange: (value: number) => void
}

export default function Desktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialDarkMode,
  onToggleDarkMode,
  initialBrightness,
  onBrightnessChange,
}: DesktopProps) {
  const [time, setTime] = useState(new Date())
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [minimizedWindows, setMinimizedWindows] = useState<Set<string>>(new Set())
  const [showLaunchpad, setShowLaunchpad] = useState(false)
  const [showControlCenter, setShowControlCenter] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode)
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness)
  const [windowZIndex, setWindowZIndex] = useState<Map<string, number>>(new Map())
  const [nextZIndex, setNextZIndex] = useState(30)
  const [showStickyNote, setShowStickyNote] = useState(false)
  const [stickyNotePosition, setStickyNotePosition] = useState({ x: 16, y: 48 })
  const [isDraggingSticky, setIsDraggingSticky] = useState(false)
  const [stickyDragOffset, setStickyDragOffset] = useState({ x: 0, y: 0 })
  const desktopRef = useRef<HTMLDivElement>(null)

  // Helper function to ensure windows fit within screen bounds
  const fitWindowToScreen = (
    desiredWidth: number,
    desiredHeight: number,
    desiredX: number,
    desiredY: number
  ) => {
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
    const menubarHeight = 26
    const dockHeight = 80
    const padding = 20
    const minWidth = 300
    const minHeight = 200

    // Calculate available space
    const availableWidth = screenWidth - padding * 2
    const availableHeight = screenHeight - menubarHeight - dockHeight - padding * 2

    // Adjust width and height to fit
    const width = Math.min(desiredWidth, availableWidth)
    const height = Math.min(desiredHeight, availableHeight)

    // Ensure minimum dimensions
    const finalWidth = Math.max(minWidth, width)
    const finalHeight = Math.max(minHeight, height)

    // Adjust position to keep window on screen
    let x = Math.max(padding, Math.min(desiredX, screenWidth - finalWidth - padding))
    let y = Math.max(menubarHeight + padding, Math.min(desiredY, screenHeight - finalHeight - dockHeight - padding))

    return { width: finalWidth, height: finalHeight, x, y }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Open Spotify by default on mount
    const spotifyWidth = 240
    const spotifyHeight = 250
    const spotifyX = typeof window !== "undefined" ? window.innerWidth - spotifyWidth - 20 : 100
    const spotifyY = 40 // Below menubar (26px) + padding

    const spotifyWindow: AppWindow = {
      id: "spotify",
      title: "Spotify",
      component: "Spotify",
      position: { x: spotifyX, y: spotifyY },
      size: { width: spotifyWidth, height: spotifyHeight },
    }

    setOpenWindows([spotifyWindow])
    // Set z-index for Spotify to default (30) so other windows can appear on top
    setWindowZIndex((prev) => {
      const newMap = new Map(prev)
      newMap.set("spotify", 30) // Spotify uses default z-index 30
      return newMap
    })
    // Don't set it as active - keep activeWindowId as null so menubar shows "Hannah's Desktop"

    return () => clearInterval(timer)
  }, [])

  // Handle sticky note dragging
  useEffect(() => {
    if (!isDraggingSticky) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - stickyDragOffset.x
      const newY = e.clientY - stickyDragOffset.y
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
      const menubarHeight = 26
      const dockHeight = 80
      const stickyWidth = 320
      const stickyHeight = 280

      // Constrain to screen bounds
      const constrainedX = Math.max(0, Math.min(newX, screenWidth - stickyWidth))
      const constrainedY = Math.max(menubarHeight, Math.min(newY, screenHeight - stickyHeight - dockHeight))

      setStickyNotePosition({ x: constrainedX, y: constrainedY })
    }

    const handleMouseUp = () => {
      setIsDraggingSticky(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDraggingSticky, stickyDragOffset])

  // Update local state when props change
  useEffect(() => {
    setIsDarkMode(initialDarkMode)
  }, [initialDarkMode])

  useEffect(() => {
    setScreenBrightness(initialBrightness)
  }, [initialBrightness])

  const openApp = (app: AppWindow) => {
    // Check if app is already open
    const existingWindow = openWindows.find((window) => window.id === app.id)

    if (!existingWindow) {
      // Window not open, add it
      setOpenWindows((prev) => [...prev, app])
    } else {
      // Window already open, update its position and size if provided
      setOpenWindows((prev) =>
        prev.map((window) =>
          window.id === app.id
            ? {
                ...window,
                position: app.position || window.position,
                size: app.size || window.size,
              }
            : window
        )
      )
    }

    // Always bring window to front when selected
    // For Mac AI chat when projects are open, use lower base z-index but still bring to front
    const hasProjectsOpen = openWindows.some((w) => w.component === "Files")
    const isChatWithProjects = app.component === "ChatApp" && hasProjectsOpen
    
    if (isChatWithProjects) {
      // Set as active and bring to front, but use lower z-index base (20) so it stays behind dock (z-50)
      setActiveWindowId(app.id)
      setWindowZIndex((prev) => {
        const newMap = new Map(prev)
        // Use nextZIndex to ensure it's higher than all other windows, but cap at 45 to stay below dock (z-50)
        // This brings it to the front of all other windows while staying behind dock
        const newZ = Math.min(45, Math.max(20, nextZIndex))
        newMap.set(app.id, newZ)
        return newMap
      })
      // Increment nextZIndex to maintain proper ordering
      setNextZIndex((prev) => prev + 1)
    } else {
      // Set as active window and bring to front with normal z-index
      setActiveWindow(app.id)
    }

    // Close launchpad if open
    if (showLaunchpad) {
      setShowLaunchpad(false)
    }
  }

  const openProject = (projectName: string) => {
    if (projectName === "intelligent_ai_journal") {
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
      const menubarHeight = 26
      const dockHeight = 80
      const padding = 20
      const gap = 20
      
      // Calculate responsive sizes
      const linksWidth = 350
      const descWidth = 400 // Wider description window
      const mainWidth = Math.min(880, screenWidth - Math.max(linksWidth, descWidth) - gap - padding * 2)
      const mainHeight = Math.min(700, screenHeight - menubarHeight - dockHeight - padding * 2)
      const linksHeight = Math.min(300, mainHeight)
      const descHeight = Math.min(380, mainHeight - linksHeight - gap)
      
      const projectWindow: AppWindow = {
        id: "intelligent-ai-journal",
        title: "refrAIme - Intelligent AI Journal",
        component: "IntelligentAIJournal",
        position: { x: padding, y: menubarHeight + padding },
        size: { width: mainWidth, height: mainHeight },
      }
      const linksWindow: AppWindow = {
        id: "intelligent-ai-journal-links",
        title: "Project Resources",
        component: "IntelligentAIJournalLinks",
        position: { x: padding + mainWidth + gap, y: menubarHeight + padding },
        size: { width: linksWidth, height: linksHeight },
      }
      const descWindow: AppWindow = {
        id: "intelligent-ai-journal-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: padding + mainWidth + gap, y: menubarHeight + padding + linksHeight + gap },
        size: { width: descWidth, height: descHeight },
      }
      openApp(linksWindow)
      openApp(descWindow)
      openApp(projectWindow)
    } else if (projectName === "bias_in_doctor_selection") {
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
      const menubarHeight = 26
      const dockHeight = 80
      const padding = 20
      const gap = 20
      
      // Calculate responsive sizes
      const linksWidth = 350
      const descWidth = 400 // Wider description window
      const mainWidth = Math.min(900, screenWidth - Math.max(linksWidth, descWidth) - gap - padding * 2)
      const mainHeight = Math.min(700, screenHeight - menubarHeight - dockHeight - padding * 2)
      const linksHeight = Math.min(300, mainHeight)
      const descHeight = Math.min(380, mainHeight - linksHeight - gap)
      
      const finalReportWindow: AppWindow = {
        id: "bias-doctor-final-report",
        title: "Doctor Gender Bias Final Report",
        component: "BiasDoctorFinalReport",
        position: { x: padding, y: menubarHeight + padding },
        size: { width: mainWidth, height: mainHeight },
      }
      const linksWindow: AppWindow = {
        id: "bias-doctor-links",
        title: "Project Resources",
        component: "BiasDoctorLinks",
        position: { x: padding + mainWidth + gap, y: menubarHeight + padding },
        size: { width: linksWidth, height: linksHeight },
      }
      const descWindow: AppWindow = {
        id: "bias-doctor-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: padding + mainWidth + gap, y: menubarHeight + padding + linksHeight + gap },
        size: { width: descWidth, height: descHeight },
      }
      openApp(linksWindow)
      openApp(descWindow)
      openApp(finalReportWindow)
    } else if (projectName === "graph_based_investment_insight") {
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
      const menubarHeight = 26
      const dockHeight = 80
      const padding = 20
      const gap = 20
      
      // Calculate responsive sizes
      const linksWidth = 350
      const descWidth = 400 // Wider description window
      const mainWidth = Math.min(880, screenWidth - Math.max(linksWidth, descWidth) - gap - padding * 2)
      const mainHeight = Math.min(700, screenHeight - menubarHeight - dockHeight - padding * 2)
      const linksHeight = Math.min(300, mainHeight)
      const descHeight = Math.min(380, mainHeight - linksHeight - gap)
      
      const projectWindow: AppWindow = {
        id: "graph-investment",
        title: "Graph-Based Investment Analysis | README.md",
        component: "GraphInvestment",
        position: { x: padding, y: menubarHeight + padding },
        size: { width: mainWidth, height: mainHeight },
      }
      const linksWindow: AppWindow = {
        id: "graph-investment-links",
        title: "Project Resources",
        component: "GraphInvestmentLinks",
        position: { x: padding + mainWidth + gap, y: menubarHeight + padding },
        size: { width: linksWidth, height: linksHeight },
      }
      const descWindow: AppWindow = {
        id: "graph-investment-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: padding + mainWidth + gap, y: menubarHeight + padding + linksHeight + gap },
        size: { width: descWidth, height: descHeight },
      }
      openApp(projectWindow)
      openApp(linksWindow)
      openApp(descWindow)
    } else if (projectName === "dilo_spanish_phrases") {
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
      const menubarHeight = 26
      const dockHeight = 80
      const padding = 20
      const gap = 20
      
      // Calculate responsive sizes
      const linksWidth = 350
      const descWidth = 400 // Wider description window
      const mainWidth = Math.min(850, screenWidth - Math.max(linksWidth, descWidth) - gap - padding * 2)
      const mainHeight = Math.min(700, screenHeight - menubarHeight - dockHeight - padding * 2)
      const linksHeight = Math.min(400, mainHeight)
      const descHeight = Math.min(280, mainHeight - linksHeight - gap)
      
      // Center windows if they fit, otherwise align left
      const totalWidth = mainWidth + Math.max(linksWidth, descWidth) + gap
      const centerX = totalWidth <= screenWidth - padding * 2 
        ? (screenWidth - totalWidth) / 2 
        : padding
      
      const projectWindow: AppWindow = {
        id: "dilo-spanish",
        title: "Dilo Spanish App",
        component: "DiloSpanish",
        position: { x: centerX, y: menubarHeight + padding },
        size: { width: mainWidth, height: mainHeight },
      }
      const linksWindow: AppWindow = {
        id: "dilo-spanish-links",
        title: "Project Resources",
        component: "DiloSpanishLinks",
        position: { x: centerX + mainWidth + gap, y: menubarHeight + padding },
        size: { width: linksWidth, height: linksHeight },
      }
      const descWindow: AppWindow = {
        id: "dilo-spanish-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: centerX + mainWidth + gap, y: menubarHeight + padding + linksHeight + gap },
        size: { width: descWidth, height: descHeight },
      }
      openApp(linksWindow)
      openApp(descWindow)
      openApp(projectWindow)
    } else if (projectName === "air_pollution_analysis") {
      // Calculate responsive sizes to fit screen
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
      const padding = 20
      const menubarHeight = 26
      const dockHeight = 80
      const gap = 20
      
      // Main PDF window - thinner, leave more room for description
      const descWidth = 500 // Wider description window
      const mainWidth = Math.min(700, screenWidth - descWidth - gap - padding * 2) // Thinner report
      const mainHeight = Math.min(700, screenHeight - menubarHeight - dockHeight - padding * 2)
      const descHeight = Math.min(350, mainHeight) // Shorter description window height
      
      const reportWindow: AppWindow = {
        id: "air-pollution-analysis",
        title: "Air Pollution Analysis Report",
        component: "AirPollutionAnalysis",
        position: { x: padding, y: menubarHeight + padding },
        size: { width: mainWidth, height: mainHeight },
      }
      const descWindow: AppWindow = {
        id: "air-pollution-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: padding + mainWidth + gap, y: menubarHeight + padding },
        size: { width: descWidth, height: descHeight },
      }
      openApp(descWindow)
      openApp(reportWindow)
    }
  }

  const openVideoWindow = () => {
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
    const menubarHeight = 26
    const dockHeight = 80
    const padding = 20
    
    const videoWidth = Math.min(1000, screenWidth - padding * 2)
    const videoHeight = Math.min(600, screenHeight - menubarHeight - dockHeight - padding * 2)
    const videoX = (screenWidth - videoWidth) / 2 // Center horizontally
    const videoY = menubarHeight + padding
    
    const videoWindow: AppWindow = {
      id: "video-player",
      title: "refrAIme Demo Video",
      component: "VideoPlayer",
      position: { x: videoX, y: videoY },
      size: { width: videoWidth, height: videoHeight },
    }
    // Check if video window is already open
    const isOpen = openWindows.some((window) => window.id === "video-player")
    
    if (!isOpen) {
      // Add window to the end of the array so it renders on top
      setOpenWindows((prev) => [...prev, videoWindow])
    }
    
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      // Set as active window and bring to front with highest z-index
      setActiveWindow("video-player")
    }, 0)
    
    // Close launchpad if open
    if (showLaunchpad) {
      setShowLaunchpad(false)
    }
  }

  const minimizeWindow = (id: string) => {
    setMinimizedWindows((prev) => new Set(prev).add(id))
    setActiveWindowId(null)
  }

  const restoreWindow = (id: string) => {
    setMinimizedWindows((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
    // Bring window to front when restoring
    setActiveWindow(id)
  }

  const closeWindow = (id: string) => {
    // Define project groups - windows that should close together
    const projectGroups: Record<string, string[]> = {
      "intelligent-ai-journal": ["intelligent-ai-journal", "intelligent-ai-journal-links", "intelligent-ai-journal-desc"],
      "intelligent-ai-journal-links": ["intelligent-ai-journal", "intelligent-ai-journal-links", "intelligent-ai-journal-desc"],
      "intelligent-ai-journal-desc": ["intelligent-ai-journal", "intelligent-ai-journal-links", "intelligent-ai-journal-desc"],
      "bias-doctor-links": ["bias-doctor-links", "bias-doctor-final-report", "bias-doctor-desc"],
      "bias-doctor-final-report": ["bias-doctor-links", "bias-doctor-final-report", "bias-doctor-desc"],
      "bias-doctor-desc": ["bias-doctor-links", "bias-doctor-final-report", "bias-doctor-desc"],
      "graph-investment": ["graph-investment", "graph-investment-links", "graph-investment-desc"],
      "graph-investment-links": ["graph-investment", "graph-investment-links", "graph-investment-desc"],
      "graph-investment-desc": ["graph-investment", "graph-investment-links", "graph-investment-desc"],
      "dilo-spanish": ["dilo-spanish", "dilo-spanish-links", "dilo-spanish-desc"],
      "dilo-spanish-links": ["dilo-spanish", "dilo-spanish-links", "dilo-spanish-desc"],
      "dilo-spanish-desc": ["dilo-spanish", "dilo-spanish-links", "dilo-spanish-desc"],
      "air-pollution-analysis": ["air-pollution-analysis", "air-pollution-desc"],
      "air-pollution-desc": ["air-pollution-analysis", "air-pollution-desc"],
    }

    // Find which project group this window belongs to
    const projectGroup = projectGroups[id]
    const windowsToClose = projectGroup || [id]

    // Close all windows in the project group
    setOpenWindows((prev) => prev.filter((window) => !windowsToClose.includes(window.id)))
    setMinimizedWindows((prev) => {
      const newSet = new Set(prev)
      windowsToClose.forEach((windowId) => newSet.delete(windowId))
      return newSet
    })

    // If we closed the active window, set the last window as active
    if (activeWindowId && windowsToClose.includes(activeWindowId)) {
      const remainingWindows = openWindows.filter((window) => !windowsToClose.includes(window.id))
      if (remainingWindows.length > 0) {
        setActiveWindowId(remainingWindows[remainingWindows.length - 1].id)
      } else {
        setActiveWindowId(null)
      }
    }
  }

  const setActiveWindow = (id: string) => {
    setActiveWindowId(id)
    // Bring window to front by assigning it the highest z-index
    setWindowZIndex((prev) => {
      const newMap = new Map(prev)
      newMap.set(id, nextZIndex)
      return newMap
    })
    setNextZIndex((prev) => prev + 1)
  }

  const toggleLaunchpad = () => {
    setShowLaunchpad(!showLaunchpad)
    if (showControlCenter) setShowControlCenter(false)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleControlCenter = () => {
    setShowControlCenter(!showControlCenter)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleSpotlight = () => {
    setShowSpotlight(!showSpotlight)
    if (showControlCenter) setShowControlCenter(false)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    onToggleDarkMode()
  }

  const updateBrightness = (value: number) => {
    setScreenBrightness(value)
    onBrightnessChange(value)
  }

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Check if click is on desktop background (not on interactive elements)
    const target = e.target as HTMLElement
    // Only handle clicks on the desktop container itself or non-interactive elements
    if (target === desktopRef.current || target.classList.contains('desktop-background')) {
      setActiveWindowId(null)
      if (showControlCenter) setShowControlCenter(false)
      if (showSpotlight) setShowSpotlight(false)
    }
  }

  return (
    <div className="relative">
      <div
        ref={desktopRef}
        className={`relative h-screen w-screen overflow-hidden desktop-background ${isDarkMode ? "dark" : ""}`}
        onClick={handleDesktopClick}
      >
        <Wallpaper isDarkMode={isDarkMode} />

        {/* About Me Button */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[1] pointer-events-auto flex flex-col items-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Check if Safari is already open
              const safariWindow = openWindows.find((w) => w.id === "safari")
              if (!safariWindow) {
                const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
                const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
                const padding = 40
                const menubarHeight = 26
                const dockHeight = 80
                const safariWidth = Math.min(800, screenWidth - padding * 2)
                const safariHeight = Math.min(1000, screenHeight - menubarHeight - dockHeight - padding * 2)
                const safariX = padding + 50 // Farther to the left, near the left edge
                openApp({
                  id: "safari",
                  title: "Safari",
                  component: "Safari",
                  position: { x: safariX, y: menubarHeight + 20 }, // Near the top
                  size: { width: safariWidth, height: safariHeight },
                })
              } else {
                // If Safari is already open, just focus it
                setActiveWindowId("safari")
              }
            }}
            className="px-4 py-2 rounded-lg text-white/80 text-sm font-medium backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all shadow-lg"
          >
            About me
          </button>
        </div>

        {/* Desktop Icons */}
        <div className="absolute inset-0 pt-6 pb-16 pointer-events-none">
          {/* Chat Face ID Icon */}
          <div className={`absolute top-32 left-1/2 transform -translate-x-1/2 pointer-events-auto z-[1] transition-transform duration-500`}>
            <button
              type="button"
              className="relative flex flex-col items-center group cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
                const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
                const menubarHeight = 26
                const dockHeight = 80
                const padding = 20
                const chatWidth = 520
                const chatHeight = 500
                
                // Ensure window fits screen
                const finalWidth = Math.min(chatWidth, screenWidth - padding * 2)
                const finalHeight = Math.min(chatHeight, screenHeight - menubarHeight - dockHeight - padding * 2)
                const chatX = Math.max(padding, Math.min(10, screenWidth - finalWidth - padding))
                const paddingFromBottom = 150
                const chatY = Math.max(
                  menubarHeight + padding,
                  Math.min(screenHeight - finalHeight - paddingFromBottom, screenHeight - finalHeight - dockHeight - padding)
                )
                
                openApp({
                  id: "chat",
                  title: "Mac - Hannah's portfolio assistant",
                  component: "ChatApp",
                  position: { x: chatX, y: chatY },
                  size: { width: finalWidth, height: finalHeight },
                })
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900/90 dark:bg-gray-800/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm border border-white/20 shadow-lg">
                  Hannah's portfolio assistant
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="w-2 h-2 bg-gray-900/90 dark:bg-gray-800/90 border-r border-b border-white/20 rotate-45"></div>
                </div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center mb-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all overflow-hidden">
                <Image
                  src="/face-id.svg"
                  alt="Chat"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white text-xs text-center font-sans px-1 py-0.5 rounded group-hover:bg-white/20 transition-colors max-w-[80px] break-words">
                Ask Mac
              </span>
            </button>
          </div>

          {/* Resume Icon */}
          <div className={`absolute right-8 top-80 pointer-events-auto z-[1] transition-transform duration-500`}>
            <button
              type="button"
              className="flex flex-col items-center group cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open("/resume.pdf", "_blank", "noopener,noreferrer")
              }}
            >
              <div className="w-16 h-20 flex items-center justify-center mb-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all overflow-hidden">
                <Image
                  src="/resume-icon.png"
                  alt="Resume"
                  width={318}
                  height={414}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white text-xs text-center font-sans px-1 py-0.5 rounded group-hover:bg-white/20 transition-colors max-w-[80px] break-words">
                Resume.pdf
              </span>
            </button>
          </div>

          {/* Files Folder Icon */}
          <div className={`absolute right-8 top-[28rem] pointer-events-auto z-[1] transition-transform duration-500`}>
            <button
              type="button"
              className="flex flex-col items-center group cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Projects folder clicked")
                const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
                const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080
                const menubarHeight = 26
                const dockHeight = 80
                const padding = 20
                const gap = 20
                
                // Match air pollution analysis report window sizing and position
                const descWidth = 400 // Wider description window
                const filesWidth = Math.min(880, screenWidth - descWidth - gap - padding * 2)
                const filesHeight = Math.min(700, screenHeight - menubarHeight - dockHeight - padding * 2)
                const filesX = padding // Match air pollution report position
                const filesY = menubarHeight + padding
                
                openApp({
                  id: "files",
                  title: "Projects",
                  component: "Files",
                  position: { x: filesX, y: filesY },
                  size: { width: filesWidth, height: filesHeight },
                })
              }}
            >
              <div className="w-24 h-24 flex items-center justify-center mb-0">
                <img src="/mac_blue_folder.png" alt="Projects folder" className="w-20 h-20 object-contain" />
              </div>
              <span className="text-white text-xs text-center font-sans px-1 py-0 rounded group-hover:bg-white/20 transition-colors max-w-[80px] break-words -mt-3">
                Projects
              </span>
            </button>
          </div>
        </div>

          {/* Clickable area in top left corner to close sticky note */}
          {showStickyNote && (
            <div
              className="absolute top-0 left-0 w-16 h-16 z-30 cursor-pointer"
              onClick={() => {
                setShowStickyNote(false)
                // Reset position for next time
                setStickyNotePosition({ x: 16, y: 48 })
              }}
              aria-label="Close sticky note"
            />
          )}

          {/* macOS Sticky Note - using image */}
          {showStickyNote && (
            <div
              className="absolute z-20 cursor-move opacity-75"
              style={{ left: `${stickyNotePosition.x}px`, top: `${stickyNotePosition.y}px` }}
              onMouseDown={(e) => {
                setIsDraggingSticky(true)
                setStickyDragOffset({
                  x: e.clientX - stickyNotePosition.x,
                  y: e.clientY - stickyNotePosition.y,
                })
              }}
            >
              <div className="relative">
                <Image
                  src="/sticky.png"
                  alt="Sticky Note"
                  width={320}
                  height={280}
                  className="w-80 h-auto pointer-events-none"
                  priority
                />
                {/* Text overlay on sticky note */}
                <div className="absolute top-6 left-4 right-4 bottom-4 text-base text-pink-900 font-normal leading-relaxed pointer-events-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <p className="font-semibold mb-2">Welcome to my desktop!</p>
                  <p className="mb-2">Here you'll find:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-1 text-sm">
                    <li>Projects folder - favorite projects</li>
                    <li>Resume icon - download my resume</li>
                    <li>Icons - email, GitHub, LinkedIn</li>
                    <li>Notes app - my goals</li>
                    <li>Safari - about me & website info</li>
                  </ul>
                  <p className="mt-2 text-sm">Questions? Ask Mac - my AI chat bot with all my info!</p>
                </div>
              </div>
            </div>
          )}

        <Menubar
          time={time}
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onSpotlightClick={toggleSpotlight}
          onControlCenterClick={toggleControlCenter}
          onToggleStickyNote={() => setShowStickyNote(!showStickyNote)}
          isDarkMode={isDarkMode}
          activeWindow={activeWindowId ? openWindows.find((w) => w.id === activeWindowId) || null : null}
          onSpotifyClick={() => {
            const spotifyWindow = openWindows.find((w) => w.id === "spotify")
            if (spotifyWindow) {
              setActiveWindow("spotify")
            }
          }}
          hasSpotifyOpen={openWindows.some((w) => w.id === "spotify")}
        />

        {/* Windows */}
        <div className="absolute inset-0 pt-6 pb-16">
          {openWindows
            .filter((window) => window.component !== "Spotify")
            .map((window) => (
              <Window
                key={window.id}
                window={window}
                isActive={activeWindowId === window.id}
                onClose={() => closeWindow(window.id)}
                onFocus={() => setActiveWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                isMinimized={minimizedWindows.has(window.id)}
                isDarkMode={isDarkMode}
                onOpenProject={openProject}
                onOpenVideo={openVideoWindow}
                onMinimizeWindow={window.id === "files" ? () => minimizeWindow("files") : undefined}
                zIndex={windowZIndex.get(window.id) || (window.component === "Spotify" ? 40 : 30)}
              />
            ))}
        </div>

        {/* Spotify window - rendered separately for fixed positioning */}
        {openWindows
          .filter((window) => window.component === "Spotify")
          .map((window) => (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindowId === window.id}
              onClose={() => closeWindow(window.id)}
              onFocus={() => setActiveWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              isMinimized={minimizedWindows.has(window.id)}
              isDarkMode={isDarkMode}
              onOpenProject={openProject}
              onOpenVideo={openVideoWindow}
              onMinimizeWindow={undefined}
              zIndex={windowZIndex.get(window.id) || 30}
            />
          ))}

        {/* Launchpad */}
        {showLaunchpad && <Launchpad onAppClick={openApp} onClose={() => setShowLaunchpad(false)} />}

        {/* Control Center */}
        {showControlCenter && (
          <>
            {/* Backdrop to close on click outside */}
            <div
              className="fixed inset-0 z-[55]"
              onClick={() => setShowControlCenter(false)}
            />
            <ControlCenter
              onClose={() => setShowControlCenter(false)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              brightness={screenBrightness}
              onBrightnessChange={updateBrightness}
            />
          </>
        )}

        {/* Spotlight */}
        {showSpotlight && <Spotlight onClose={() => setShowSpotlight(false)} onAppClick={openApp} />}

        <Dock
          onAppClick={openApp}
          onLaunchpadClick={toggleLaunchpad}
          activeAppIds={openWindows.map((w) => w.id)}
          minimizedWindows={Array.from(minimizedWindows)}
          onRestoreWindow={restoreWindow}
          openWindows={openWindows}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
}
