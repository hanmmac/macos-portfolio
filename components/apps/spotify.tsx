"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react"

interface SpotifyProps {
  isDarkMode?: boolean
  onClose?: () => void
}

export default function Spotify({ isDarkMode = true, onClose }: SpotifyProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Updated playlist with local files
  const playlist = [
    {
      title: "Jazz Cafe",
      artist: "Tunetank",
      cover: "/jazz_cafe_pic.png",
      file: "/jazz_cafe_music.mp3",
      duration: "3:00",
    },
    {
      title: "Late Night Coffee",
      artist: "Study Tunes",
      cover: "/guitar_music.jpeg",
      file: "/late_night_coffee.mp3",
      duration: "3:00",
    },
    {
      title: "Lofi Study Beat",
      artist: "Chill Artist",
      cover: "/cozy-corner-beats.png",
      file: "/lofi-study-112191.mp3",
      duration: "3:42",
    },
  ]

  const currentTrack = playlist[currentTrackIndex]

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const secondaryBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Reset audio ready state when track changes
    setIsAudioReady(false)
    setError(null)

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsAudioReady(true)
    }
    const handleEnd = () => handleNext()
    const handleCanPlayThrough = () => setIsAudioReady(true)
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e)
      setError("Error loading audio")
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("ended", handleEnd)
    audio.addEventListener("error", handleError as EventListener)

    // Preload the audio
    audio.load()

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
      audio.removeEventListener("ended", handleEnd)
      audio.removeEventListener("error", handleError as EventListener)
    }
  }, [currentTrackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isAudioReady) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
          setError("Playback was prevented by the browser. Try clicking play again.")
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, isAudioReady])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!isAudioReady) {
      // If audio isn't ready yet, don't try to play
      return
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    // First pause current track to avoid errors
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
    }

    setIsPlaying(false)
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))

    // We'll set isPlaying to true after the new track is loaded
    setTimeout(() => {
      if (isAudioReady) {
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleNext = () => {
    // First pause current track to avoid errors
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
    }

    setIsPlaying(false)
    setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))

    // We'll set isPlaying to true after the new track is loaded
    setTimeout(() => {
      if (isAudioReady) {
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Number.parseFloat(e.target.value)
    try {
      audio.currentTime = newTime
      setCurrentTime(newTime)
    } catch (err) {
      console.error("Error setting time:", err)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const selectTrack = (index: number) => {
    if (index === currentTrackIndex) {
      togglePlay()
      return
    }

    // First pause current track to avoid errors
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
    }

    setIsPlaying(false)
    setCurrentTrackIndex(index)

    // We'll set isPlaying to true after the new track is loaded
    setTimeout(() => {
      if (isAudioReady) {
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleClose = () => {
    // Stop the music
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    
    // Close the window
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className={`h-full ${textColor} flex flex-col bg-transparent`}>
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
        {/* Close button - top left */}
        <button
          onClick={handleClose}
          className="absolute top-2 left-2 w-5 h-5 rounded-full bg-gray-500/50 hover:bg-gray-500/70 flex items-center justify-center transition-colors z-10"
          title="Close"
        >
          <X className="w-3 h-3 text-white" />
          </button>
        
        {/* Track counter - top right */}
        <div className="absolute top-2 right-2 text-xs text-gray-400">
          {currentTrackIndex + 1}/{playlist.length} tracks
      </div>

        <div className="w-24 h-24 mb-0.5 rounded-md overflow-hidden shadow-lg">
          <img
            src={currentTrack.cover || "/placeholder.svg"}
            alt={`${currentTrack.title} cover`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center -mb-2">
          <h3 className="text-xs font-semibold">{currentTrack.title}</h3>
          <p className="text-xs text-gray-400">{currentTrack.artist}</p>
          {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
        </div>

        {/* Progress bar */}
        <div className="w-full px-2 mb-1">
          <div className={`flex justify-between text-xs mb-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            <span>{formatTime(currentTime)}</span>
            <span>{isAudioReady ? formatTime(duration) : currentTrack.duration}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleTimeChange}
            disabled={!isAudioReady}
            className={`w-full h-1 rounded-full appearance-none cursor-pointer ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
            style={{
              background: isDarkMode
                ? `linear-gradient(to right, #ffffff 0%, #ffffff ${
                    (currentTime / (duration || 1)) * 100
                  }%, #4D4D4D ${(currentTime / (duration || 1)) * 100}%, #4D4D4D 100%)`
                : `linear-gradient(to right, #1f2937 0%, #1f2937 ${
                (currentTime / (duration || 1)) * 100
                  }%, #d1d5db ${(currentTime / (duration || 1)) * 100}%, #d1d5db 100%)`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-2 mb-1">
          <button
            className="p-1 rounded-full hover:bg-gray-700/50 text-gray-300 hover:text-white"
            onClick={handlePrevious}
          >
            <SkipBack className="w-3 h-3" />
          </button>

          <button
            className={`p-1.5 ${isAudioReady ? "bg-white hover:scale-105" : "bg-gray-400"} rounded-full transition-transform`}
            onClick={togglePlay}
            disabled={!isAudioReady}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black" />}
          </button>

          <button className="p-1 rounded-full hover:bg-gray-700/50 text-gray-300 hover:text-white" onClick={handleNext}>
            <SkipForward className="w-3 h-3" />
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center w-full px-2">
          <button className={`p-0.5 rounded-full ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-300/50"} mr-1`} onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className={`w-3 h-3 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
            ) : (
              <Volume2 className={`w-3 h-3 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
            )}
          </button>

          <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
              className={`w-full h-1 rounded-full appearance-none cursor-pointer ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
            style={{
                background: isDarkMode
                  ? `linear-gradient(to right, #ffffff 0%, #ffffff ${(isMuted ? 0 : volume) * 100}%, #4D4D4D ${
                      (isMuted ? 0 : volume) * 100
                    }%, #4D4D4D 100%)`
                  : `linear-gradient(to right, #1f2937 0%, #1f2937 ${(isMuted ? 0 : volume) * 100}%, #d1d5db ${
                (isMuted ? 0 : volume) * 100
                    }%, #d1d5db 100%)`,
            }}
          />
      </div>

          <button className={`p-0.5 rounded-full ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-300/50"} ml-1`}>
            <Volume2 className={`w-3 h-3 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.file} preload="auto" />
    </div>
  )
}
