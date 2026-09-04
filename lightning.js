const selectedSpeakers = [
  { name: "待填入講者 01", topic: "講題待公布" },
  { name: "待填入講者 02", topic: "講題待公布" },
  { name: "待填入講者 03", topic: "講題待公布" },
  { name: "待填入講者 04", topic: "講題待公布" },
  { name: "待填入講者 05", topic: "講題待公布" },
  { name: "待填入講者 06", topic: "講題待公布" },
  { name: "待填入講者 07", topic: "講題待公布" },
  { name: "待填入講者 08", topic: "講題待公布" },
  { name: "待填入講者 09", topic: "講題待公布" },
  { name: "待填入講者 10", topic: "講題待公布" },
];

const standbySpeakers = [
  { name: "待填入候補 01", topic: "講題待公布" },
  { name: "待填入候補 02", topic: "講題待公布" },
];

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
  setupLightningAnimations();
}

document.addEventListener("DOMContentLoaded", initLightningRoster);
