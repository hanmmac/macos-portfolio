"use client"

import { useEffect, useRef } from "react"

interface LinkedInProps {
  isDarkMode?: boolean
}

export default function LinkedIn({ isDarkMode = true }: LinkedInProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const hasOpenedRef = useRef(false)

  // Open LinkedIn profile when the app is opened
  useEffect(() => {
    // Only open once
    if (!hasOpenedRef.current) {
      hasOpenedRef.current = true

      // LinkedIn profile URL
      const linkedinUrl = "https://www.linkedin.com/in/hannah-macdonald/"

      // Open in new tab
      window.open(linkedinUrl, "_blank")
    }
  }, [])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center">
        <img src="/new_linkedin_icon.png" alt="LinkedIn" className="w-16 h-16 mx-auto mb-4 object-contain" />
        <h2 className="text-xl font-semibold mb-2">Opening LinkedIn...</h2>
        <p>Redirecting to your LinkedIn profile</p>
      </div>
    </div>
  )
}
