(() => {
  const personaMap = new Map([
    ["온다", "onda"],
    ["온결", "ongyeol"],
    ["백일몽", "baegilmong"],
  ]);

  const memberCards = Array.from(document.querySelectorAll(".human-card"));
  if (!memberCards.length) return;

  const dialog = document.createElement("div");
  dialog.className = "chat-auth-backdrop";
  dialog.hidden = true;
  dialog.innerHTML = `
    <section class="chat-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="chat-auth-title">
      <div class="chat-auth-head">
        <div>
          <p class="chat-auth-kicker">1:1 CONVERSATION</p>
          <h2 class="chat-auth-title" id="chat-auth-title">멤버와 대화하기</h2>
        </div>
        <button class="chat-auth-close" type="button" aria-label="닫기">×</button>
      </div>
      <p class="chat-auth-copy">사용할 계정으로 인증하면 선택한 멤버의 ON:DA 챗봇으로 연결됩니다.</p>
      <div class="chat-auth-providers" aria-label="로그인 방법 선택">
        <button class="chat-auth-provider" type="button" data-provider="google">Google 계정으로 계속</button>
        <button class="chat-auth-provider" type="button" data-provider="kakao">카카오 계정으로 계속</button>
        <button class="chat-auth-provider" type="button" data-provider="naver">네이버 계정으로 계속</button>
      </div>
      <p class="chat-auth-status" role="status" aria-live="polite"></p>
    </section>`;
  document.body.appendChild(dialog);

  const title = dialog.querySelector(".chat-auth-title");
  const status = dialog.querySelector(".chat-auth-status");
  const closeButton = dialog.querySelector(".chat-auth-close");
  let activePersona = "onda";
  let activeLabel = "온다";
  let opener = null;

  const getBaseUrl = () => String(window.ONDA_CHAT_AUTH?.baseUrl || "").trim().replace(/\/$/, "");

  const closeDialog = () => {
    dialog.hidden = true;
    document.body.classList.remove("chat-auth-open");
    status.textContent = "";
    if (opener) opener.focus();
  };

  const openDialog = (button, persona, label) => {
    opener = button;
    activePersona = persona;
    activeLabel = label;
    title.textContent = `${label}와 1:1 대화하기`;
    status.textContent = "";
    dialog.hidden = false;
    document.body.classList.add("chat-auth-open");
    closeButton.focus();
  };

  memberCards.forEach((card) => {
    const heading = card.querySelector(".human-card-copy h3");
    const copy = card.querySelector(".human-card-copy");
    if (!heading || !copy) return;

    const label = heading.textContent.trim();
    const persona = personaMap.get(label);
    if (!persona) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "human-chat-entry";
    button.textContent = "1:1 대화하기";
    button.setAttribute("aria-label", `${label}와 1:1 대화하기`);
    button.addEventListener("click", () => openDialog(button, persona, label));
    copy.appendChild(button);
  });

  dialog.querySelectorAll(".chat-auth-provider").forEach((button) => {
    button.addEventListener("click", () => {
      const provider = button.dataset.provider;
      const baseUrl = getBaseUrl();

      if (!baseUrl) {
        status.textContent = "인증 서버 주소가 아직 연결되지 않았습니다. chat-config.js의 baseUrl 설정 후 사용할 수 있습니다.";
        return;
      }

      const returnTo = `${window.location.origin}${window.location.pathname}#member`;
      const url = new URL(`${baseUrl}/auth/start`);
      url.searchParams.set("provider", provider);
      url.searchParams.set("persona", activePersona);
      url.searchParams.set("returnTo", returnTo);
      window.location.assign(url.toString());
    });
  });

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  document.addEventListener("keydown", (event) => {
    if (!dialog.hidden && event.key === "Escape") closeDialog();
  });
})();
