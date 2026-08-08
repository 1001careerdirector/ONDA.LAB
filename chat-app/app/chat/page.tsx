import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ChatClient from "./chat-client";
import { isPersona } from "@/lib/personas";

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ persona?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const persona = isPersona(params.persona) ? params.persona : "onda";

  if (!session?.user) {
    redirect(`/auth/start?provider=google&persona=${persona}`);
  }

  return <ChatClient persona={persona} />;
}
