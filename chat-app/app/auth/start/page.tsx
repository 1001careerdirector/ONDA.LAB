"use client";

import { signIn } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const providers = ["google", "kakao", "naver"] as const;
const personas = ["onda", "ongyeol", "baegilmong"] as const;

export default function AuthStartPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState("로그인 화면으로 이동 중입니다…");
  const provider = useMemo(() => {
    const value = params.get("provider");
    return providers.includes(value as (typeof providers)[number]) ? value! : "google";
  }, [params]);
  const persona = useMemo(() => {
    const value = params.get("persona");
    return personas.includes(value as (typeof personas)[number]) ? value! : "onda";
  }, [params]);

  useEffect(() => {
    signIn(provider, { callbackUrl: `/chat?persona=${persona}` }).catch(() => {
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
