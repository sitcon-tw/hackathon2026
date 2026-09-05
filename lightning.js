const selectedSpeakers = [
  { name: "孫靖崴 / sujiwi", topic: "methmetica 專案...的吉祥物和 Logo 介紹。" },
  { name: "微崩", topic: "擁有一個微縮世界的夢想" },
  { name: "Aidan", topic: "我以為在養 AI Agent，結果在養一群超鳥實習生" },
  { name: "Steve", topic: "Ai 離彼此的生活有多近？" },
  { name: "Warren", topic: "開發製作多專案管理環境工具" },
  { name: "Richard", topic: "全世界 GPU 都台灣做的，AI 也可以是！" },
  { name: "Zanna", topic: "新加坡 Ai 開發者的生存手札" },
  { name: "陳羿瑄", topic: "ai 影片" },
];

const standbySpeakers = [];

function escapeLightningText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSpeakers(containerId, speakers, label) {
  const container = document.querySelector(containerId);
  if (!speakers.length) {
    container.innerHTML = '<div class="results-empty"><strong>候補名單待公布</strong><p>候補講者與順位確認後將於此更新。</p></div>';
    return;
  }

  container.innerHTML = speakers
    .map(
      (speaker, index) => `
        <article class="ranking-card">
          <b>${String(index + 1).padStart(2, "0")}</b>
          <div><small>${escapeLightningText(speaker.topic)}</small><h3>${escapeLightningText(speaker.name)}</h3></div>
          <span>${label}</span>
        </article>`,
    )
    .join("");
}

function setupLightningAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.anime?.animate) return;
  const { animate, stagger } = window.anime;

  animate(".results-hero > div:not(.hero-grid)", {
    opacity: { from: 0 },
    y: { from: 24 },
    delay: stagger(90),
    duration: 720,
    ease: "out(4)",
  });

  animate(".hero-grid", {
    backgroundPositionX: "54px",
    backgroundPositionY: "54px",
    duration: 16000,
    loop: true,
    ease: "linear",
  });

  animate(".results-status i", {
    scale: [1, 1.7],
    opacity: [1, 0.5],
    duration: 900,
    loop: true,
    alternate: true,
    ease: "inOut(3)",
  });

  animate(".ranking-card", {
    opacity: { from: 0 },
    y: { from: 18 },
    delay: stagger(55, { start: 280 }),
    duration: 520,
    ease: "out(3)",
  });
}

function initLightningRoster() {
  renderSpeakers("#speaker-list", selectedSpeakers, "入選");
  renderSpeakers("#standby-list", standbySpeakers, "候補");
  document.querySelector("#speaker-count").textContent = `${selectedSpeakers.length} / 10 位`;
  document.querySelector("#standby-count").textContent = `${standbySpeakers.length} 位`;
  document.querySelector("#lightning-status").textContent = `已公布 ${selectedSpeakers.length} 位講者`;
  setupLightningAnimations();
}

document.addEventListener("DOMContentLoaded", initLightningRoster);
