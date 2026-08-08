import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export async function ensureChatSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS onda_chat_messages (
      id BIGSERIAL PRIMARY KEY,
      user_key TEXT NOT NULL,
      persona TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user','assistant')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_onda_chat_user_persona_time
    ON onda_chat_messages (user_key, persona, created_at DESC)
  `;
}

export async function saveMessage(userKey: string, persona: string, role: "user" | "assistant", content: string) {
  const sql = getSql();
  await ensureChatSchema();
  await sql`
    INSERT INTO onda_chat_messages (user_key, persona, role, content)
    VALUES (${userKey}, ${persona}, ${role}, ${content})
  `;
}

export async function loadMessages(userKey: string, persona: string, limit = 40) {
  const sql = getSql();
  await ensureChatSchema();
  const rows = await sql`
    SELECT role, content, created_at
    FROM onda_chat_messages
    WHERE user_key = ${userKey} AND persona = ${persona}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.reverse();
}
