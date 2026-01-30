// Ingestion script for RAG chatbot knowledge base
// This script will read markdown files from the knowledge/ folder,
// chunk them, generate embeddings, and store them in Supabase

// scripts/ingest-knowledge.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

/**
 * CONFIG
 */
const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");

// IMPORTANT: This must match your Supabase column type: vector(1536)
// If you created vector(1536), use an embeddings model that returns 1536 dims.
const EMBEDDING_MODEL = "text-embedding-3-small";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !openaiKey) {
  console.error(
    "Missing env vars. Please set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
const openai = new OpenAI({ apiKey: openaiKey });

/**
 * Priority: keep skills lower than projects
 */
const PRIORITY_BY_TYPE: Record<string, number> = {
  projects: 1.0,
  experience: 0.9,
  faq: 0.85,
  about: 0.7,
  skills: 0.4,
  contact: 0.3,
  bot_identity: 0.2,
  other: 0.5,
};

function inferDocType(filename: string) {
  const base = filename.replace(/\.md$/i, "").toLowerCase();
  if (base.includes("project")) return "projects";
  if (base.includes("experience")) return "experience";
  if (base.includes("faq")) return "faq";
  if (base.includes("about")) return "about";
  if (base.includes("skill")) return "skills";
  if (base.includes("contact")) return "contact";
  if (base.includes("bot_identity") || base.includes("bot-identity")) return "bot_identity";
  return "other";
}

/**
 * Chunking: split by headings (## / ### / ####).
 * We keep "title + body" in the chunk so it stands alone.
 */
type Chunk = {
  content: string;
  section_title: string | null;
  parent_title: string | null; // parent H2 title (for projects.md sections)
  chunk_index: number;
  total_chunks: number;
};

function chunkMarkdownByHeadings(md: string): Chunk[] {
  const lines = md.split(/\r?\n/);

  // Collect sections keyed by headings.
  type Section = {
    title: string | null;
    level: number;
    body: string[];
    parentTitle: string | null;
  };
  const sections: Section[] = [];

  let current: Section = { title: null, level: 0, body: [], parentTitle: null };
  let parentH2: string | null = null; // Track the most recent H2 heading

  const headingRegex = /^(#{2,4})\s+(.+?)\s*$/; // ## to ####
  for (const line of lines) {
    const m = line.match(headingRegex);
    if (m) {
      const level = m[1].length;
      const title = m[2].trim();

      // flush previous
      if (current.title !== null || current.body.join("\n").trim().length > 0) {
        sections.push(current);
      }

      // Update parent H2 when we encounter a new H2
      if (level === 2) {
        parentH2 = title;
        current = { title, level, body: [], parentTitle: null };
      } else {
        // For H3/H4, use the current parent H2
        current = { title, level, body: [], parentTitle: parentH2 };
      }
    } else {
      current.body.push(line);
    }
  }
  // flush last
  if (current.title !== null || current.body.join("\n").trim().length > 0) {
    sections.push(current);
  }

  // Convert sections to chunks (and sub-chunk if a section is huge).
  const rawChunks: { title: string | null; text: string; parent_title: string | null }[] = [];
  for (const s of sections) {
    const body = s.body.join("\n").trim();

    // Build the title line with parent context for H3/H4
    let titleLine = "";
    if (s.title) {
      if (s.level === 2) {
        // H2 sections: just the H2 heading
        titleLine = `## ${s.title}\n`;
      } else if (s.level >= 3 && s.parentTitle) {
        // H3/H4 sections: include parent H2 + current heading
        titleLine = `## ${s.parentTitle}\n${"#".repeat(s.level)} ${s.title}\n`;
      } else {
        // Fallback: just the heading itself
        titleLine = `${"#".repeat(s.level)} ${s.title}\n`;
      }
    }

    const full = `${titleLine}${body}`.trim();
    if (!full) continue;

    // If very long, sub-chunk to keep retrieval clean.
    const MAX_CHARS = 2200;
    if (full.length <= MAX_CHARS) {
      rawChunks.push({ title: s.title, text: full, parent_title: s.parentTitle ?? null });
    } else {
      // sub-chunk by paragraphs
      const paras = full.split(/\n{2,}/);
      let buf = "";
      let part = 1;
      for (const p of paras) {
        if ((buf + "\n\n" + p).length > MAX_CHARS) {
          rawChunks.push({
            title: s.title ? `${s.title} (part ${part})` : `part ${part}`,
            text: buf.trim(),
            parent_title: s.parentTitle ?? null,
          });
          buf = p;
          part += 1;
        } else {
          buf = buf ? `${buf}\n\n${p}` : p;
        }
      }
      if (buf.trim()) {
        rawChunks.push({
          title: s.title ? `${s.title} (part ${part})` : `part ${part}`,
          text: buf.trim(),
          parent_title: s.parentTitle ?? null,
        });
      }
    }
  }

  const total = rawChunks.length;
  return rawChunks.map((c, i) => ({
    content: c.text,
    section_title: c.title,
    parent_title: c.parent_title ?? null,
    chunk_index: i,
    total_chunks: total,
  }));
}

/**
 * Embeddings call
 */
async function embed(text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  const vec = resp.data[0].embedding;

  // Basic safety check against schema mismatch
  if (vec.length !== 1536) {
    throw new Error(
      `Embedding dimension mismatch: got ${vec.length}, expected 1536. ` +
        `Update your Supabase vector dimension OR change embedding model.`
    );
  }

  return vec;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * MAIN
 */
async function main() {
  const args = new Set(process.argv.slice(2));
  const shouldReset = args.has("--reset");
  const dryRun = args.has("--dry-run");

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`Missing folder: ${KNOWLEDGE_DIR}. Create /knowledge at repo root.`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error("No .md files found in /knowledge.");
    process.exit(1);
  }

  console.log(`Found ${files.length} knowledge files in /knowledge`);
  console.log(`Mode: ${dryRun ? "DRY RUN (no DB writes)" : "LIVE INSERT"}`);
  console.log(`Reset per file: ${shouldReset ? "YES" : "NO"}`);

  for (const file of files) {
    const fullPath = path.join(KNOWLEDGE_DIR, file);
    const md = fs.readFileSync(fullPath, "utf8");

    const doc_type = inferDocType(file);
    const priority = PRIORITY_BY_TYPE[doc_type] ?? PRIORITY_BY_TYPE.other;

    const chunks = chunkMarkdownByHeadings(md);

    console.log(`\n→ ${file} (${doc_type}, priority ${priority}) => ${chunks.length} chunks`);

    if (shouldReset && !dryRun) {
      const { error: delErr } = await supabase.from("documents").delete().eq("source_file", file);

      if (delErr) {
        console.error(`  ✗ Failed to reset existing rows for ${file}:`, delErr);
        process.exit(1);
      } else {
        console.log(`  ✓ Reset existing rows for ${file}`);
      }
    }

    // Insert chunks with embeddings
    for (const c of chunks) {
      const content = c.content.trim();
      if (!content) continue;

      if (dryRun) {
        console.log(
          `  [dry-run] chunk ${c.chunk_index + 1}/${c.total_chunks}: ${c.section_title ?? "(no title)"}`
        );
        continue;
      }

      // Generate embedding (rate-limited gently)
      const embedding = await embed(content);

      // metadata: always store chunk indices; store project for projects.md
      const metadata: Record<string, any> = {
        chunk_index: c.chunk_index,
        total_chunks: c.total_chunks,
      };

      if (file.toLowerCase() === "projects.md" && c.parent_title) {
        metadata.project = c.parent_title;
      }

      const row = {
        content,
        embedding,
        source_file: file,
        section_title: c.section_title,
        url: null as string | null, // optional: fill later if you want deep links
        doc_type,
        priority,
        metadata,
      };

      const { error: insErr } = await supabase.from("documents").insert(row);
      if (insErr) {
        console.error(`  ✗ Insert failed for ${file} chunk ${c.chunk_index}:`, insErr);
        process.exit(1);
      }

      // Tiny pause to be nice to rate limits
      await sleep(80);
    }

    console.log(`  ✓ Finished ${file}`);
  }

  console.log("\nIngestion complete.");
  console.log("Next: we’ll test retrieval with a tiny query and then build /api/chat.");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});