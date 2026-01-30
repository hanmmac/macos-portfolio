"use client"

import { useEffect, useMemo, useState } from "react"
import { Files, Search, GitBranch, Bug, Play, Puzzle, PanelBottom, ChevronRight, ChevronDown } from "lucide-react"

interface VSCodeProps {
  isDarkMode?: boolean
}

type TreeNode = {
  name: string
  path: string
  kind: "file" | "folder"
  children?: TreeNode[]
}

type OpenTab = {
  path: string
  name: string
  content: string
}

function fileIcon(name: string) {
  const lower = name.toLowerCase()
  if (lower.endsWith(".tsx")) return "TSX"
  if (lower.endsWith(".ts")) return "TS"
  if (lower.endsWith(".jsx")) return "JSX"
  if (lower.endsWith(".js")) return "JS"
  if (lower.endsWith(".json")) return "{}"
  if (lower.endsWith(".md")) return "MD"
  if (lower.endsWith(".css")) return "CSS"
  if (lower.endsWith(".mjs") || lower.endsWith(".cjs")) return "JS"
  return "TXT"
}

function splitLines(content: string) {
  return content.replace(/\r\n/g, "\n").split("\n")
}

function TreeView({
  node,
  depth,
  onOpenFile,
  isDarkMode,
  hoverClass,
  fileTextClass,
  metaTextClass,
  selectedPath,
}: {
  node: TreeNode
  depth: number
  onOpenFile: (path: string, name: string) => void
  isDarkMode: boolean
  hoverClass: string
  fileTextClass: string
  metaTextClass: string
  selectedPath: string
}) {
  const [open, setOpen] = useState(true)
  const pad = depth * 12

  if (node.kind === "file") {
    const isSelected = node.path === selectedPath
    return (
      <button
        className={`w-full text-left flex items-center gap-2 py-1 px-2 rounded ${hoverClass} ${
          isSelected ? (isDarkMode ? "bg-white/10" : "bg-black/10") : ""
        }`}
        style={{ paddingLeft: 8 + pad }}
        onClick={() => onOpenFile(node.path, node.name)}
      >
        <span className={`w-9 text-[10px] font-mono ${metaTextClass}`}>{fileIcon(node.name)}</span>
        <span className={`text-xs font-mono truncate ${fileTextClass}`}>{node.name}</span>
      </button>
    )
  }

  return (
    <div>
      <button
        className={`w-full text-left flex items-center gap-2 py-1 px-2 rounded ${hoverClass}`}
        style={{ paddingLeft: 8 + pad }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="w-5 flex items-center justify-center">
          {open ? (
            <ChevronDown className={`w-3.5 h-3.5 ${metaTextClass}`} />
          ) : (
            <ChevronRight className={`w-3.5 h-3.5 ${metaTextClass}`} />
          )}
        </span>
        <span className={`w-4 text-[10px] font-mono ${metaTextClass}`}></span>
        <span className={`text-xs font-mono truncate ${fileTextClass}`}>{node.name}</span>
      </button>
      {open && node.children ? (
        <div>
          {node.children.map((c) => (
            <TreeView
              key={c.path || `${node.path}/${c.name}`}
              node={c}
              depth={depth + 1}
              onOpenFile={onOpenFile}
              isDarkMode={isDarkMode}
              hoverClass={hoverClass}
              fileTextClass={fileTextClass}
              metaTextClass={metaTextClass}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function VSCode({ isDarkMode = true }: VSCodeProps) {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([])
  const [activePath, setActivePath] = useState<string>("")
  const [status, setStatus] = useState<string>("")

  const theme = useMemo(
    () => ({
      // closer to VS Code dark+
      bg: isDarkMode ? "bg-[#1e1e1e]" : "bg-white",
      titlebar: isDarkMode ? "bg-[#1f1f1f]" : "bg-[#f3f3f3]",
      activity: isDarkMode ? "bg-[#333333]" : "bg-[#e7e7e7]",
      sidebar: isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]",
      editor: isDarkMode ? "bg-[#1e1e1e]" : "bg-white",
      border: isDarkMode ? "border-white/10" : "border-black/10",
      text: isDarkMode ? "text-white" : "text-gray-900",
      subtle: isDarkMode ? "text-white/60" : "text-gray-500",
      tabbar: isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]",
      tabInactive: isDarkMode ? "bg-[#2d2d2d]" : "bg-[#e7e7e7]",
      tabActive: isDarkMode ? "bg-[#1e1e1e]" : "bg-white",
      hover: isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5",
      iconPrimary: isDarkMode ? "text-white/80" : "text-gray-700",
      iconMuted: isDarkMode ? "text-white/60" : "text-gray-500",
      explorerHeader: isDarkMode ? "text-white/60" : "text-gray-600",
      explorerSection: isDarkMode ? "text-white/70" : "text-gray-700",
      treeMeta: isDarkMode ? "text-white/60" : "text-gray-500",
      treeText: isDarkMode ? "text-white/85" : "text-gray-800",
      statusbar: "bg-[#007acc]",
    }),
    [isDarkMode],
  )

  useEffect(() => {
    let cancelled = false
    setStatus("Loading workspace…")
    fetch("/api/vscode/tree")
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return
        setRoot(j.root ?? null)
        setStatus("")
      })
      .catch(() => {
        if (cancelled) return
        setStatus("Failed to load workspace tree.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const openFile = async (pathStr: string, name: string) => {
    setStatus(`Opening ${name}…`)
    // If already open, just activate it.
    const existing = openTabs.find((t) => t.path === pathStr)
    if (existing) {
      setActivePath(pathStr)
      setStatus("")
      return
    }

    try {
      const res = await fetch(`/api/vscode/file?path=${encodeURIComponent(pathStr)}`)
      const j = await res.json()
      const content = typeof j.content === "string" ? j.content : `Unable to open file: ${j.error || "Unknown error"}`
      const tab: OpenTab = { path: pathStr, name, content }
      setOpenTabs((prev) => [...prev, tab])
      setActivePath(pathStr)
      setStatus("")
    } catch {
      setStatus("Failed to open file.")
    }
  }

  // Default: open README.md if it exists.
  useEffect(() => {
    if (!root || openTabs.length > 0) return
    const findReadme = (n: TreeNode): TreeNode | null => {
      if (n.kind === "file" && n.name.toLowerCase() === "readme.md") return n
      for (const c of n.children || []) {
        const hit = findReadme(c)
        if (hit) return hit
      }
      return null
    }
    const readme = findReadme(root)
    if (readme) void openFile(readme.path, readme.name)
  }, [root])

  const active = openTabs.find((t) => t.path === activePath) || openTabs[0] || null
  const lines = useMemo(() => (active ? splitLines(active.content) : ["Open a file from the Explorer."]), [active])

  const closeTab = (pathStr: string) => {
    setOpenTabs((prev) => prev.filter((t) => t.path !== pathStr))
    if (activePath === pathStr) {
      const remaining = openTabs.filter((t) => t.path !== pathStr)
      setActivePath(remaining[remaining.length - 1]?.path || "")
    }
  }

  return (
    <div className={`h-full w-full ${theme.bg} ${theme.text} flex flex-col`}>
      <div className="flex-1 min-h-0 flex">
        {/* Activity Bar */}
        <div className={`w-12 ${theme.activity} border-r ${theme.border} flex flex-col items-center py-2 gap-4`}>
          <div className="w-full flex justify-center py-2 border-l-2 border-blue-500">
            <Files className={`w-5 h-5 ${theme.iconPrimary}`} />
          </div>
          <Search className={`w-5 h-5 ${theme.iconMuted}`} />
          <div className="relative">
            <GitBranch className={`w-5 h-5 ${theme.iconMuted}`} />
            {/* badge mimic */}
            <span className="absolute -top-2 -right-2 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-[#007acc] text-white">
              1
            </span>
          </div>
          <Bug className={`w-5 h-5 ${theme.iconMuted}`} />
          <Play className={`w-5 h-5 ${theme.iconMuted}`} />
          <div className="flex-1" />
          <Puzzle className={`w-5 h-5 ${theme.iconMuted} mb-2`} />
        </div>

        {/* Explorer */}
        <div className={`w-80 ${theme.sidebar} border-r ${theme.border} flex flex-col min-w-0`}>
          <div className={`h-9 flex items-center px-3 border-b ${theme.border}`}>
            <div className={`text-[11px] font-mono ${theme.explorerHeader} tracking-wide`}>EXPLORER</div>
            <div className="flex-1" />
            <div className={`text-[11px] font-mono ${theme.explorerHeader}`}>…</div>
          </div>
          <div className="px-3 py-2">
            <div className={`text-[11px] font-mono ${theme.explorerSection} mb-2 tracking-wide`}>MACOS-PORTFOLIO</div>
          </div>
          <div className="flex-1 overflow-auto pb-4">
            {root ? (
              <TreeView
                node={root}
                depth={0}
                onOpenFile={openFile}
                isDarkMode={isDarkMode}
                hoverClass={theme.hover}
                fileTextClass={theme.treeText}
                metaTextClass={theme.treeMeta}
                selectedPath={active?.path || ""}
              />
            ) : (
              <div className={`px-3 text-xs ${theme.subtle}`}>{status}</div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className={`flex-1 flex flex-col min-w-0 ${theme.editor}`}>
            {/* Tabs */}
            <div className={`h-9 ${theme.tabbar} border-b ${theme.border} flex items-end overflow-x-auto`}>
          {openTabs.length === 0 ? (
            <div className={`px-4 h-9 flex items-center text-xs ${theme.subtle}`}>No file open</div>
          ) : (
            openTabs.map((t) => {
              const isActive = t.path === activePath
              return (
                <div
                  key={t.path}
                  className={`h-9 flex items-center gap-2 px-3 border-r ${theme.border} cursor-pointer whitespace-nowrap ${
                    isActive ? theme.tabActive : theme.tabInactive
                  }`}
                  onClick={() => setActivePath(t.path)}
                >
                  <span className={`text-[10px] font-mono ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>{fileIcon(t.name)}</span>
                  <span className={`text-xs font-mono ${isDarkMode ? "text-white/85" : "text-gray-800"}`}>{t.name}</span>
                  <button
                    className={`${isDarkMode ? "text-white/50 hover:text-white/80" : "text-gray-500 hover:text-gray-800"} px-1`}
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(t.path)
                    }}
                    aria-label={`Close ${t.name}`}
                  >
                    ×
                  </button>
                </div>
              )
            })
          )}
            </div>

            {/* Breadcrumbs */}
            <div className={`h-7 border-b ${theme.border} flex items-center px-3 text-[11px] font-mono ${theme.subtle}`}>
              {active ? (
                <span className="truncate">
                  {active.path.split("/").join("  ›  ")}
                </span>
              ) : (
                <span>Ready</span>
              )}
            </div>

        {/* Editor content */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[700px]">
            <div className="grid" style={{ gridTemplateColumns: "56px 1fr" }}>
              <div className={`border-r ${theme.border} ${isDarkMode ? "bg-black/10" : "bg-gray-50"}`}>
                {lines.map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 flex items-center justify-end pr-3 text-xs font-mono ${isDarkMode ? "text-white/40" : "text-gray-400"}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div>
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className={`h-6 flex items-center px-3 font-mono text-sm ${isDarkMode ? "text-white/90" : "text-gray-900"} whitespace-pre`}
                  >
                    {line === "" ? " " : line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
            {/* Bottom panel tabs (mock) */}
            <div className={`h-9 ${theme.tabbar} border-t ${theme.border} flex items-center px-3 gap-4 text-xs font-mono ${theme.subtle}`}>
              <div className={`flex items-center gap-2 ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>
                <PanelBottom className="w-4 h-4" />
                <span>TERMINAL</span>
              </div>
              <span>PROBLEMS</span>
              <span>OUTPUT</span>
              <span>DEBUG CONSOLE</span>
            </div>
        </div>
      </div>

      {/* Status bar */}
      <div className={`h-6 ${theme.statusbar} text-white/90 flex items-center justify-between px-3 text-[11px] font-mono`}>
        <div className="truncate">{status || (active ? active.path : "Ready")}</div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>LF</span>
          <span>{active?.name?.split(".").pop()?.toUpperCase() || ""}</span>
        </div>
      </div>
    </div>
  )
}
