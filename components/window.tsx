"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Minus, ArrowRightIcon as ArrowsMaximize, ZoomIn, ZoomOut, ExternalLink } from "lucide-react"
import type { AppWindow } from "@/types"
import { useIsMobile } from "@/hooks/use-mobile"
import Notes from "@/components/apps/notes"
import GitHub from "@/components/apps/github"
import Safari from "@/components/apps/safari"
import VSCode from "@/components/apps/vscode"
import Terminal from "@/components/apps/terminal"
import Mail from "@/components/apps/mail"
import YouTube from "@/components/apps/youtube"
import LinkedIn from "@/components/apps/linkedin"
import Spotify from "@/components/apps/spotify"
import Snake from "@/components/apps/snake"
import Weather from "@/components/apps/weather"
import Files from "@/components/apps/files"
import IntelligentAIJournal from "@/components/apps/intelligent-ai-journal"
import VideoPlayer from "@/components/apps/video-player"
import BiasDoctorLinks from "@/components/apps/bias-doctor-links"
import BiasDoctorFinalReport from "@/components/apps/bias-doctor-final-report"
import AirPollutionAnalysis from "@/components/apps/air-pollution-analysis"
import Analytics from "@/components/apps/analytics"
import HousingAffordability from "@/components/apps/housing-affordability"
import GraphInvestment from "@/components/apps/graph-investment"
import GraphInvestmentLinks from "@/components/apps/graph-investment-links"
import DiloSpanish from "@/components/apps/dilo-spanish"
import DiloSpanishLinks from "@/components/apps/dilo-spanish-links"
import IntelligentAIJournalLinks from "@/components/apps/intelligent-ai-journal-links"
import ProjectDescription from "@/components/apps/project-description"
import ChatApp from "@/components/apps/Chat"


const componentMap: Record<string, React.ComponentType<{ isDarkMode?: boolean; onClose?: () => void; onOpenProject?: (projectName: string) => void; onOpenVideo?: () => void; onMinimizeWindow?: () => void; projectId?: string }>> = {
  Notes,
  GitHub,
  Safari,
  VSCode,
  Terminal,
  Mail,
  YouTube,
  LinkedIn,
  Spotify,
  Snake,
  Weather,
  Files,
  IntelligentAIJournal,
  VideoPlayer,
  BiasDoctorLinks,
  BiasDoctorFinalReport,
  AirPollutionAnalysis,
  Analytics,
  HousingAffordability,
  GraphInvestment,
  GraphInvestmentLinks,
  DiloSpanish,
  DiloSpanishLinks,
  IntelligentAIJournalLinks,
  ProjectDescription,
  ChatApp,
}

interface WindowProps {
  window: AppWindow
  isActive: boolean
  onClose: () => void
  onFocus: () => void
  onMinimize: () => void
  isMinimized: boolean
  isDarkMode: boolean
  onOpenProject?: (projectName: string) => void
  onOpenVideo?: () => void
  onMinimizeWindow?: () => void
  zIndex?: number
}

