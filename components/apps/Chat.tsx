"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

interface ChatAppProps {
  isDarkMode?: boolean
}

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatApp({ isDarkMode = true }: ChatAppProps) {
  // Glass effect styling similar to Spotify
  const glassBg = "backdrop-blur-xl bg-white/5 dark:bg-black/20"
  const textColor = "text-white"
  const inputBg = isDarkMode ? "bg-white/10" : "bg-white/20"
  const borderColor = "border-white/30"
  // White bubbles for assistant messages
  const assistantMessageBg = "bg-white"
  const assistantMessageText = "text-black"
  // Light hazy blue for user messages
  const userMessageBg = "backdrop-blur-md bg-blue-400/30"
  const userMessageText = "text-white"

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Hannah's portfolio assistant. Ask me anything about her background, projects, skills, or experience.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage || isLoading) return

    // Add user message to chat
    const newUserMessage: Message = { role: "user", content: userMessage }
    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Build history from current messages
      const history: { role: "user" | "assistant"; content: string }[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage: Message = { role: "assistant", content: data.reply || "Sorry, I couldn't generate a response." }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, there was an error processing your message. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`h-full ${glassBg} ${textColor} flex flex-col`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? `${userMessageBg} ${userMessageText}`
                  : `${assistantMessageBg} ${assistantMessageText}`
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`${assistantMessageBg} ${assistantMessageText} rounded-lg px-4 py-2`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-black rounded-full thinking-dot-1"></span>
                <span className="w-2 h-2 bg-black rounded-full thinking-dot-2"></span>
                <span className="w-2 h-2 bg-black rounded-full thinking-dot-3"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className={`border-t ${borderColor} p-4`}>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Hannah..."
            disabled={isLoading}
            className={`flex-1 text-sm ${inputBg} ${textColor} border ${borderColor} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 placeholder:text-white/60`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border ${borderColor}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
