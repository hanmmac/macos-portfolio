"use client"

interface BiasDoctorFinalReportProps {
  isDarkMode?: boolean
}

export default function BiasDoctorFinalReport({ isDarkMode = true }: BiasDoctorFinalReportProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  return (
    <div className={`h-full ${bgColor} overflow-auto`}>
      <iframe
        src="/doc_bias_final_report.pdf"
        className="w-full h-full border-0"
        title="Doctor Gender Bias Final Report PDF"
      />
    </div>
  )
}

