const finalistTeams = [
  { id: "T198", name: "life house" },
  { id: "T201", name: "MCPocket", award: "第三名" },
  { id: "T092", name: "草莓舒芙蕾教宗" },
  { id: "T080", name: "阿鳥為" },
  { id: "T216", name: "OMG (1)" },
  { id: "T202", name: "MODEV", award: "第一名" },
  { id: "T259", name: "ZERooNEZEROZERO" },
  { id: "T161", name: "ChatKTV", award: "第二名" },
  { id: "T176", name: "Fulfill" },
  { id: "T232", name: "Safari" },
];

const track4Teams = [
  { id: "T130", name: "融慧貫通", entryType: "仿真人科幻故事", project: "人字旁" },
  { id: "T261", name: "AIIA", entryType: "科幻音樂MV", project: "ALIVE", award: "佳作" },
  { id: "T142", name: "體感溫度快熱死", entryType: "科幻音樂MV", project: "LUNA•下一個舞台", award: "佳作" },
  { id: "T265", name: "Auromake", entryType: "仿真人科幻故事", project: "愛。AI", award: "優選" },
  { id: "T227", name: "RhythME AI", entryType: "科幻音樂MV", project: "CSFCCA LIVE AI_T227" },
  { id: "T119", name: "詭像依依GXYY", entryType: "科幻仿真人", project: "戲偶", award: "優選" },
  { id: "T059", name: "有Token就好", entryType: "科幻卡通動畫", project: "最後100分鐘" },
  { id: "T092", name: "草莓舒芙蕾教宗", entryType: "科幻卡通動畫", project: "明天也會見到你嗎？", award: "優選" },
];

function escapeResultText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRanking(containerId, teams, emptyMessage) {
  const container = document.querySelector(containerId);
  if (!teams.length) {
    container.innerHTML = `<div class="results-empty"><strong>尚未公布</strong><p>${emptyMessage}</p></div>`;
    return;
  }

  container.innerHTML = teams
    .map(
      (team, index) => `
        <article class="ranking-card">
          <b>${String(index + 1).padStart(2, "0")}</b>
          <div>
            <small>${escapeResultText(team.id)}</small>
            <h3>${escapeResultText(team.name)}</h3>
            ${team.entryType ? `<p class="ranking-card-meta"><span>${escapeResultText(team.entryType)}</span><strong>${escapeResultText(team.project)}</strong></p>` : ""}
          </div>
          ${team.award ? `<span>${escapeResultText(team.award)}</span>` : ""}
        </article>`,
    )
    .join("");
}

function setupResultAnimations() {
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

  const cards = document.querySelectorAll(".ranking-card, .results-empty, .results-order-note");
  animate(cards, {
    opacity: { from: 0 },
    y: { from: 18 },
    delay: stagger(55, { start: 280 }),
    duration: 520,
    ease: "out(3)",
  });
}

function initResults() {
  renderRanking("#finalist-list", finalistTeams, "第一輪評選完成後公布總排名決賽 10 組。");
  renderRanking("#track04-list", track4Teams, "Track04 科幻協會賽道評選完成後公布決賽 8 組。");
  document.querySelector("#finalist-count").textContent = `${finalistTeams.length} / 10 組`;
  document.querySelector("#track04-count").textContent = `${track4Teams.length} / 8 隊`;
  if (finalistTeams.length || track4Teams.length) document.querySelector("#results-status").textContent = "名單及結果已公布";
  setupResultAnimations();
}

document.addEventListener("DOMContentLoaded", initResults);
