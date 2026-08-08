"use client";

import { FormEvent, useEffect, useState } from "react";
import { PERSONAS, PersonaKey } from "@/lib/personas";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatClient({ persona }: { persona: PersonaKey }) {
  const meta = PERSONAS[persona];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/chat?persona=${persona}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]));
  }, [persona]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, message: text }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "답변을 가져오지 못했습니다." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="chat-shell">
      <header className="chat-head">
        <div>
          <p className="eyebrow">ON:DA CHAT · HUMAN PERSONA</p>
          <h1>{meta.name}</h1>
          <p>{meta.role}</p>
        </div>
        <a href="https://1001careerdirector.github.io/ONDA.LAB/#member">멤버 페이지로</a>
      </header>

      <section className="chat-log" aria-live="polite">
        {messages.length === 0 && <div className="message assistant">{meta.greeting}</div>}
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>{message.content}</div>
        ))}
        {busy && <div className="message assistant pending">생각을 정리하고 있습니다…</div>}
      </section>

      <form className="chat-form" onSubmit={submit}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={`${meta.name}에게 이야기해 보세요.`} maxLength={6000} />
        <button type="submit" disabled={busy || !input.trim()}>보내기</button>
      </form>
      <p className="ai-note">이 대화는 {meta.name}의 관점과 역할을 반영한 AI 챗봇입니다. 실제 사람의 실시간 답변이 아닙니다.</p>
    </main>
  );
}
