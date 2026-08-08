# ON:DA Chat V0.1

Human Member 카드에서 소셜 로그인 후 `온다 / 온결 / 백일몽` 페르소나와 1:1 대화하는 서버 앱입니다.

## 포함 기능
- Google / Kakao / Naver OAuth 로그인
- 선택한 Human Persona 유지
- OpenAI Responses API 기반 대화
- 로그인 사용자 + Persona 기준 대화기록 저장
- Human Persona 기반 AI임을 화면에 명시

## 환경변수
`.env.example`을 기준으로 배포 환경에 값을 등록합니다.

필수:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `DATABASE_URL`

선택:
- `OPENAI_MODEL` (기본값 `gpt-5`)

## OAuth callback URL
배포 호스트가 `https://chat.example.com`이라면 각 플랫폼 콘솔에 다음 callback을 등록합니다.

- Google: `https://chat.example.com/api/auth/callback/google`
- Kakao: `https://chat.example.com/api/auth/callback/kakao`
- Naver: `https://chat.example.com/api/auth/callback/naver`

## ON:DA.LAB 연결
배포가 끝나면 루트의 `chat-config.js`에서 `baseUrl`을 실제 Chat 앱 주소로 설정합니다.

```js
window.ONDA_CHAT_AUTH = Object.freeze({
  baseUrl: "https://chat.example.com",
});
```

GitHub Pages에는 OAuth client secret, OpenAI API key, DB 접속 문자열을 저장하지 않습니다.
