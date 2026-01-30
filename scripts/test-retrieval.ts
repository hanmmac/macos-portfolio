import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const EMBEDDING_MODEL = "text-embedding-3-small";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !openaiKey) {
  console.error("Missing env vars. Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
const openai = new OpenAI({ apiKey: openaiKey });

async function embed(text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  const vec = resp.data[0].embedding;

  if (vec.length !== 1536) {
    throw new Error(`Embedding dim mismatch: got ${vec.length}, expected 1536`);
  }
  return vec;
}

async function main() {
  const query = process.argv.slice(2).join(" ").trim() || "Is Hannah interested in Product Manager roles?";
  console.log("Query:", query);

  const queryEmbedding = await embed(query);

  // Call your Supabase SQL function
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 8,
  });

  if (error) {
    console.error("RPC error:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No results returned. (Did ingestion run? Does documents table have rows?)");
    process.exit(0);
  }

  console.log("\nTop matches:\n");
  data.forEach((row: any, i: number) => {
    const title = row.section_title ?? "(no title)";
    const src = row.source_file ?? "(no file)";
    const dtype = row.doc_type ?? "(no type)";
    const sim = typeof row.similarity === "number" ? row.similarity.toFixed(3) : row.similarity;

    console.log(`${i + 1}. [${dtype}] ${src} — ${title} (similarity: ${sim})`);
    console.log(row.content.slice(0, 240).replace(/\s+/g, " ").trim() + (row.content.length > 240 ? "…" : ""));
    console.log();
  });
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});