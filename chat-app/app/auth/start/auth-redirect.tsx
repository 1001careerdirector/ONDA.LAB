"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthRedirect({ provider, persona }: { provider: string; persona: string }) {
  const [status, setStatus] = useState("로그인 화면으로 이동 중입니다…");

  useEffect(() => {
    signIn(provider, { redirectTo: `/chat?persona=${persona}` }).catch(() => {
      setStatus("로그인 연결에 실패했습니다. 다시 시도해 주세요.");
    });
  }, [provider, persona]);

  return (
    <main className="center-page">
      <div className="status-card">
        <p className="eyebrow">ON:DA CHAT</p>
        <h1>{status}</h1>
        <p>선택한 계정으로 인증한 뒤 대화 화면으로 돌아옵니다.</p>
      </div>
    </main>
  );
}
