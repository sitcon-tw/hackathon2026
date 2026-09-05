const finalistTeams = [
  // { id: "T001", name: "隊伍名稱", track: "01" },
];

const waitlistTeams = [
  // { id: "T011", name: "隊伍名稱", track: "03" },
];

const track4Teams = [
  // 請依上台順序填入；此順序不代表排名。
  // { id: "T001", name: "隊伍名稱", track: "04" },
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
          <div><small>${escapeResultText(team.id)}</small><h3>${escapeResultText(team.name)}</h3></div>
          <span>賽道 ${escapeResultText(team.track)}</span>
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
  renderRanking("#finalist-list", finalistTeams, "第一輪評選完成後公布前 10 名隊伍。");
  renderRanking("#track04-list", track4Teams, "Track04 科幻協會賽道評選完成後公布前 8 名隊伍。");
  renderRanking("#waitlist-list", waitlistTeams, "候補隊伍與順序將於評選完成後公布。");
  document.querySelector("#finalist-count").textContent = `${finalistTeams.length} / 10 隊`;
  document.querySelector("#track04-count").textContent = `${track4Teams.length} / 8 隊`;
  document.querySelector("#waitlist-count").textContent = `${waitlistTeams.length} 隊`;
  if (finalistTeams.length || track4Teams.length) document.querySelector("#results-status").textContent = "名單已公布";
  setupResultAnimations();
}

document.addEventListener("DOMContentLoaded", initResults);
