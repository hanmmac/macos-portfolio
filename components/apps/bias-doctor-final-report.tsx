"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useRef } from "react"

interface BiasDoctorFinalReportProps {
  isDarkMode?: boolean
}

export default function BiasDoctorFinalReport({ isDarkMode = true }: BiasDoctorFinalReportProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const isMobile = useIsMobile()
  const hasOpenedRef = useRef(false)

  // Redirect to GitHub on mobile
  useEffect(() => {
    if (isMobile && !hasOpenedRef.current) {
      hasOpenedRef.current = true
      window.open("https://github.com/hanmmac/doctor-gender-bias-study", "_blank")
    }
  }, [isMobile])

  return (
    <div className={`h-full w-full ${bgColor} overflow-hidden`}>
      {isMobile ? (
        <div className={`h-full ${bgColor} p-6 flex items-center justify-center`}>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Opening GitHub...</h2>
            <p className="text-sm opacity-70">Redirecting to the Doctor Gender Bias Study repository</p>
          </div>
        </div>
      ) : (
        <iframe
          src="/doc_bias_final_report.pdf"
          className="w-full h-full border-0"
          title="Doctor Gender Bias Final Report PDF"
        />
      )}
    </div>
  )
}