export default function Window({ window, isActive, onClose, onFocus, onMinimize, isMinimized, isDarkMode, onOpenProject, onOpenVideo, onMinimizeWindow, zIndex = 30 }: WindowProps) {
  const [position, setPosition] = useState(window.position)
  const [size, setSize] = useState(window.size)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 })
  // Set default zoom to 90% for project resources windows, 100% for others
  const isProjectResources = window.component === "BiasDoctorLinks" || window.component === "GraphInvestmentLinks" || window.component === "IntelligentAIJournalLinks"
  const [zoomLevel, setZoomLevel] = useState(isProjectResources ? 90 : 100)
  const isMobile = useIsMobile()

  const windowRef = useRef<HTMLDivElement>(null)

  const AppComponent = componentMap[window.component]
  const isSpotify = window.component === "Spotify"

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Prevent dragging for Spotify
      if (isDragging && !isSpotify) {
        const newY = Math.max(24, e.clientY - dragOffset.y) // Prevent going above menu bar (24px height)
        
        // Get viewport dimensions
        const viewportWidth = globalThis.window.innerWidth
        const viewportHeight = globalThis.window.innerHeight
        
        // Calculate boundaries - window can only go halfway off screen
        const minX = -size.width / 2 // Can go halfway off left
        const maxX = viewportWidth - size.width / 2 // Can go halfway off right
        const minY = 24 // Can't go above menu bar
        const maxY = viewportHeight - size.height / 2 // Can go halfway off bottom
        
        const newX = Math.max(minX, Math.min(maxX, e.clientX - dragOffset.x))
        const constrainedY = Math.max(minY, Math.min(maxY, newY))
        
        setPosition({
          x: newX,
          y: constrainedY,
        })
      } else if (isResizing && resizeDirection) {
        e.preventDefault()
        const dx = e.clientX - resizeStartPos.x
        const dy = e.clientY - resizeStartPos.y

        // Get viewport dimensions
        const viewportWidth = globalThis.window.innerWidth
        const viewportHeight = globalThis.window.innerHeight

        let newWidth = resizeStartSize.width
        let newHeight = resizeStartSize.height
        let newX = position.x
        let newY = position.y

        // Minimum window dimensions
        const minWidth = 300
        const minHeight = 200

        // Handle horizontal resizing (east/west)
        if (resizeDirection.includes("e")) {
          // Resizing from right edge
          const proposedWidth = resizeStartSize.width + dx
          const rightEdge = position.x + proposedWidth
          const maxAllowedRight = viewportWidth
          
          if (rightEdge <= maxAllowedRight) {
            newWidth = Math.max(minWidth, proposedWidth)
          } else {
            // Constrain to max allowed right edge
            newWidth = Math.max(minWidth, maxAllowedRight - position.x)
          }
        } else if (resizeDirection.includes("w")) {
          // Resizing from left edge
          const proposedWidth = resizeStartSize.width - dx
          if (proposedWidth >= minWidth) {
            const proposedX = position.x + dx
            const minX = 0 // Don't allow window to go off left edge
            
            // Ensure the new position doesn't go too far left
            if (proposedX >= minX) {
              newWidth = proposedWidth
              newX = proposedX
            } else {
              // Constrain to minimum X position
              newX = minX
              newWidth = resizeStartSize.width + (position.x - minX)
            }
            
            // Additional check: ensure right edge doesn't go too far off screen
            const rightEdge = newX + newWidth
            const maxAllowedRight = viewportWidth
            if (rightEdge > maxAllowedRight) {
              newWidth = maxAllowedRight - newX
            }
          }
        }

        // Handle vertical resizing (south/north)
        if (resizeDirection.includes("s")) {
          // Resizing from bottom edge
          const proposedHeight = resizeStartSize.height + dy
          const bottomEdge = position.y + proposedHeight
          const maxAllowedBottom = viewportHeight
          
          if (bottomEdge <= maxAllowedBottom) {
            newHeight = Math.max(minHeight, proposedHeight)
          } else {
            // Constrain to max allowed bottom edge
            newHeight = Math.max(minHeight, maxAllowedBottom - position.y)
          }
        } else if (resizeDirection.includes("n")) {
          // Resizing from top edge
          const proposedHeight = resizeStartSize.height - dy
          if (proposedHeight >= minHeight) {
            const proposedY = position.y + dy
            const minY = 26 // Menu bar height
            
            // Ensure the new position doesn't go above menu bar
            if (proposedY >= minY) {
              newHeight = proposedHeight
              newY = proposedY
            } else {
              // Constrain to minimum Y position (menu bar)
              newY = minY
              newHeight = resizeStartSize.height + (position.y - minY)
            }
            
            // Additional check: ensure bottom edge doesn't go too far off screen
            const bottomEdge = newY + newHeight
            const maxAllowedBottom = viewportHeight
            if (bottomEdge > maxAllowedBottom) {
              newHeight = maxAllowedBottom - newY
            }
          }
        }

        // Final constraints: ensure window stays within viewport
        // Ensure left edge doesn't go negative
        if (newX < 0) {
          newWidth = newWidth + newX // Adjust width to compensate
          newX = 0
        }
        
        // Ensure right edge doesn't exceed viewport
        if (newX + newWidth > viewportWidth) {
          newWidth = viewportWidth - newX
        }
        
        // Ensure top edge doesn't go above menubar
        if (newY < 26) {
          newHeight = newHeight + (newY - 26) // Adjust height to compensate
          newY = 26
        }
        
        // Ensure bottom edge doesn't exceed viewport
        if (newY + newHeight > viewportHeight) {
          newHeight = viewportHeight - newY
        }
        
        // Ensure minimum dimensions are maintained
        newWidth = Math.max(minWidth, newWidth)
        newHeight = Math.max(minHeight, newHeight)
        
        setSize({ width: newWidth, height: newHeight })
        // Update position for west and north resizing
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          setPosition({ x: newX, y: newY })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, isResizing, resizeDirection, resizeStartPos, resizeStartSize, position])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isSpotify || isMobile) return // Prevent dragging for Spotify and on mobile

    // Prevent dragging when clicking on buttons
    if ((e.target as HTMLElement).closest(".window-controls")) {
      return
    }

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })

    onFocus()
  }

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSpotify || isMobile) return // Prevent resizing for Spotify and on mobile

    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY,
    })
    setResizeStartSize({
      width: size.width,
      height: size.height,
    })

    onFocus()
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous state
      setPosition(preMaximizeState.position)
      setSize(preMaximizeState.size)
    } else {
      // Save current state before maximizing
      setPreMaximizeState({ position, size })

      if (isMobile) {
        // Mobile: account for status bar (44px) and dock (80px)
        const statusBarHeight = 44
        const dockHeight = 80
        setPosition({ x: 0, y: statusBarHeight })
        setSize({
          width: globalThis.window.innerWidth,
          height: globalThis.window.innerHeight - statusBarHeight - dockHeight,
        })
      } else {
        // Desktop: Get the available space (accounting for menubar)
        const availableHeight = globalThis.window.innerHeight - 26 // 6px for menubar + 20px padding

        // Maximize
        setPosition({ x: 0, y: 26 }) // Position below menubar
        setSize({
          width: globalThis.window.innerWidth,
          height: availableHeight - 70, // Account for dock
        })
      }
    }

    setIsMaximized(!isMaximized)
  }

  const handleMinimize = () => {
    onMinimize()
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }

  const isChat = window.component === "ChatApp"
  const isFiles = window.component === "Files"
  const isVideoPlayer = window.component === "VideoPlayer"

  const titleBarClass = isChat
    ? "backdrop-blur-md bg-white/10 border-b border-white/20" // Keep consistent styling, text stays white
    : isDarkMode
    ? isActive
      ? "bg-gray-800"
      : "bg-gray-900"
    : isActive
      ? "bg-gray-200"
      : "bg-gray-100"

  const contentBgClass = isDarkMode ? "bg-gray-900" : "bg-white"
  const textClass = isDarkMode ? "text-white" : "text-gray-800"
  const resizeBorderClass = isDarkMode ? "border-gray-700" : "border-gray-300"
  
  // Don't render if minimized
  if (isMinimized) {
    return null
  }
  
  // Use dynamic z-index if provided, otherwise fall back to default
  const dynamicZIndex = zIndex || 30
  const isGlassWindow = isSpotify || isChat
  
  // Calculate Spotify position using right/top instead of left/top
  const spotifySpacing = 20
  const spotifyTop = 40

  return (
    <div
      ref={windowRef}
      className={`${isSpotify ? "fixed" : "absolute"} ${isMobile ? "rounded-t-3xl" : "rounded-lg"} overflow-hidden transition-shadow ${
        isGlassWindow 
          ? "backdrop-blur-xl bg-white/5 dark:bg-black/20 border border-white/30 dark:border-white/30 shadow-2xl"
          : isVideoPlayer && isActive
          ? "shadow-2xl"
          : isActive ? "shadow-2xl" : "shadow-lg"
      }`}
      style={
        isSpotify
          ? {
              right: `${spotifySpacing}px`,
              top: `${spotifyTop}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
              zIndex: dynamicZIndex,
            }
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
              zIndex: dynamicZIndex,
            }
      }
      onClick={onFocus}
    >
      {/* Title bar - hide for Spotify only */}
      {window.component !== "Spotify" && (
        <div className={`${isMobile ? "h-12" : "h-8"} flex items-center ${isMobile ? "px-4" : "px-3"} ${isMobile ? "bg-white/10 backdrop-blur-xl border-b border-white/20" : titleBarClass}`} onMouseDown={handleTitleBarMouseDown}>
          {isMobile ? (
            // iOS-style header
            <>
              <button
                onClick={onClose}
                className="text-white text-base font-medium active:opacity-70 touch-manipulation"
              >
                ✕
              </button>
              <div className={`flex-1 text-center text-base font-semibold ${isChat ? (isDarkMode ? "text-white" : "text-black") : "text-white"} font-sans`}>
                {window.title}
              </div>
              {isChat && (
                <button
                  onClick={toggleMaximize}
                  className="text-white text-base font-medium active:opacity-70 touch-manipulation"
                >
                  {isMaximized ? "⊟" : "⊞"}
                </button>
              )}
              {!isChat && <div className="w-12"></div>}
            </>
          ) : (
            // Desktop-style header
            <>
              <div className="window-controls flex items-center space-x-2 mr-4">
                <button
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                  onClick={onClose}
                >
                  <X className="w-2 h-2 text-red-800 opacity-0 hover:opacity-100" />
                </button>
                <button
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center"
                  onClick={handleMinimize}
                >
                  <Minus className="w-2 h-2 text-yellow-800 opacity-0 hover:opacity-100" />
                </button>
                {!isFiles && (
                  <button
                    className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
                    onClick={toggleMaximize}
                  >
                    <ArrowsMaximize className="w-2 h-2 text-green-800 opacity-0 hover:opacity-100" />
                  </button>
                )}
              </div>

              <div className={`flex-1 text-center text-sm font-medium truncate ${isChat ? (isDarkMode ? "text-white" : "text-black") : textClass} font-sans`}>{window.title}</div>
            </>
          )}

          {!isMobile && (
            <div className="flex items-center space-x-1 window-controls">
              {/* External link button for IntelligentAIJournal */}
              {window.component === "IntelligentAIJournal" && (
                <button
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${isDarkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-gray-800"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    globalThis.window.open("https://www.ischool.berkeley.edu/projects/2025/refraime", "_blank", "noopener,noreferrer")
                  }}
                  title="Open project page"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Browser</span>
                </button>
              )}
              {/* External link button for DiloSpanish */}
              {window.component === "DiloSpanish" && (
                <button
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${isDarkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-gray-800"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    globalThis.window.open("https://dilo-spanish-app.vercel.app/", "_blank", "noopener,noreferrer")
                  }}
                  title="Open project page"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Browser</span>
                </button>
              )}
              <button
                className={`p-1 rounded ${isChat ? (isDarkMode ? "hover:bg-white/20 text-white" : "hover:bg-black/10 text-black") : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }}
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className={`text-xs px-1 ${isChat ? (isDarkMode ? "text-white" : "text-black") : ""}`}>{zoomLevel}%</span>
              <button
                className={`p-1 rounded ${isChat ? (isDarkMode ? "hover:bg-white/20 text-white" : "hover:bg-black/10 text-black") : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Window content */}
      <div 
        className={`${isGlassWindow ? "bg-transparent" : contentBgClass} ${isSpotify ? "h-full" : isMobile ? "h-[calc(100%-3rem)]" : "h-[calc(100%-2rem)]"} overflow-auto`}
        style={{ zoom: isMobile ? "100%" : `${zoomLevel}%` }}
      >
        {AppComponent ? (
          isSpotify ? (
            <AppComponent isDarkMode={isDarkMode} onClose={onClose} />
          ) : window.component === "Files" ? (
            <AppComponent isDarkMode={isDarkMode} onOpenProject={onOpenProject} onMinimizeWindow={onMinimizeWindow} />
          ) : window.component === "IntelligentAIJournal" ? (
            <AppComponent isDarkMode={isDarkMode} />
          ) : window.component === "IntelligentAIJournalLinks" ? (
            <AppComponent isDarkMode={isDarkMode} onOpenVideo={onOpenVideo} />
          ) : window.component === "ProjectDescription" ? (
            <AppComponent isDarkMode={isDarkMode} projectId={window.id} />
          ) : (
            <AppComponent isDarkMode={isDarkMode} />
          )
        ) : (
          <div className="p-4">Content not available</div>
        )}
      </div>

      {/* Resize handles - right edge and bottom-right corner for all windows except Spotify */}
      {!isMaximized && !isSpotify && !isMobile && (
        <>
          {/* Right edge resize handle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize z-20"
            onMouseDown={(e) => handleResizeMouseDown(e, "e")}
          />
          {/* Bottom-right corner resize handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20"
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
          />
        </>
      )}
    </div>
  )
}
