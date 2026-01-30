import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export const runtime = "nodejs"

type TreeNode = {
  name: string
  path: string
  kind: "file" | "folder"
  children?: TreeNode[]
}

const ROOT = process.cwd()
const EXCLUDE_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build"])
const MAX_DEPTH = 5
const MAX_CHILDREN_PER_DIR = 200

async function safeStat(fullPath: string) {
  try {
    return await fs.stat(fullPath)
  } catch {
    return null
  }
}

async function readDirSafe(fullPath: string) {
  try {
    return await fs.readdir(fullPath, { withFileTypes: true })
  } catch {
    return []
  }
}

function isInsideRoot(candidate: string) {
  const rel = path.relative(ROOT, candidate)
  // rel === "" means candidate === ROOT (allowed)
  return !rel.startsWith("..") && !path.isAbsolute(rel)
}

async function buildTree(relDir: string, depth: number): Promise<TreeNode | null> {
  const fullDir = path.join(ROOT, relDir)
  if (!isInsideRoot(fullDir)) return null

  const st = await safeStat(fullDir)
  if (!st || !st.isDirectory()) return null

  const baseName = relDir === "" ? path.basename(ROOT) : path.basename(fullDir)
  const node: TreeNode = { name: baseName, path: relDir || "", kind: "folder", children: [] }

  if (depth >= MAX_DEPTH) return node

  const entries = await readDirSafe(fullDir)
  const visible = entries
    .filter((e) => !e.name.startsWith("."))
    .filter((e) => !(e.isDirectory() && EXCLUDE_DIRS.has(e.name)))
    .slice(0, MAX_CHILDREN_PER_DIR)

  // Sort folders first, then files; alpha within each group.
  visible.sort((a, b) => {
    const ad = a.isDirectory()
    const bd = b.isDirectory()
    if (ad !== bd) return ad ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  for (const entry of visible) {
    const childRel = relDir ? path.join(relDir, entry.name) : entry.name
    if (entry.isDirectory()) {
      const child = await buildTree(childRel, depth + 1)
      if (child) node.children?.push(child)
    } else if (entry.isFile()) {
      node.children?.push({ name: entry.name, path: childRel, kind: "file" })
    }
  }

  return node
}

export async function GET() {
  const tree = await buildTree("", 0)
  return NextResponse.json({ root: tree }, { headers: { "Cache-Control": "no-store" } })
}

