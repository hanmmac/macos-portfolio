import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export const runtime = "nodejs"

const ROOT = process.cwd()
const MAX_BYTES = 250_000 // keep UI snappy

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".css",
  ".txt",
  ".mjs",
  ".cjs",
  ".yml",
  ".yaml",
  ".toml",
  ".env",
  ".d.ts",
])

function isInsideRoot(candidate: string) {
  const rel = path.relative(ROOT, candidate)
  // rel === "" means candidate === ROOT (allowed)
  return !rel.startsWith("..") && !path.isAbsolute(rel)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const relPath = url.searchParams.get("path") || ""

  // Prevent weird inputs and traversal.
  if (!relPath || relPath.includes("\0")) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 })
  }

  const full = path.join(ROOT, relPath)
  if (!isInsideRoot(full)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  const ext = path.extname(full).toLowerCase()
  if (!TEXT_EXTENSIONS.has(ext) && path.basename(full) !== "README.md" && path.basename(full) !== "LICENSE" && path.basename(full) !== "NOTICE") {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 })
  }

  let st: Awaited<ReturnType<typeof fs.stat>>
  try {
    st = await fs.stat(full)
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!st.isFile()) return NextResponse.json({ error: "Not a file" }, { status: 400 })
  if (st.size > MAX_BYTES) return NextResponse.json({ error: "File too large" }, { status: 413 })

  try {
    const content = await fs.readFile(full, "utf8")
    return NextResponse.json(
      { path: relPath, content },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 })
  }
}

