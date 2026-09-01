const teamTrackIds = {
  "AI Agents & Automation": "01",
  "AI for Everyday Life": "02",
  "Future of Work": "03",
  "AI × Creative Technology": "04",
  "AI for Taiwan／Social Impact": "05",
  "BUILDMODE Open": "06",
  "AI x Creativity": "07",
};

let teams = [];
let teamsState = "loading";

function escapeTeamText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTeams() {
  const list = document.querySelector("#team-list");
  const count = document.querySelector("#team-count");
  const query = document.querySelector("#team-search").value.trim().toLocaleLowerCase("zh-Hant");
  const track = document.querySelector("#team-track").value;

  if (teamsState === "loading") {
    count.textContent = "名單載入中";
    list.innerHTML = `<div class="team-empty"><div><b>名單載入中</b><p>正在取得最新隊伍資料。</p></div></div>`;
    return;
  }

  if (teamsState === "error") {
    count.textContent = "名單載入失敗";
    list.innerHTML = `<div class="team-empty"><div><b>暫時無法載入名單</b><p>請重新整理頁面後再試一次。</p></div></div>`;
    return;
  }

  const filtered = teams.filter((team) => {
    const matchesQuery = `${team.id} ${team.name}`.toLocaleLowerCase("zh-Hant").includes(query);
    const matchesTrack = track === "all" || teamTrackIds[team.track] === track;
    return matchesQuery && matchesTrack;
  });

  count.textContent = `${filtered.length} / ${teams.length} 隊`;
  if (!filtered.length) {
    list.innerHTML = `<div class="team-empty"><div><b>查無隊伍</b><p>請調整搜尋內容或賽道條件。</p></div></div>`;
    return;
  }

  list.innerHTML = filtered
    .map((team) => {
      const trackId = teamTrackIds[team.track] || "—";
      return `
        <article class="team-card">
          <b class="team-id">${escapeTeamText(team.id)}</b>
          <h3>${escapeTeamText(team.name)}</h3>
          <span class="team-track"><b>${escapeTeamText(trackId)}</b>${escapeTeamText(team.track)}</span>
        </article>`;
    })
    .join("");
}

async function loadTeams() {
  try {
    const response = await fetch("teams.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Team data must be an array");

    teams = data;
    teamsState = "ready";
    document.querySelector("#teams-page-status").textContent = `${teams.length} 隊已載入`;
  } catch (error) {
    teamsState = "error";
    document.querySelector("#teams-page-status").textContent = "名單載入失敗";
    console.error("Unable to load team roster", error);
  }

  document.querySelector("#team-list").ariaBusy = "false";
  renderTeams();
}

function initTeamsPage() {
  document.querySelector("#team-search").addEventListener("input", renderTeams);
  document.querySelector("#team-track").addEventListener("change", renderTeams);
  renderTeams();
  loadTeams();
}

document.addEventListener("DOMContentLoaded", initTeamsPage);
