"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

export default function Wallpaper({ isDarkMode }: { isDarkMode: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [preloadComplete, setPreloadComplete] = useState(false)

  // Preload the other image for smooth transitions
  useEffect(() => {
    // Use native browser Image constructor, not Next.js Image component
    const preloadImage = new window.Image()
    const otherImageSrc = isDarkMode ? "/mohave-day.jpg" : "/mojavi-night.jpg"
    preloadImage.src = otherImageSrc
    preloadImage.onload = () => setPreloadComplete(true)
  }, [isDarkMode])

  // Reset loaded state when switching modes
  useEffect(() => {
    setIsLoaded(false)
  }, [isDarkMode])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={isDarkMode ? "/mojavi-night.jpg" : "/mohave-day.jpg"}
        alt="Desktop wallpaper"
        fill
        priority
        quality={90}
        className="object-cover transition-opacity duration-500"
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
        sizes="100vw"
        unoptimized={true}
      />
      {/* Fallback background color while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 transition-colors duration-500"
          style={{ 
            backgroundColor: isDarkMode ? "#1a1a2e" : "#e8e8e8" 
          }}
        />
      )}
    </div>
  )
}
