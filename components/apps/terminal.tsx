"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface TerminalProps {
  isDarkMode?: boolean
}

export default function Terminal({ isDarkMode = true }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Terminal is always dark
  const bgColor = "bg-black"
  const textColor = "text-green-400"

  useEffect(() => {
    // Focus input when terminal is clicked
    const handleClick = () => {
      inputRef.current?.focus()
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)

      // Initial welcome message
      setHistory([
        "Last login: " + new Date().toLocaleString(),
        "Welcome to Hannah's Terminal",
        "Type 'help' to see available commands",
        "",
      ])
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener("click", handleClick)
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input)
      setCommandHistory((prev) => [...prev, input])
      setHistoryIndex(-1)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      navigateHistory(-1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      navigateHistory(1)
    }
  }

  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return

    const newIndex = historyIndex + direction

    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1)
      setInput("")
    } else if (newIndex >= 0) {
      setHistoryIndex(newIndex)
      setInput(commandHistory[commandHistory.length - 1 - newIndex])
    }
  }

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()
    const args = command.split(" ")
    const mainCommand = args[0]

    // Add command to history
    setHistory((prev) => [...prev, `hannah@macbook-pro ~ $ ${cmd}`, ""])

    // Process command
    switch (mainCommand) {
      case "help":
        setHistory((prev) => [
          ...prev,
          "Available commands:",
          "  help - Show this help message",
          "  clear - Clear the terminal",
          "  echo [text] - Print text",
          "  date - Show current date and time",
          "  ls - List files",
          "  whoami - Show current user",
          "  about - About me",
          "  skills - My technical skills",
          "  contact - Contact information",
          "",
        ])
        break

      case "clear":
        setHistory([""])
        break

      case "echo":
        const echoText = args.slice(1).join(" ")
        setHistory((prev) => [...prev, echoText, ""])
        break

      case "date":
        setHistory((prev) => [...prev, new Date().toString(), ""])
        break

      case "ls":
        setHistory((prev) => [...prev, "Documents", "Projects", "Downloads", "Desktop", "Music", "Pictures", "Videos", ""])
        break

      case "whoami":
        setHistory((prev) => [...prev, "hannah", ""])
        break

      case "about":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────────────┐",
          "│ Hannah MacDonald                            │",
          "│ Data Scientist & Product Developer         │",
          "└─────────────────────────────────────────────┘",
          "",
          "Recent UC Berkeley MIDS grad focused on applied stats,",
          "machine learning, and data engineering.",
          "",
          "I build products that get used by keeping the data story",
          "and user metrics front and center.",
          "",
        ])
        break

        case "skills":
          setHistory((prev) => [
            ...prev,
            "┌─────────────────────────────────────┐",
            "│   Technical Skills                  │",
            "└─────────────────────────────────────┘",
            "",
            "Data Science & Analytics:",
            "• Python (pandas, numpy, scipy, matplotlib, seaborn)",
            "• R (tidyverse, ggplot2, statistical modeling)",
            "• SQL (PostgreSQL, complex queries, data modeling)",
            "• Statistical Analysis & Experimental Design",
            "• Data Visualization & A/B Testing",
            "• Product Metrics & User Analytics",
            "",
            "Machine Learning & AI:",
            "• Scikit-learn, TensorFlow, PyTorch",
            "• NLP & LLMs (OpenAI APIs, prompt engineering)",
            "• RAG Systems & Vector Databases",
            "• Model Interpretability & Validation",
            "• Feature Engineering & EDA",
            "",
            "Data Engineering & Databases:",
            "• PostgreSQL & Supabase",
            "• Neo4j (Graph Databases, Cypher)",
            "• ETL Pipelines & Data Modeling",
            "• Graph Algorithms (PageRank, community detection)",
            "",
            "Product & Engineering:",
            "• React, Next.js, JavaScript, TypeScript",
            "• Streamlit & Lightweight Frontends",
            "• Product Development & UX Design",
            "• Git, GitHub, Agile Methodologies",
            "",
          ])
          break

      case "contact":
        setHistory((prev) => [
          ...prev,
          "┌─────────┐",
          "│ Contact │",
          "└─────────┘",
          "",
          "Email: hannahmarief15@gmail.com",
          "GitHub: github.com/hanmmac",
          "LinkedIn: linkedin.com/in/hannah-marie-macdonald/",
          "Website: hannah-marie-macdonald.com",
          "",
        ])
        break

      default:
        setHistory((prev) => [
          ...prev,
          `Command not found: ${mainCommand}`,
          'Type "help" to see available commands',
          "",
        ])
    }
  }

  return (
    <div ref={terminalRef} className={`h-full ${bgColor} ${textColor} p-4 font-mono text-sm overflow-auto`}>
      {history.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}

      <div className="flex">
        <span className="mr-2">hannah@macbook-pro ~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none caret-green-400 text-green-400"
          autoFocus
        />
      </div>
    </div>
  )
}
