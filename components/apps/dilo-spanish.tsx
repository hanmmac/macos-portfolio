"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useRef } from "react"

interface DiloSpanishProps {
  isDarkMode?: boolean
}

export default function DiloSpanish({ isDarkMode = true }: DiloSpanishProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const isMobile = useIsMobile()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Try to auto-fill credentials on mobile
  useEffect(() => {
    if (isMobile && iframeRef.current) {
      const iframe = iframeRef.current
      
      // Wait for iframe to load
      const handleLoad = () => {
        try {
          // Try to send credentials via postMessage (if the external site supports it)
          iframe.contentWindow?.postMessage({
            type: 'AUTO_FILL_CREDENTIALS',
            email: 'demo@gmail.com',
            password: 'dilodemo',
            sitePassword: 'ilovebmo'
          }, 'https://dilo-spanish-app.vercel.app')
          
          // Also try to inject credentials via URL parameters if supported
          // Some sites support ?email=...&password=... parameters
          const urlWithParams = new URL('https://dilo-spanish-app.vercel.app/')
          urlWithParams.searchParams.set('demoEmail', 'demo@gmail.com')
          urlWithParams.searchParams.set('demoPassword', 'dilodemo')
          urlWithParams.searchParams.set('sitePassword', 'ilovebmo')
          
          // Try to access iframe content (will fail due to CORS, but worth trying)
          setTimeout(() => {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
              if (iframeDoc) {
                // Try to find and fill form fields
                const emailInput = iframeDoc.querySelector('input[type="email"], input[name*="email"], input[id*="email"]') as HTMLInputElement
                const passwordInput = iframeDoc.querySelector('input[type="password"], input[name*="password"], input[id*="password"]') as HTMLInputElement
                
                if (emailInput) {
                  emailInput.value = 'demo@gmail.com'
                  emailInput.dispatchEvent(new Event('input', { bubbles: true }))
                  emailInput.dispatchEvent(new Event('change', { bubbles: true }))
                }
                
                if (passwordInput) {
                  passwordInput.value = 'dilodemo'
                  passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
                  passwordInput.dispatchEvent(new Event('change', { bubbles: true }))
                }
              }
            } catch (e) {
              // CORS will block this, but we tried
              console.log('Could not access iframe content due to CORS')
            }
          }, 3000) // Wait 3 seconds for page to fully load
        } catch (e) {
          console.log('Could not send credentials to iframe')
        }
      }
      
      iframe.addEventListener('load', handleLoad)
      
      return () => {
        iframe.removeEventListener('load', handleLoad)
      }
    }
  }, [isMobile])

  return (
    <div className={`h-full w-full ${bgColor} overflow-hidden`}>
      <iframe
        ref={iframeRef}
        src="https://dilo-spanish-app.vercel.app/"
        className="w-full h-full border-0"
        title="Dilo Spanish App"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
