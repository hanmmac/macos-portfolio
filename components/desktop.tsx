"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
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
  const desktopRef = useRef<HTMLDivElement>(null)

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

  // Update local state when props change
  useEffect(() => {
    setIsDarkMode(initialDarkMode)
  }, [initialDarkMode])

  useEffect(() => {
    setScreenBrightness(initialBrightness)
  }, [initialBrightness])

  const openApp = (app: AppWindow) => {
    // Check if app is already open
    const isOpen = openWindows.some((window) => window.id === app.id)

    if (!isOpen) {
      setOpenWindows((prev) => [...prev, app])
    }

    // Set as active window and bring to front
    setActiveWindow(app.id)

    // Close launchpad if open
    if (showLaunchpad) {
      setShowLaunchpad(false)
    }
  }

  const openProject = (projectName: string) => {
    // Minimize the Projects window
    const projectsWindow = openWindows.find((w) => w.id === "files")
    if (projectsWindow) {
      minimizeWindow("files")
    }

    if (projectName === "intelligent_ai_journal") {
      const projectWindow: AppWindow = {
        id: "intelligent-ai-journal",
        title: "refrAIme - Intelligent AI Journal",
        component: "IntelligentAIJournal",
        position: { x: 20, y: 50 },
        size: { width: 880, height: 700 },
      }
      const linksWindow: AppWindow = {
        id: "intelligent-ai-journal-links",
        title: "Project Resources",
        component: "IntelligentAIJournalLinks",
        position: { x: 920, y: 50 },
        size: { width: 350, height: 300 },
      }
      const descWindow: AppWindow = {
        id: "intelligent-ai-journal-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: 920, y: 370 },
        size: { width: 350, height: 380 },
      }
      openApp(linksWindow)
      openApp(descWindow)
      openApp(projectWindow)
    } else if (projectName === "bias_in_doctor_selection") {
      const finalReportWindow: AppWindow = {
        id: "bias-doctor-final-report",
        title: "Doctor Gender Bias Final Report",
        component: "BiasDoctorFinalReport",
        position: { x: 20, y: 50 },
        size: { width: 900, height: 700 },
      }
      const linksWindow: AppWindow = {
        id: "bias-doctor-links",
        title: "Project Resources",
        component: "BiasDoctorLinks",
        position: { x: 940, y: 50 },
        size: { width: 350, height: 300 },
      }
      const descWindow: AppWindow = {
        id: "bias-doctor-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: 940, y: 370 },
        size: { width: 350, height: 380 },
      }
      openApp(linksWindow)
      openApp(descWindow)
      openApp(finalReportWindow)
    } else if (projectName === "graph_based_investment_insight") {
      const projectWindow: AppWindow = {
        id: "graph-investment",
        title: "Graph-Based Investment Analysis | README.md",
        component: "GraphInvestment",
        position: { x: 20, y: 50 },
        size: { width: 880, height: 700 },
      }
      const linksWindow: AppWindow = {
        id: "graph-investment-links",
        title: "Project Resources",
        component: "GraphInvestmentLinks",
        position: { x: 920, y: 50 },
        size: { width: 350, height: 300 },
      }
      const descWindow: AppWindow = {
        id: "graph-investment-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: 920, y: 370 },
        size: { width: 350, height: 380 },
      }
      openApp(projectWindow)
      openApp(linksWindow)
      openApp(descWindow)
    } else if (projectName === "dilo_spanish_phrases") {
      // Calculate center position for all windows
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920
      const totalWidth = 850 + 350 + 20 // main window + links window + gap
      const centerX = (screenWidth - totalWidth) / 2
      
      const projectWindow: AppWindow = {
        id: "dilo-spanish",
        title: "Dilo Spanish App",
        component: "DiloSpanish",
        position: { x: centerX, y: 50 },
        size: { width: 850, height: 700 },
      }
      const linksWindow: AppWindow = {
        id: "dilo-spanish-links",
        title: "Project Resources",
        component: "DiloSpanishLinks",
        position: { x: centerX + 850 + 20, y: 50 },
        size: { width: 350, height: 400 },
      }
      const descWindow: AppWindow = {
        id: "dilo-spanish-desc",
        title: "Project Description",
        component: "ProjectDescription",
        position: { x: centerX + 850 + 20, y: 470 },
        size: { width: 350, height: 280 },
      }
      openApp(linksWindow)
      openApp(descWindow)
      openApp(projectWindow)
    }
  }

  const openVideoWindow = () => {
    const videoWindow: AppWindow = {
      id: "video-player",
      title: "refrAIme Demo Video",
      component: "VideoPlayer",
      position: { x: 200, y: 150 },
      size: { width: 1000, height: 600 },
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
    setActiveWindowId(id)
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
                const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800
                const windowHeight = 500
                const paddingFromBottom = 100 // Padding from bottom of screen
                const yPosition = screenHeight - windowHeight - paddingFromBottom
                openApp({
                  id: "chat",
                  title: "Mac - Hannah's portfolio assistant",
                  component: "ChatApp",
                  position: { x: 20, y: yPosition },
                  size: { width: 550, height: 500 },
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
          <div className={`absolute right-4 top-80 pointer-events-auto z-[1] transition-transform duration-500`}>
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
          <div className={`absolute right-4 top-[28rem] pointer-events-auto z-[1] transition-transform duration-500`}>
            <button
              type="button"
              className="flex flex-col items-center group cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Projects folder clicked")
                openApp({
                  id: "files",
                  title: "Projects",
                  component: "Files",
                  position: { x: 100, y: 100 },
                  size: { width: 850, height: 600 },
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

        <Menubar
          time={time}
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onSpotlightClick={toggleSpotlight}
          onControlCenterClick={toggleControlCenter}
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
              className="fixed inset-0 z-30"
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
