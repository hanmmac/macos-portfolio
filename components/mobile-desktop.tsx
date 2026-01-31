"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Wallpaper from "@/components/wallpaper"
import Window from "@/components/window"
import ControlCenter from "@/components/control-center"
import type { AppWindow } from "@/types"

interface MobileDesktopProps {
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  initialDarkMode: boolean
  onToggleDarkMode: () => void
  initialBrightness: number
  onBrightnessChange: (value: number) => void
}

// iPhone-style app grid
const homeScreenApps = [
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari", color: "bg-blue-500" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes", color: "bg-yellow-400" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode", color: "bg-blue-600" },
  { id: "files", title: "Projects", icon: "/mac_blue_folder.png", component: "Files", color: "bg-blue-500" },
]

// Dock apps (bottom row)
const dockApps = [
  { id: "linkedin", title: "LinkedIn", icon: "/new_linkedin_icon.png", component: "LinkedIn", color: "bg-blue-600" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail", color: "bg-blue-400" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub", color: "bg-gray-700" },
  { id: "chat", title: "Mac AI", icon: "/face-id.svg", component: "ChatApp", color: "bg-purple-500" },
]

export default function MobileDesktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialDarkMode,
  onToggleDarkMode,
  initialBrightness,
  onBrightnessChange,
}: MobileDesktopProps) {
  const [time, setTime] = useState(new Date())
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode)
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness)
  const [windowZIndex, setWindowZIndex] = useState<Map<string, number>>(new Map())
  const [nextZIndex, setNextZIndex] = useState(30)
  const [showControlCenter, setShowControlCenter] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [isCharging, setIsCharging] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Load WiFi state from localStorage
    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    // Check battery charging status
    if ("getBattery" in navigator) {
      ;(navigator as any)
        .getBattery()
        .then((battery: any) => {
          setIsCharging(battery.charging)
          battery.addEventListener("chargingchange", () => {
            setIsCharging(battery.charging)
          })
        })
        .catch(() => {
          setIsCharging(false)
        })
    }
  }, [])

  useEffect(() => {
    setIsDarkMode(initialDarkMode)
  }, [initialDarkMode])

  useEffect(() => {
    setScreenBrightness(initialBrightness)
  }, [initialBrightness])

  const getFullScreenSize = () => {
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 375
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 667
    const statusBarHeight = 44 // iPhone status bar
    const dockHeight = 80
    return {
      width: screenWidth,
      height: screenHeight - statusBarHeight - dockHeight,
      y: statusBarHeight,
    }
  }

  const openApp = (app: { id: string; title: string; component: string } | AppWindow) => {
    // Handle both AppWindow and simple app objects
    const appId = app.id
    const appTitle = app.title
    const appComponent = app.component

    const isOpen = openWindows.some((window) => window.id === appId)

    if (!isOpen) {
      const size = getFullScreenSize()
      
      // Special positioning for chatbot - below "About me" button
      const isChat = appId === "chat"
      let windowPosition = { x: 0, y: size.y }
      let windowSize = { width: size.width, height: size.height }
      
      if (isChat) {
        // Calculate position below "About me" button
        // Status bar: 44px, top padding: 16px, resume icon: 320px, margin: 24px, button height: ~56px
        const aboutMeButtonBottom = 44 + 16 + 320 + 24 + 56
        const spacing = 20 // Space below button
        const chatY = aboutMeButtonBottom + spacing
        
        // Make chatbot window smaller, not full screen
        const chatWidth = size.width
        const chatHeight = size.height - chatY - 20 // Leave some space at bottom
        
        windowPosition = { x: 0, y: chatY }
        windowSize = { width: chatWidth, height: chatHeight }
      }
      
      const newWindow: AppWindow = {
        id: appId,
        title: appTitle,
        component: appComponent,
        position: windowPosition,
        size: windowSize,
      }
      setOpenWindows((prev) => [...prev, newWindow])
      setActiveWindow(appId)
    } else {
      setActiveWindow(appId)
    }
  }

  const openProject = (projectName: string) => {
    const size = getFullScreenSize()

    if (projectName === "intelligent_ai_journal") {
      const projectWindow: AppWindow = {
        id: "intelligent-ai-journal",
        title: "refrAIme - Intelligent AI Journal",
        component: "IntelligentAIJournal",
        position: { x: 0, y: size.y },
        size: { width: size.width, height: size.height },
      }
      openApp(projectWindow)
    } else if (projectName === "bias_in_doctor_selection") {
      const finalReportWindow: AppWindow = {
        id: "bias-doctor-final-report",
        title: "Doctor Gender Bias Final Report",
        component: "BiasDoctorFinalReport",
        position: { x: 0, y: size.y },
        size: { width: size.width, height: size.height },
      }
      openApp(finalReportWindow)
    } else if (projectName === "graph_based_investment_insight") {
      const projectWindow: AppWindow = {
        id: "graph-investment",
        title: "Graph-Based Investment Analysis | README.md",
        component: "GraphInvestment",
        position: { x: 0, y: size.y },
        size: { width: size.width, height: size.height },
      }
      openApp(projectWindow)
    } else if (projectName === "dilo_spanish_phrases") {
      const projectWindow: AppWindow = {
        id: "dilo-spanish",
        title: "Dilo Spanish App",
        component: "DiloSpanish",
        position: { x: 0, y: size.y },
        size: { width: size.width, height: size.height },
      }
      openApp(projectWindow)
    } else if (projectName === "air_pollution_analysis") {
      const reportWindow: AppWindow = {
        id: "air-pollution-analysis",
        title: "Air Pollution Analysis Report",
        component: "AirPollutionAnalysis",
        position: { x: 0, y: size.y },
        size: { width: size.width, height: size.height },
      }
      openApp(reportWindow)
    }
  }

  const openVideoWindow = () => {
    const size = getFullScreenSize()
    const videoWindow: AppWindow = {
      id: "video-player",
      title: "refrAIme Demo Video",
      component: "VideoPlayer",
      position: { x: 0, y: size.y },
      size: { width: size.width, height: size.height },
    }
    const isOpen = openWindows.some((window) => window.id === "video-player")
    if (!isOpen) {
      setOpenWindows((prev) => [...prev, videoWindow])
    }
    setTimeout(() => setActiveWindow("video-player"), 0)
  }

  const closeWindow = (id: string) => {
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

    const projectGroup = projectGroups[id]
    const windowsToClose = projectGroup || [id]

    setOpenWindows((prev) => prev.filter((window) => !windowsToClose.includes(window.id)))

    if (activeWindowId && windowsToClose.includes(activeWindowId)) {
      setActiveWindowId(null)
    }
  }

  const setActiveWindow = (id: string) => {
    setActiveWindowId(id)
    setWindowZIndex((prev) => {
      const newMap = new Map(prev)
      newMap.set(id, nextZIndex)
      return newMap
    })
    setNextZIndex((prev) => prev + 1)
  }

  const toggleControlCenter = () => {
    setShowControlCenter(!showControlCenter)
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  // iPhone status bar
  const StatusBar = () => (
    <div className="absolute top-0 left-0 right-0 h-11 bg-black/20 backdrop-blur-2xl z-50 flex items-center justify-between px-5 text-white text-sm font-semibold">
      <div className="flex items-center gap-1">
        <span className="text-[15px]">{formatTime(time)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {/* Signal bars - moved before WiFi */}
        <div className="flex items-end gap-0.5">
          <div className="w-1 h-1.5 bg-white rounded-t-sm"></div>
          <div className="w-1 h-2 bg-white rounded-t-sm"></div>
          <div className="w-1 h-2.5 bg-white rounded-t-sm"></div>
          <div className="w-1 h-3 bg-white rounded-t-sm"></div>
        </div>
        {/* WiFi Icon - same as desktop */}
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-white"
          >
            {wifiEnabled ? (
              <>
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <circle cx="12" cy="20" r="1" />
              </>
            ) : (
              <>
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <circle cx="12" cy="20" r="1" />
              </>
            )}
          </svg>
        </div>
        {/* Battery */}
        <div className="flex items-center gap-1">
          <div className="relative w-6 h-3 border border-white rounded-sm">
            <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-white rounded-r-sm"></div>
            <div className="w-full h-full bg-white rounded-sm"></div>
            {isCharging && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-white"
                >
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>
              </div>
            )}
          </div>
          <span className="text-xs">100</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        ref={desktopRef}
        className={`relative h-full w-full ${isDarkMode ? "dark" : ""}`}
      >
        <Wallpaper isDarkMode={isDarkMode} />

        <StatusBar />

        {/* Home Screen - show when no windows OR when only chatbot is open and not maximized */}
        {(() => {
          // If no windows open, show home screen
          if (openWindows.length === 0) return true
          
          // If only chatbot is open, check if it's maximized
          const chatWindow = openWindows.find((w) => w.id === "chat")
          if (chatWindow && openWindows.length === 1) {
            // Check if chatbot is maximized (full screen)
            const statusBarHeight = 44
            const dockHeight = 80
            const screenWidth = typeof window !== "undefined" ? window.innerWidth : 375
            const screenHeight = typeof window !== "undefined" ? window.innerHeight : 667
            const isMaximized = 
              chatWindow.position.y === statusBarHeight &&
              chatWindow.size.width === screenWidth &&
              chatWindow.size.height === screenHeight - statusBarHeight - dockHeight
            
            // Show home screen if chatbot is not maximized
            return !isMaximized
          }
          
          // If other windows are open (not just chatbot), hide home screen
          return false
        })() && (
          <div className="absolute inset-0 pt-11 pb-20 overflow-y-auto z-10">
            {/* App Grid with Resume */}
            <div className="px-4 pt-4 pb-4">
              <div className="flex items-start gap-6">
                {/* Resume Widget - Left Side, Widget-Sized */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => window.open("/resume.pdf", "_blank", "noopener,noreferrer")}
                    className="flex flex-col items-center gap-0 active:scale-95 transition-transform touch-manipulation -mt-8"
                  >
                    {/* Container size matches image size exactly */}
                    <div className="w-48 h-80 flex items-center justify-center rounded-3xl overflow-hidden">
                      <Image
                        src="/resume-icon.png"
                        alt="Resume"
                        width={192}
                        height={320}
                        className="w-48 h-80 object-contain rounded-3xl"
                      />
                    </div>
                    <span className="text-white text-base font-semibold text-center -mt-4">Resume</span>
                  </button>
                </div>

                {/* App Icons - 2x2 Grid on Right */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {homeScreenApps.map((app) => {
                    // Make Safari icon bigger to match Notes and align it
                    const isSafari = app.id === "safari"
                    const iconSize = isSafari ? "w-28 h-28" : "w-24 h-24"
                    const imageSize = isSafari ? "w-24 h-24" : "w-20 h-20"
                    const imageDimensions = isSafari ? { width: 112, height: 112 } : { width: 96, height: 96 }
                    // Move Safari up a little bit and reduce gap between icon and text
                    const alignmentClass = isSafari ? "-mt-2" : ""
                    const gapClass = isSafari ? "gap-0.5" : "gap-2"
                    
                    return (
                      <button
                        key={app.id}
                        onClick={() => openApp(app)}
                        className={`flex flex-col items-center ${gapClass} active:scale-95 transition-transform touch-manipulation ${alignmentClass}`}
                      >
                        <div className={`${iconSize} flex items-center justify-center`}>
                          <Image
                            src={app.icon}
                            alt={app.title}
                            width={imageDimensions.width}
                            height={imageDimensions.height}
                            className={`${imageSize} object-contain`}
                          />
                        </div>
                        <span className="text-white text-sm font-medium text-center">{app.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* About Me Button - Underneath Icons */}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Check if Safari is already open
                    const safariWindow = openWindows.find((w) => w.id === "safari")
                    if (!safariWindow) {
                      const size = getFullScreenSize()
                      openApp({
                        id: "safari",
                        title: "Safari",
                        component: "Safari",
                        position: { x: 0, y: size.y },
                        size: { width: size.width, height: size.height },
                      })
                    } else {
                      // If Safari is already open, just focus it
                      setActiveWindow("safari")
                    }
                  }}
                  className="w-[90%] py-4 rounded-lg text-white/80 text-xl font-medium backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                >
                  About me
                </button>
              </div>
            </div>
          </div>
        )}

        {/* iOS Dock */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl px-4 py-1.5 border border-white/20 flex items-center gap-4">
            {dockApps.map((app) => {
            const isActive = openWindows.some((w) => w.id === app.id)
            const isChat = app.id === "chat"
            const isLinkedIn = app.id === "linkedin"
            const isMail = app.id === "mail"
            
            // Size logic: LinkedIn and Mail smaller, GitHub bigger, Chat smallest with background
            let iconSize, imageSize, imageDimensions, backgroundClass
            if (isChat) {
              iconSize = "w-14 h-14"
              imageSize = "w-10 h-10"
              imageDimensions = { width: 56, height: 56 }
              backgroundClass = isActive ? "bg-white/20 border-2 border-white/40" : "bg-white/10 border border-white/20"
            } else if (isLinkedIn || isMail) {
              iconSize = "w-20 h-20"
              imageSize = "w-14 h-14"
              imageDimensions = { width: 56, height: 56 }
              backgroundClass = ""
            } else {
              // GitHub
              iconSize = "w-20 h-20"
              imageSize = "w-16 h-16"
              imageDimensions = { width: 64, height: 64 }
              backgroundClass = ""
            }
            
            return (
              <button
                key={app.id}
                onClick={() => openApp(app)}
                className={`flex flex-col items-center gap-1 active:scale-90 transition-transform touch-manipulation ${
                  isActive ? "opacity-100" : "opacity-80"
                }`}
              >
                <div className={`${iconSize} ${backgroundClass ? "rounded-2xl shadow-lg" : ""} flex items-center justify-center ${backgroundClass}`}>
                  <Image
                    src={app.icon}
                    alt={app.title}
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    className={`${imageSize} object-contain`}
                  />
                </div>
                {isActive && <div className="w-1 h-1 bg-white rounded-full" />}
              </button>
            )
          })}
          </div>
        </div>

        {/* App Windows - Full Screen Modals */}
        {openWindows.map((window) => (
          <Window
            key={window.id}
            window={window}
            isActive={activeWindowId === window.id}
            onClose={() => closeWindow(window.id)}
            onFocus={() => setActiveWindow(window.id)}
            onMinimize={() => closeWindow(window.id)}
            isMinimized={false}
            isDarkMode={isDarkMode}
            onOpenProject={openProject}
            onOpenVideo={openVideoWindow}
            onMinimizeWindow={window.id === "files" ? () => closeWindow("files") : undefined}
            zIndex={windowZIndex.get(window.id) || 30}
          />
        ))}

        {/* Control Center */}
        {showControlCenter && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/50"
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
      </div>
    </div>
  )
}
