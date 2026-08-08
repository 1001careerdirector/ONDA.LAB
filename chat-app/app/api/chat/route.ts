import OpenAI from "openai";
import { auth } from "@/auth";
import { isPersona, PERSONAS } from "@/lib/personas";
import { loadMessages, saveMessage } from "@/lib/db";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getUserKey(session: Awaited<ReturnType<typeof auth>>) {
  const user = session?.user as (typeof session.user & { id?: string }) | undefined;
  return user?.email || user?.id || null;
}

export async function GET(request: Request) {
  const session = await auth();
  const userKey = getUserKey(session);
  if (!userKey) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona");
  if (!isPersona(persona)) return Response.json({ error: "invalid persona" }, { status: 400 });

  const messages = await loadMessages(userKey, persona);
  return Response.json({ messages });
}

export async function POST(request: Request) {
  const session = await auth();
  const userKey = getUserKey(session);
  if (!userKey) return Response.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const persona = String(body.persona || "");
  const message = String(body.message || "").trim();
  if (!isPersona(persona) || !message) return Response.json({ error: "invalid request" }, { status: 400 });
  if (message.length > 6000) return Response.json({ error: "message too long" }, { status: 400 });

  await saveMessage(userKey, persona, "user", message);
  const history = await loadMessages(userKey, persona, 24);

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5",
    instructions: `${PERSONAS[persona].system}\n\n항상 한국어를 기본으로 답하고, 사용자가 다른 언어를 요청하면 그 언어를 사용하세요. 개인정보나 인증정보를 요구하지 마세요.`,
    input: history.map((item) => ({
      role: item.role as "user" | "assistant",
      content: String(item.content),
    })),
  });

  const reply = response.output_text?.trim() || "답변을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.";
  await saveMessage(userKey, persona, "assistant", reply);
  return Response.json({ reply });
}
