"use client"

interface DiloSpanishProps {
  isDarkMode?: boolean
}

export default function DiloSpanish({ isDarkMode = true }: DiloSpanishProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  return (
    <div className={`h-full w-full ${bgColor} overflow-hidden`}>
      <iframe
        src="https://dilo-spanish-app.vercel.app/"
        className="w-full h-full border-0"
        title="Dilo Spanish App"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
