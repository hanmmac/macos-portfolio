"use client"

interface VideoPlayerProps {
  isDarkMode?: boolean
}

export default function VideoPlayer({ isDarkMode = false }: VideoPlayerProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  return (
    <div className={`h-full ${bgColor} flex items-center justify-center p-4`}>
      <video
        src="/capstone-refraime-final-demo-presentation.mp4"
        controls
        autoPlay
        className="w-full h-auto max-w-6xl rounded-lg"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
