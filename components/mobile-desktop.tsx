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
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail", color: "bg-blue-400" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes", color: "bg-yellow-400" },
  { id: "chat", title: "Mac AI", icon: "/face-id.svg", component: "ChatApp", color: "bg-purple-500" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode", color: "bg-blue-600" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub", color: "bg-gray-700" },
  { id: "linkedin", title: "LinkedIn", icon: "/new_linkedin_icon.png", component: "LinkedIn", color: "bg-blue-600" },
  { id: "files", title: "Projects", icon: "/mac_blue_folder.png", component: "Files", color: "bg-blue-500" },
]

// Dock apps (bottom row)
const dockApps = [
  { id: "files", title: "Projects", icon: "/mac_blue_folder.png", component: "Files", color: "bg-blue-500" },
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari", color: "bg-blue-500" },
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
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
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
    const appId = 'id' in app ? app.id : app.id
    const appTitle = 'title' in app ? app.title : app.title
    const appComponent = 'component' in app ? app.component : app.component

    const isOpen = openWindows.some((window) => window.id === appId)

    if (!isOpen) {
      const size = getFullScreenSize()
      const newWindow: AppWindow = {
        id: appId,
        title: appTitle,
        component: appComponent,
        position: { x: 0, y: size.y },
        size: { width: size.width, height: size.height },
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
        {/* Signal bars */}
        <div className="flex items-end gap-0.5">
          <div className="w-1 h-1.5 bg-white rounded-t-sm"></div>
          <div className="w-1 h-2 bg-white rounded-t-sm"></div>
          <div className="w-1 h-2.5 bg-white rounded-t-sm"></div>
          <div className="w-1 h-3 bg-white rounded-t-sm"></div>
        </div>
        {/* Battery */}
        <div className="flex items-center gap-1">
          <div className="relative w-6 h-3 border border-white rounded-sm">
            <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-white rounded-r-sm"></div>
            <div className="w-full h-full bg-white rounded-sm"></div>
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

        {/* Home Screen - only show when no apps are open */}
        {openWindows.length === 0 && (
          <div className="absolute inset-0 pt-11 pb-20 overflow-y-auto">
            {/* App Grid */}
            <div className="px-4 pt-6 pb-4">
              <div className="grid grid-cols-4 gap-4">
                {homeScreenApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => openApp(app)}
                    className="flex flex-col items-center gap-2 active:scale-95 transition-transform touch-manipulation"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg active:bg-white/20 transition-all">
                      <Image
                        src={app.icon}
                        alt={app.title}
                        width={64}
                        height={64}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <span className="text-white text-xs font-medium text-center">{app.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resume shortcut */}
            <div className="px-4 pt-4">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.open("/resume.pdf", "_blank", "noopener,noreferrer")}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-transform touch-manipulation"
                >
                  <div className="w-16 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg active:bg-white/20 transition-all">
                    <Image
                      src="/resume-icon.png"
                      alt="Resume"
                      width={64}
                      height={80}
                      className="w-12 h-16 object-contain"
                    />
                  </div>
                  <span className="text-white text-xs font-medium text-center">Resume</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* iOS Dock */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/30 backdrop-blur-2xl border-t border-white/20 z-40 flex items-center justify-center gap-6 px-4">
          {dockApps.map((app) => {
            const isActive = openWindows.some((w) => w.id === app.id)
            return (
              <button
                key={app.id}
                onClick={() => openApp(app)}
                className={`flex flex-col items-center gap-1 active:scale-90 transition-transform touch-manipulation ${
                  isActive ? "opacity-100" : "opacity-80"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    isActive ? "bg-white/20 border-2 border-white/40" : "bg-white/10 border border-white/20"
                  }`}
                >
                  <Image
                    src={app.icon}
                    alt={app.title}
                    width={56}
                    height={56}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                {isActive && <div className="w-1 h-1 bg-white rounded-full" />}
              </button>
            )
          })}
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
