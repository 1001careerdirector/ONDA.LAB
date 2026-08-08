# ON:DA.LAB Human Member 1:1 Chat — Auth 연결 계약

## 현재 프런트 동작

Human Members의 `온다`, `온결`, `백일몽` 카드에 `1:1 대화하기` 버튼이 표시됩니다.

버튼을 누르면 Google / Kakao / Naver 중 하나를 선택하고, 아래 공개 인증 엔드포인트로 이동합니다.

```text
GET {baseUrl}/auth/start?provider={google|kakao|naver}&persona={onda|ongyeol|baegilmong}&returnTo={url}
```

`chat-config.js`의 `baseUrl`에는 **공개 인증 서버 주소만** 넣습니다.

```js
window.ONDA_CHAT_AUTH = Object.freeze({
  baseUrl: "https://YOUR-AUTH-SERVER.example.com",
});
```

## 서버가 해야 할 일

1. `provider`와 `persona`를 서버 세션/state에 저장합니다.
2. 선택한 로그인 제공자의 OAuth/OIDC 인증 화면으로 리다이렉트합니다.
3. 등록된 callback URI에서 authorization code를 받습니다.
4. 서버에서 code를 token으로 교환하고 사용자 식별 정보를 검증합니다.
5. ON:DA 챗봇용 로그인 세션을 발급합니다.
6. 아래처럼 persona를 유지한 채 챗봇으로 리다이렉트합니다.

```text
https://YOUR-CHAT.example.com/?persona=onda
https://YOUR-CHAT.example.com/?persona=ongyeol
https://YOUR-CHAT.example.com/?persona=baegilmong
```

## 보안 원칙

- Google/Kakao/Naver client secret, AI API key, 세션 서명키는 GitHub Pages 저장소에 넣지 않습니다.
- OAuth `state`를 검증하고 callback URI는 각 제공자 콘솔에 정확히 등록합니다.
- 공개 저장소의 `chat-config.js`에는 secret이 아닌 공개 base URL만 둡니다.
- 챗봇은 인증 완료된 서버 세션을 기준으로 접근을 허용합니다.

## Persona 계약

| 화면 멤버 | persona 값 | 챗봇 역할 |
|---|---|---|
| 온다 | `onda` | 강사 · 연구자 |
| 온결 | `ongyeol` | 작가 · 기록자 |
| 백일몽 | `baegilmong` | 1인기업가 · 기획자 |
