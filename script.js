const SITE_CONFIG = {
  timeZone: "Asia/Taipei",
  eventStart: "2026-09-04T09:00:00+08:00",
  eventEnd: "2026-09-06T16:45:00+08:00",
  actionRelease: "2026-09-05T09:00:00+08:00",
  teamChangeDeadline: "2026-09-04T16:30:00+08:00",
  links: {
    lightningTalk: "",
    submission: "",
    teamChange: "https://forms.gle/SpHnfC9MWNoPHJ2u6",
  },
};

let pageScroller = null;

const schedule = [
  {
    day: 1,
    date: "2026-09-04",
    dateLabel: "2026.09.04 星期五",
    label: "開幕／開發",
    items: [
      { start: "09:00", end: "09:30", title: "場地開放、參賽者進場", detail: "請準備票券與隊伍資訊，依現場分區入場。", tag: "報到" },
      { start: "09:30", end: "10:20", title: "入座與開發準備", detail: "請依隊伍座位區入座。", tag: "準備" },
      { start: "10:20", end: "10:30", title: "開幕前提醒", detail: "請全員入座並確認官方公告管道。", tag: "舞台" },
      { start: "10:30", end: "11:10", title: "開幕與賽制說明", detail: "說明三日賽制、賽道與贊助商獎項。", tag: "舞台" },
      { start: "11:10", end: "16:30", title: "開發時間", detail: "參賽者可自由進出開發區或參加 FUTUREMODE 議程。", tag: "開發" },
      { start: "16:30", end: "16:45", title: "隊伍與主題異動截止", detail: "16:30 後不再受理隊伍成員與參賽主題異動。", tag: "截止" },
      { start: "16:45", end: "17:00", title: "第一天公告與離場", detail: "場地於 17:00 關閉，不開放過夜。", tag: "離場" },
    ],
  },
  {
    day: 2,
    date: "2026-09-05",
    dateLabel: "2026.09.05 星期六",
    label: "開發／分享",
    items: [
      { start: "09:00", end: "10:30", title: "開發時間", detail: "閃電講報名同步開放，預計於 12:00 截止。", tag: "開發" },
      { start: "10:30", end: "12:00", title: "開發時間", detail: "持續開發作品。", tag: "開發" },
      { start: "12:00", end: "12:30", title: "閃電講報名截止與抽選", detail: "預計抽選 10 位講者與 2 位候補。", tag: "截止" },
      { start: "12:30", end: "15:50", title: "開發時間", detail: "持續開發作品。", tag: "開發" },
      { start: "15:50", end: "16:05", title: "閃電講講者報到", detail: "請入選講者至舞台報到。", tag: "報到" },
      { start: "16:05", end: "16:40", title: "閃電講", detail: "每位講者 2 分鐘，不開放延長。", tag: "現場" },
      { start: "16:40", end: "17:00", title: "第二天公告與離場", detail: "確認作品繳交規格、連結權限與第三天集合時間。", tag: "離場" },
    ],
  },
  {
    day: 3,
    date: "2026-09-06",
    dateLabel: "2026.09.06 星期日",
    label: "繳交／展示",
    items: [
      { start: "09:00", end: "09:50", title: "最後開發與作品繳交", detail: "作品於 10:00 截止，請自行確認格式與連結權限。", tag: "開發" },
      { start: "09:50", end: "10:00", title: "作品繳交截止", detail: "正式繳交表單於 10:00 關閉。", tag: "截止" },
      { start: "10:00", end: "14:10", title: "第一輪評選", detail: "依影片、程式碼與文件選出總排名前 10 名。", tag: "評選" },
      { start: "14:10", end: "14:30", title: "成績確認與決賽名單公布", detail: "公布總排名前 10 名隊伍。", tag: "結果" },
      { start: "14:30", end: "15:00", title: "AI × Creativity 特殊賽道展示", detail: "依特殊賽道獨立規則執行。", tag: "展示" },
      { start: "15:00", end: "15:50", title: "第二輪評選：總排名前 10 名", detail: "每隊 3 分鐘展示、1 分鐘提問、1 分鐘回答。", tag: "決賽" },
      { start: "15:50", end: "16:15", title: "評審討論與成績確認", detail: "評審完成總排名評選。", tag: "評選" },
      { start: "16:15", end: "16:45", title: "總排名頒獎與閉幕", detail: "公布總排名前三名，活動於 16:45 結束。", tag: "頒獎" },
    ],
  },
];

const resources = [
  {
    type: "MD · 2 KB",
    title: "作品 README 範本",
    description: "問題、架構、執行方式、素材來源與授權欄位。",
    url: "resources/README-template.md",
    download: true,
  },
  {
    type: "MD · 2 KB",
    title: "作品繳交檢查清單",
    description: "在截止前逐項確認程式碼、作品展示、影片與連結權限。",
    url: "resources/submission-checklist.md",
    download: true,
  },
  {
    type: "ATLAS · API",
    title: "Atlas API 使用指南",
    description: "完成帳號註冊、取得 API Key，開始串接 Pull API 與 WebSocket。",
    url: "atlas.html",
  },
  {
    type: "素材包 · Drive",
    title: "NOXCAT IP 素材",
    description: "AI × IP 遊戲創作素材包，角逐 NOXCAT 獎項時請依 IP 使用規範取用。",
    url: "https://drive.google.com/drive/folders/14TmeQ-zccUxyWfXm_-6SwVsmiVsIa0Xs?usp=sharing",
  },
  {
    type: "素材包 · Drive",
    title: "科幻協會素材",
    description: "AI 創作賽道素材包，含指定命題角色造型與創作資源。",
    url: "https://drive.google.com/drive/folders/1Dd7Ue-ecscLTgkeo0LYRIUGsVbCVd6BS?usp=sharing",
  },
  {
    type: "場地 PDF",
    title: "場地圖與座位分區",
    description: "最終隊伍編號與座位區確認後上架。",
    url: "https://images.squarespace-cdn.com/content/v1/698ac8797f3cb35b8bf437d6/ab3a3054-709b-4a01-87ea-bc950dd35c24/FM_MAP_DIGITALArtboard+2.jpg",
    download: true,
    mapPopup: true,
    mapFileName: "BUILDMODE_2026_venue_map.jpg",
  },
];

const judgingRounds = [
  {
    label: "Round 1 書審",
    chartId: "score-chart-round1",
    dark: false,
    criteria: [
      { name: "問題定義與影響力", value: 35, color: "#6978ff", details: ["是否解決真實問題", "使用者需求、價值與創新性是否清楚"] },
      { name: "技術實作", value: 30, color: "#d9ff43", details: ["架構與 AI 應用是否適切", "技術難度、完成度與穩定性"] },
      { name: "成果展示", value: 20, color: "#a9b2ff", details: ["是否呈現核心功能與使用情境", "影片內容是否清楚易懂"] },
      { name: "開源品質", value: 15, color: "#39405f", details: ["文件、程式碼可讀性與可重現性", "第三方來源與授權是否完整"] },
    ],
  },
  {
    label: "Round 2 Demo",
    chartId: "score-chart-round2",
    dark: true,
    criteria: [
      { name: "使用者價值", value: 30, color: "#d9ff43", details: ["是否解決明確需求", "價值與實際應用性是否清楚"] },
      { name: "使用體驗", value: 25, color: "#a9b2ff", details: ["操作是否直覺", "介面、回饋與易用性"] },
      { name: "成果展示", value: 20, color: "#6978ff", details: ["展示是否順利且情境清楚", "表達與回答問題的能力"] },
      { name: "產品成熟度", value: 15, color: "#858b82", details: ["功能完整度與系統穩定性", "實際落地的可行性"] },
      { name: "未來發展", value: 10, color: "#fffdf5", details: ["推廣、擴充與商業化潛力", "可能產生的社會影響"] },
    ],
  },
];

const specialActivityIndex = schedule.length;
let selectedDayIndex = getInitialDayIndex(Date.now());
let lastRenderedMinute = -1;
let lastKnownEventDay = getEventDayIndex(Date.now());

function parseEventTime(date, time) {
  return new Date(`${date}T${time}:00+08:00`).getTime();
}

function getInitialDayIndex(now) {
  const index = getEventDayIndex(now);

  if (index >= 0) return index;
  return now < parseEventTime(schedule[0].date, "00:00") ? 0 : schedule.length - 1;
}

function getEventDayIndex(now) {
  return schedule.findIndex((day) => {
    const dayStart = parseEventTime(day.date, "00:00");
    const nextDayStart = dayStart + 24 * 60 * 60 * 1000;
    return now >= dayStart && now < nextDayStart;
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderDayTabs() {
  const tabs = document.querySelector("#day-tabs");
  const todayIndex = getEventDayIndex(Date.now());
  const isEventDate = todayIndex >= 0;

  const dayTabs = schedule
    .map(
      (day, index) => `
        <button
          class="day-tab${isEventDate && todayIndex === index ? " is-today" : ""}"
          id="day-tab-${day.day}"
          type="button"
          role="tab"
          aria-selected="${selectedDayIndex === index}"
          aria-controls="timeline"
          tabindex="${selectedDayIndex === index ? "0" : "-1"}"
          data-day-index="${index}"
        >
          <b>0${day.day}</b>
          <span>9/${day.date.slice(-2)}<small>${escapeHTML(day.label)}</small></span>
          <i aria-hidden="true"></i>
        </button>`,
    )
    .join("");

  tabs.innerHTML = `${dayTabs}
    <button
      class="day-tab day-tab--special"
      id="special-activity-tab"
      type="button"
      role="tab"
      aria-selected="${selectedDayIndex === specialActivityIndex}"
      aria-controls="timeline"
      tabindex="${selectedDayIndex === specialActivityIndex ? "0" : "-1"}"
      data-day-index="${specialActivityIndex}"
    >
      <b>SP</b>
      <span>特別活動<small>Lightning Talk</small></span>
      <i aria-hidden="true"></i>
    </button>`;

  tabs.querySelectorAll(".day-tab").forEach((tab) => {
    tab.addEventListener("click", () => selectDay(Number(tab.dataset.dayIndex), true));
    tab.addEventListener("keydown", handleTabKeys);
  });
}

function handleTabKeys(event) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const tabCount = schedule.length + 1;
  let nextIndex = selectedDayIndex;
  if (event.key === "ArrowLeft") nextIndex = (selectedDayIndex + tabCount - 1) % tabCount;
  if (event.key === "ArrowRight") nextIndex = (selectedDayIndex + 1) % tabCount;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = tabCount - 1;
  selectDay(nextIndex, true);
}

function selectDay(index, focus = false) {
  selectedDayIndex = index;
  renderDayTabs();
  renderTimeline(Date.now());
  animateTimelineRows();
  if (focus) document.querySelector(`[data-day-index="${index}"]`)?.focus();
}

function renderTimeline(now) {
  const timeline = document.querySelector("#timeline");
  const statusbar = document.querySelector(".schedule-statusbar");
  const isSpecialActivity = selectedDayIndex === specialActivityIndex;
  statusbar.classList.toggle("is-special", isSpecialActivity);

  if (isSpecialActivity) {
    document.querySelector("#schedule-date").textContent = "SPECIAL ACTIVITY · LIGHTNING TALK";
    timeline.setAttribute("aria-labelledby", "special-activity-tab");
    timeline.innerHTML = `
      <article class="lightning-talk">
        <header>
          <span>SPECIAL ACTIVITY / DATA BLITZ</span>
          <h3>Lightning Talk <small>閃電秀</small></h3>
        </header>
        <p class="lightning-talk-lead">Lightning Talk，又稱 data blitz（資料閃電戰），是一場如閃電般短促、快速且精準的分享。講者必須用最快速度，把最重要的內容帶給全場。</p>
        <div class="lightning-talk-rules">
          <section>
            <b>02:00</b>
            <strong>兩分鐘硬性上限</strong>
            <p>包含準備與連接投影機的時間，每位講者總共只有 2 分鐘。</p>
          </section>
          <section>
            <b>HARD CUT</b>
            <strong>超時直接斷訊號</strong>
            <p>未能在 2 分鐘內結束，現場將直接切斷訊號，不提供延長。</p>
          </section>
          <section>
            <b>OPEN TOPIC</b>
            <strong>題目自由</strong>
            <p>技術、工具、經驗或任何想分享的內容都可以，想講什麼就講什麼。</p>
          </section>
        </div>
        <strong class="lightning-talk-callout">這是你的舞台。</strong>
      </article>`;
    return;
  }

  const day = schedule[selectedDayIndex];
  const items = day.items.map((item) => ({
    ...item,
    startAt: parseEventTime(day.date, item.start),
    endAt: parseEventTime(day.date, item.end),
  }));
  const nextIndex = items.findIndex((item) => item.startAt > now);
  document.querySelector("#schedule-date").textContent = day.dateLabel;
  timeline.setAttribute("aria-labelledby", `day-tab-${day.day}`);
  timeline.innerHTML = items
    .map((item, index) => {
      const isCurrent = now >= item.startAt && now < item.endAt;
      const isPast = now >= item.endAt;
      const isNext = !isCurrent && index === nextIndex;
      const stateClass = isCurrent ? " is-current" : isPast ? " is-past" : isNext ? " is-next" : "";
      return `
        <article class="timeline-item${stateClass}">
          <time class="timeline-time" datetime="${day.date}T${item.start}:00+08:00">
            ${item.start}<small>${item.end} 結束</small>
          </time>
          <div class="timeline-rail" aria-hidden="true"><i></i></div>
          <div class="timeline-copy">
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.detail)}</p>
          </div>
          ${isNext ? '<span class="timeline-tag">下一場</span>' : ""}
        </article>`;
    })
    .join("");
}

function renderResources() {
  document.querySelector("#resource-list").innerHTML = resources
    .map((resource) => {
      const available = Boolean(resource.url);
      if (resource.mapPopup) {
        return `
        <button
          type="button"
          class="resource-card venue-map-card-trigger"
          data-venue-map="${escapeHTML(resource.url)}"
          data-venue-map-title="${escapeHTML(resource.title)}"
          data-venue-map-download="${escapeHTML(resource.mapFileName)}"
          aria-label="${escapeHTML(resource.title)}（點擊展開）"
        >
          <div>
            <small>${escapeHTML(resource.type)} · ${available ? "可下載" : "待上架"}</small>
            <strong>${escapeHTML(resource.title)}</strong>
            <p>${escapeHTML(resource.description)}</p>
          </div>
          <span aria-hidden="true">${available ? "↗" : "··"}</span>
        </button>`;
      }
      return `
        <a
          class="resource-card"
          ${available ? `href="${escapeHTML(resource.url)}"` : 'aria-disabled="true"'}
          ${available && resource.download ? "download" : ""}
          ${available && /^https?:/i.test(resource.url) ? 'target="_blank" rel="noreferrer"' : ""}
        >
          <div>
            <small>${escapeHTML(resource.type)} · ${available ? (resource.download ? "可下載" : "前往查看") : "待上架"}</small>
            <strong>${escapeHTML(resource.title)}</strong>
            <p>${escapeHTML(resource.description)}</p>
          </div>
          <span aria-hidden="true">${available ? (resource.download ? "↓" : "→") : "··"}</span>
        </a>`;
    })
    .join("");
}

function setupMapPopup() {
  const dialog = document.querySelector("#venue-map-dialog");
  if (!dialog) return;

  const title = dialog.querySelector("#venue-map-dialog-title");
  const image = dialog.querySelector(".venue-map-dialog-image");
  const download = dialog.querySelector(".venue-map-dialog-download");
  const closeButton = dialog.querySelector("#venue-map-dialog-close");

  const openMapDialog = (url, titleText, fileName) => {
    if (!url) return;
    title.textContent = titleText || "場地圖與座位分區";
    image.src = url;
    image.alt = titleText || "場地圖與座位分區";
    download.href = url;
    download.download = fileName || "BUILDMODE_2026_venue_map.jpg";
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("venue-map-open");
  };

  document.querySelectorAll("[data-venue-map]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const mapUrl = trigger.dataset.venueMap;
      const mapTitle = trigger.dataset.venueMapTitle;
      const mapDownload = trigger.dataset.venueMapDownload;
      openMapDialog(mapUrl, mapTitle, mapDownload);
    });
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("venue-map-open");
    image.removeAttribute("src");
    image.alt = "";
  });
}

function updateActions(now) {
  const isReleased = now >= new Date(SITE_CONFIG.actionRelease).getTime();
  setActionState(
    document.querySelector("#lightning-action"),
    SITE_CONFIG.links.lightningTalk,
    isReleased,
    "前往投稿表單",
  );
  setActionState(
    document.querySelector("#submission-action"),
    SITE_CONFIG.links.submission,
    isReleased,
    "前往作品繳交",
  );
  const teamChangeDeadline = new Date(SITE_CONFIG.teamChangeDeadline).getTime();
  setActionState(
    document.querySelector("#team-change-action"),
    SITE_CONFIG.links.teamChange,
    now < teamChangeDeadline,
    "前往異動申請",
    now >= teamChangeDeadline ? "16:30 已截止" : "9/4 開放",
  );
}

function setActionState(element, url, isReleased, liveText, closedText = "9/5 開放") {
  const state = element.querySelector("[data-action-state]");
  if (isReleased && url) {
    element.href = url;
    element.target = "_blank";
    element.rel = "noreferrer";
    element.removeAttribute("aria-disabled");
    element.classList.add("is-live");
    state.textContent = liveText;
    return;
  }

  element.href = "#";
  element.removeAttribute("target");
  element.removeAttribute("rel");
  element.setAttribute("aria-disabled", "true");
  element.classList.remove("is-live");
  state.textContent = isReleased ? "連結待主辦補上" : closedText;
}

function updateClock() {
  const now = Date.now();
  const nowDate = new Date(now);
  const clock = document.querySelector("#taipei-clock");
  clock.dateTime = nowDate.toISOString();
  clock.textContent = new Intl.DateTimeFormat("zh-TW", {
    timeZone: SITE_CONFIG.timeZone,
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(nowDate);

  updateEventState(now);
  updateActions(now);

  const currentMinute = Math.floor(now / 60000);
  if (currentMinute !== lastRenderedMinute) {
    lastRenderedMinute = currentMinute;
    const currentEventDay = getEventDayIndex(now);
    if (currentEventDay >= 0 && currentEventDay !== lastKnownEventDay) {
      const restoreTabFocus = document.activeElement?.classList.contains("day-tab");
      selectedDayIndex = currentEventDay;
      renderDayTabs();
      if (restoreTabFocus) document.querySelector(`[data-day-index="${currentEventDay}"]`)?.focus();
    }
    lastKnownEventDay = currentEventDay;
    renderTimeline(now);
    updateNextEvent(now);
  }
}

function updateEventState(now) {
  const eventStart = new Date(SITE_CONFIG.eventStart).getTime();
  const eventEnd = new Date(SITE_CONFIG.eventEnd).getTime();
  const phase = document.querySelector("#event-phase");
  const label = document.querySelector(".countdown-label");
  let diff;

  if (now < eventStart) {
    diff = eventStart - now;
    phase.textContent = "活動尚未開始";
    label.textContent = "距離第一天開場";
  } else if (now < eventEnd) {
    const sessions = schedule.map((day) => ({
      day: day.day,
      start: parseEventTime(day.date, "09:00"),
      end: day.day === 3 ? eventEnd : parseEventTime(day.date, "17:00"),
    }));
    const activeSession = sessions.find((session) => now >= session.start && now < session.end);
    const nextSession = sessions.find((session) => session.start > now);

    if (activeSession) {
      diff = activeSession.end - now;
      phase.textContent = `第 ${activeSession.day} 天活動進行中`;
      label.textContent = `距離第 ${activeSession.day} 天場地關閉`;
    } else {
      diff = nextSession ? nextSession.start - now : eventEnd - now;
      phase.textContent = "場地已關閉";
      label.textContent = nextSession ? `距離第 ${nextSession.day} 天開場` : "距離活動結束";
    }
  } else {
    diff = 0;
    phase.textContent = "活動已結束";
    label.textContent = "活動已結束";
  }

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const values = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  Object.entries(values).forEach(([key, value]) => {
    const element = document.querySelector(`[data-count="${key}"]`);
    const nextValue = String(value).padStart(2, "0");
    if (element.textContent === nextValue) return;
    element.textContent = nextValue;
    if (key === "seconds" && animationsAvailable()) {
      window.anime.animate(element, {
        opacity: { from: 0.25 },
        y: { from: -8 },
        duration: 280,
        ease: "out(3)",
      });
    }
  });

  const progress = now <= eventStart ? 0 : now >= eventEnd ? 100 : ((now - eventStart) / (eventEnd - eventStart)) * 100;
  document.querySelector("#progress-value").textContent = `${Math.round(progress)}%`;
  document.querySelector("#progress-bar").style.width = `${progress}%`;
}

function updateNextEvent(now) {
  const allItems = schedule
    .flatMap((day) => day.items.map((item) => ({ ...item, day, startAt: parseEventTime(day.date, item.start) })))
    .sort((a, b) => a.startAt - b.startAt);
  const next = allItems.find((item) => item.startAt > now);
  const title = document.querySelector("#next-event");
  const time = document.querySelector("#next-event-time");

  if (!next) {
    title.textContent = "活動已結束";
    time.textContent = "--";
    return;
  }

  title.textContent = `第 ${next.day.day} 天 · ${next.title}`;
  time.textContent = `${next.day.date.slice(5).replace("-", "/")} ${next.start}`;
}

function getDocumentTop(element) {
  let top = 0;
  let current = element;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent;
  }
  return top;
}

function setupAnchorNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.('a[href^="#"]');
    const hash = link?.getAttribute("href");
    if (!hash || hash === "#" || link.getAttribute("aria-disabled") === "true") return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    const top = Math.max(0, getDocumentTop(target) - (document.querySelector("[data-header]")?.offsetHeight || 0));
    if (pageScroller) {
      pageScroller.scrollTo(top, {
        duration: 1.05,
        force: true,
        immediate: !animationsAvailable(),
      });
    } else {
      window.scrollTo({ top, behavior: animationsAvailable() ? "smooth" : "auto" });
    }

    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  });
}

function setupMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  const closeMenu = (restoreFocus = false) => {
    button.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    if (restoreFocus) button.focus();
  };

  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    if (!open) {
      closeMenu();
      return;
    }
    button.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    document.body.classList.add("menu-open");
    nav.querySelector("a")?.focus();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closeMenu(true);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [button, ...nav.querySelectorAll("a")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050 && nav.classList.contains("is-open")) closeMenu();
  });

  window.addEventListener("scroll", () => {
    document.querySelector("[data-header]").classList.toggle("is-scrolled", window.scrollY > 30);
  }, { passive: true });
}

function setupFaq() {
  document.querySelectorAll(".faq-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".faq-list details[open]").forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });
}

function setupDisabledLinks() {
  document.addEventListener("click", (event) => {
    const disabledLink = event.target.closest('a[aria-disabled="true"]');
    if (disabledLink) event.preventDefault();
  });
}

function setupScheduleNow() {
  const button = document.querySelector("#schedule-now");
  button.addEventListener("click", () => {
    selectDay(getInitialDayIndex(Date.now()));
    window.requestAnimationFrame(() => {
      const target = document.querySelector("#timeline .is-current, #timeline .is-next, #timeline .timeline-item:last-child");
      target?.scrollIntoView({ behavior: animationsAvailable() ? "smooth" : "auto", block: "center" });
    });
  });
}

function setupScoreCharts() {
  const charts = [];
  const dialog = document.querySelector("#score-explorer");
  const explorerContainer = document.querySelector("#score-explorer-chart");
  const explorerTabs = document.querySelector("#score-explorer-tabs");
  const closeButton = document.querySelector("#score-explorer-close");
  let explorerChart = null;
  let activeRoundIndex = 0;
  let activeCriterionIndex = 0;

  const selectExplorerCriterion = (roundIndex, criterionIndex, animateChange = true) => {
    const round = judgingRounds[roundIndex];
    const criterion = round.criteria[criterionIndex];
    activeRoundIndex = roundIndex;
    activeCriterionIndex = criterionIndex;
    dialog.style.setProperty("--score-accent", criterion.color);
    document.querySelector("#score-explorer-round").textContent = round.label;
    document.querySelector("#score-explorer-index").textContent = String(criterionIndex + 1).padStart(2, "0");
    document.querySelector("#score-explorer-title").textContent = criterion.name;
    document.querySelector("#score-explorer-value").textContent = `${criterion.value}%`;
    document.querySelector("#score-explorer-details").innerHTML = criterion.details
      .map((detail) => `<li>${escapeHTML(detail)}</li>`)
      .join("");
    explorerTabs.innerHTML = round.criteria
      .map(
        (item, index) => `
          <button type="button" role="tab" data-criterion="${index}" aria-selected="${index === criterionIndex}" tabindex="${index === criterionIndex ? "0" : "-1"}">
            <span>${escapeHTML(item.name)}</span><b>${item.value}%</b>
          </button>`,
      )
      .join("");

    const point = explorerChart?.series[0].points[criterionIndex];
    if (point && !point.selected) point.select(true, false);
    explorerContainer.querySelectorAll("[data-criterion]").forEach((button) => {
      const selected = Number(button.dataset.criterion) === criterionIndex;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    if (animateChange && animationsAvailable()) {
      document.querySelectorAll(".score-explorer-meta > *, .score-explorer-details li").forEach((element, index) => {
        element.getAnimations().forEach((animation) => animation.cancel());
        element.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 190, delay: index * 25, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
      });
    }
  };

  const renderExplorerChart = () => {
    const round = judgingRounds[activeRoundIndex];
    explorerChart?.destroy();
    explorerChart = null;
    explorerContainer.classList.remove("score-chart-fallback");
    explorerContainer.innerHTML = "";

    if (!window.Highcharts) {
      explorerContainer.classList.add("score-chart-fallback");
      explorerContainer.innerHTML = round.criteria
        .map(
          (criterion, index) =>
            `<button type="button" data-criterion="${index}" aria-pressed="${index === activeCriterionIndex}"><span>${escapeHTML(criterion.name)}</span><b>${criterion.value}%</b></button>`,
        )
        .join("");
      return;
    }

    explorerChart = window.Highcharts.chart("score-explorer-chart", {
      chart: {
        type: "pie",
        height: Math.max(480, explorerContainer.clientHeight),
        backgroundColor: "transparent",
        animation: animationsAvailable() ? { duration: 520 } : false,
        spacing: [18, 18, 18, 18],
      },
      title: { text: null },
      accessibility: {
        description: `${round.label}評分比例。選擇扇形可切換右側評分細項。`,
        point: { valueSuffix: "%" },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          animation: animationsAvailable() ? { duration: 520 } : false,
          borderRadius: 10,
          borderColor: "#11120f",
          borderWidth: 4,
          cursor: "pointer",
          innerSize: "46%",
          size: "76%",
          slicedOffset: 16,
          states: { inactive: { opacity: 0.62 }, hover: { brightness: 0.08 } },
          dataLabels: [
            {
              enabled: true,
              distance: 18,
              format: "{point.name}",
              connectorColor: "rgba(255,255,255,.42)",
              style: { color: "#fffdf5", fontSize: "12px", fontWeight: "800", textOutline: "none" },
            },
            {
              enabled: true,
              distance: "-34%",
              format: "{point.y:.0f}%",
              style: { color: "contrast", fontSize: "13px", fontWeight: "900", textOutline: "none" },
            },
          ],
          point: {
            events: {
              click() {
                selectExplorerCriterion(activeRoundIndex, this.index);
                return false;
              },
            },
          },
        },
      },
      tooltip: { enabled: false },
      series: [
        {
          name: "評分比重",
          colorByPoint: true,
          data: round.criteria.map((criterion) => ({ name: criterion.name, y: criterion.value, color: criterion.color })),
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
    });
    explorerChart.series[0].points[activeCriterionIndex]?.select(true, false);
  };

  const openExplorer = (roundIndex, criterionIndex) => {
    activeRoundIndex = roundIndex;
    activeCriterionIndex = criterionIndex;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("score-explorer-open");
    selectExplorerCriterion(roundIndex, criterionIndex, false);
    window.requestAnimationFrame(() => {
      renderExplorerChart();
      if (animationsAvailable()) {
        window.anime.animate(".score-explorer-visual, .score-explorer-copy", {
          opacity: { from: 0 },
          y: { from: 14 },
          delay: window.anime.stagger(70),
          duration: 330,
          ease: "out(4)",
        });
      }
    });
  };

  explorerTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-criterion]");
    if (button) selectExplorerCriterion(activeRoundIndex, Number(button.dataset.criterion));
  });
  explorerTabs.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const count = judgingRounds[activeRoundIndex].criteria.length;
    let nextIndex = activeCriterionIndex;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (activeCriterionIndex + count - 1) % count;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (activeCriterionIndex + 1) % count;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = count - 1;
    selectExplorerCriterion(activeRoundIndex, nextIndex);
    window.requestAnimationFrame(() => explorerTabs.querySelector(`[data-criterion="${nextIndex}"]`)?.focus());
  });
  explorerContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-criterion]");
    if (button) selectExplorerCriterion(activeRoundIndex, Number(button.dataset.criterion));
  });
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.classList.remove("score-explorer-open");
    explorerChart?.destroy();
    explorerChart = null;
    explorerContainer.innerHTML = "";
  });

  judgingRounds.forEach((round, roundIndex) => {
    const container = document.querySelector(`#${round.chartId}`);
    if (!window.Highcharts) {
      container.classList.add("score-chart-fallback");
      container.innerHTML = round.criteria
        .map(
          (criterion, criterionIndex) =>
            `<button type="button" data-criterion="${criterionIndex}" aria-pressed="false"><span>${escapeHTML(criterion.name)}</span><b>${criterion.value}%</b></button>`,
        )
        .join("");
      container.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => openExplorer(roundIndex, Number(button.dataset.criterion)));
      });
      return;
    }

    const labelColor = round.dark ? "#fffdf5" : "#11120f";
    const compactChart = container.clientWidth <= 360;
    charts[roundIndex] = window.Highcharts.chart(round.chartId, {
      chart: {
        type: "pie",
        height: compactChart ? 420 : 400,
        backgroundColor: "transparent",
        animation: animationsAvailable() ? { duration: 720 } : false,
        spacing: [8, 5, 8, 5],
      },
      title: { text: null },
      accessibility: {
        description: `${round.label}評分比例。選擇任一項目可查看評分細項。`,
        announceNewData: { enabled: true },
        point: { valueSuffix: "%" },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          animation: animationsAvailable() ? { duration: 720 } : false,
          borderRadius: 7,
          borderColor: round.dark ? "#11120f" : "#fffdf5",
          borderWidth: 3,
          cursor: "pointer",
          innerSize: "53%",
          center: compactChart ? ["50%", "40%"] : ["50%", "50%"],
          showInLegend: compactChart,
          size: compactChart ? Math.min(250, container.clientWidth - 16) : "72%",
          slicedOffset: 10,
          states: { inactive: { opacity: 0.72 }, hover: { brightness: 0.08 } },
          dataLabels: compactChart
            ? {
              enabled: true,
              distance: "-35%",
              format: "{point.y:.0f}%",
              style: { color: "#fff", fontSize: "13px", fontWeight: "900", textOutline: "2px #11120f" },
            }
            : [
              {
                enabled: true,
                distance: 12,
                format: "{point.name}",
                connectorColor: round.dark ? "rgba(255,255,255,.42)" : "rgba(17,18,15,.38)",
                connectorPadding: 4,
                style: { color: labelColor, fontSize: "12px", fontWeight: "800", textOutline: "none" },
              },
              {
                enabled: true,
                distance: "-35%",
                filter: { property: "percentage", operator: ">", value: 10 },
                format: "{point.y:.0f}%",
                style: { color: "contrast", fontSize: "12px", fontWeight: "900", textOutline: "none" },
              },
            ],
          point: {
            events: {
              click() {
                openExplorer(roundIndex, this.index);
                return false;
              },
              legendItemClick() {
                openExplorer(roundIndex, this.index);
                return false;
              },
            },
          },
        },
      },
      tooltip: { enabled: false },
      series: [
        {
          name: "評分比重",
          colorByPoint: true,
          data: round.criteria.map((criterion) => ({ name: criterion.name, y: criterion.value, color: criterion.color })),
        },
      ],
      credits: { enabled: false },
      legend: {
        enabled: compactChart,
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        itemDistance: 12,
        itemMarginBottom: 8,
        symbolHeight: 8,
        symbolWidth: 8,
        symbolRadius: 0,
        itemStyle: { color: labelColor, fontSize: "12px", fontWeight: "800", textOverflow: "none" },
        itemHoverStyle: { color: round.dark ? "#d9ff43" : "#6978ff" },
        labelFormatter() {
          return `${this.name} · ${this.y}%`;
        },
      },
    });
  });
}

function setupScrollStack() {
  const stack = document.querySelector("[data-scroll-stack]");
  if (!stack) return;

  const cards = [...stack.querySelectorAll(".scroll-stack-card")];
  const end = stack.querySelector(".scroll-stack-end");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const lastTransforms = new Map();
  let metrics = null;
  let lenis = null;
  let animationFrame = 0;
  let scrollFrame = 0;
  let nativeScrollActive = false;

  cards.forEach((card, index) => {
    card.style.zIndex = String(index + 1);
  });

  const calculateProgress = (value, start, finish) => {
    if (value <= start) return 0;
    if (value >= finish) return 1;
    return (value - start) / (finish - start);
  };

  const measure = () => {
    metrics = {
      cardTops: cards.map(getDocumentTop),
      cardHeights: cards.map((card) => card.offsetHeight),
      endTop: getDocumentTop(end),
    };
    updateCardTransforms();
  };

  const updateCardTransforms = () => {
    if (!metrics || motionQuery.matches) return;

    const scrollTop = window.scrollY;
    const containerHeight = window.innerHeight;
    const stackPosition = containerHeight * 0.12;
    const pinEnd = metrics.endTop - containerHeight * 0.58;

    cards.forEach((card, index) => {
      const cardTop = metrics.cardTops[index];
      const cardHeight = metrics.cardHeights[index];
      const preferredStackTop = stackPosition + 12 * index;
      const tallStackTop = containerHeight - cardHeight - 58 + 8 * index;
      const pinnedTop = cardHeight > containerHeight * 0.84 ? Math.min(preferredStackTop, tallStackTop) : preferredStackTop;
      const pinStart = cardTop - pinnedTop;
      const triggerEnd = pinStart + Math.min(containerHeight * 0.48, 360);
      const scaleProgress = calculateProgress(scrollTop, pinStart, triggerEnd);
      const targetScale = Math.min(0.97, 0.84 + index * 0.018);
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = index * 0.12 * scaleProgress;
      let translateY = 0;

      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + pinnedTop;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + pinnedTop;
      }

      const nextTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
      };
      const previous = lastTransforms.get(index);
      const changed =
        !previous ||
        Math.abs(previous.translateY - nextTransform.translateY) > 0.1 ||
        Math.abs(previous.scale - nextTransform.scale) > 0.001 ||
        Math.abs(previous.rotation - nextTransform.rotation) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`;
        lastTransforms.set(index, nextTransform);
      }

      const cardIsNear = scrollTop + containerHeight * 1.5 > cardTop && scrollTop < cardTop + cardHeight + containerHeight * 0.5;
      card.style.willChange = cardIsNear ? "transform" : "auto";
      card.classList.toggle("is-stack-active", scrollTop >= pinStart && scrollTop <= pinEnd);
    });
  };

  const handleNativeScroll = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateCardTransforms();
    });
  };

  const useNativeScroll = () => {
    if (nativeScrollActive) return;
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    nativeScrollActive = true;
  };

  const stop = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lenis?.destroy();
    lenis = null;
    pageScroller = null;
    if (nativeScrollActive) window.removeEventListener("scroll", handleNativeScroll);
    nativeScrollActive = false;
    cards.forEach((card) => {
      card.style.transform = "";
      card.style.willChange = "auto";
      card.classList.remove("is-stack-active");
    });
    lastTransforms.clear();
  };

  const start = () => {
    stop();
    if (motionQuery.matches) return;
    measure();

    if (window.Lenis && !coarsePointer.matches) {
      try {
        lenis = new window.Lenis({
          duration: 1.05,
          easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
          smoothWheel: true,
          syncTouch: false,
          lerp: 0.12,
        });
        pageScroller = lenis;
        lenis.on("scroll", updateCardTransforms);
        const raf = (time) => {
          lenis?.raf(time);
          animationFrame = window.requestAnimationFrame(raf);
        };
        animationFrame = window.requestAnimationFrame(raf);
        return;
      } catch {
        lenis = null;
      }
    }

    useNativeScroll();
  };

  const refresh = () => window.requestAnimationFrame(measure);
  window.addEventListener("resize", refresh, { passive: true });
  window.addEventListener("scrollstack:refresh", refresh);
  motionQuery.addEventListener("change", start);
  coarsePointer.addEventListener("change", start);
  window.addEventListener("load", refresh, { once: true });
  window.requestAnimationFrame(start);
}

function animationsAvailable() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && Boolean(window.anime?.animate);
}

function animateTimelineRows() {
  if (!animationsAvailable()) return;
  const rows = [...document.querySelectorAll("#timeline .timeline-item")];
  if (!rows.length) return;

  window.anime.animate(rows, {
    opacity: { from: 0 },
    x: { from: 16 },
    delay: window.anime.stagger(35),
    duration: 420,
    ease: "out(3)",
  });
}

function setupAnimations() {
  if (!animationsAvailable()) return;
  const { animate, stagger } = window.anime;
  const bootScreen = document.querySelector("#boot-screen");
  bootScreen.hidden = false;

  animate(".boot-meta > span, .boot-screen > strong, .boot-screen > small", {
    opacity: { from: 0 },
    y: { from: 18 },
    delay: stagger(70),
    duration: 480,
    ease: "out(4)",
  });

  animate(".boot-progress i", {
    scaleX: [0, 1],
    duration: 850,
    ease: "inOut(3)",
  });

  animate(bootScreen, {
    y: "-100%",
    delay: 950,
    duration: 620,
    ease: "inOut(4)",
    onComplete: () => bootScreen.remove(),
  });

  animate(".eyebrow, .hero h1 > em, .hero-meta", {
    opacity: { from: 0 },
    y: { from: 24 },
    delay: stagger(90, { start: 620 }),
    duration: 720,
    ease: "out(4)",
  });

  animate(".hero h1 > span:first-child", {
    opacity: { from: 0 },
    x: { from: -90 },
    skewX: { from: -12 },
    delay: 560,
    duration: 900,
    ease: "out(4)",
  });

  animate(".hero h1 > span:nth-child(2)", {
    opacity: { from: 0 },
    x: { from: 90 },
    skewX: { from: 12 },
    delay: 640,
    duration: 900,
    ease: "out(4)",
  });

  animate(".mission-control", {
    opacity: { from: 0 },
    x: { from: 30 },
    delay: 820,
    duration: 820,
    ease: "out(4)",
  });

  animate(".hero-grid", {
    backgroundPositionX: "54px",
    backgroundPositionY: "54px",
    duration: 16000,
    loop: true,
    ease: "linear",
  });

  animate(".hero-scan", {
    y: ["-10vh", "110vh"],
    duration: 6200,
    loop: true,
    ease: "linear",
  });

  document.querySelectorAll(".resource-card").forEach((card) => {
    card.addEventListener("pointerenter", () => {
      animate(card, { y: -6, duration: 260, ease: "out(3)" });
    });
    card.addEventListener("pointerleave", () => {
      animate(card, { y: 0, duration: 320, ease: "out(3)" });
    });
  });

  document.querySelectorAll(".track-list li").forEach((item) => {
    item.addEventListener("pointerenter", () => {
      animate(item, { x: 8, duration: 260, ease: "out(3)" });
    });
    item.addEventListener("pointerleave", () => {
      animate(item, { x: 0, duration: 320, ease: "out(3)" });
    });
  });

  const brandMark = document.querySelector(".brand-mark");
  document.querySelector(".brand")?.addEventListener("pointerenter", () => {
    animate(brandMark, { rotate: 90, scale: 1.08, duration: 520, ease: "out(4)" });
  });
  document.querySelector(".brand")?.addEventListener("pointerleave", () => {
    animate(brandMark, { rotate: 0, scale: 1, duration: 420, ease: "out(3)" });
  });

  if (!("IntersectionObserver" in window)) return;

  const groups = [
    ...document.querySelectorAll(
      ".action-grid, .rule-list, .track-list, .rounds, .resource-list, .faq-list",
    ),
  ];
  const groupedElements = new WeakSet(groups);
  const targets = [
    ...document.querySelectorAll(
      ".action-heading, .section-heading, .schedule-shell, .submission-spec, .tracks-head, .score-overview",
    ),
    ...groups,
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const animationTargets = groupedElements.has(entry.target) ? [...entry.target.children] : entry.target;
        animate(animationTargets, {
          opacity: { from: 0 },
          y: { from: 20 },
          delay: groupedElements.has(entry.target) ? stagger(55) : 0,
          duration: 560,
          ease: "out(3)",
        });
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  targets.forEach((target) => observer.observe(target));
}

function init() {
  renderDayTabs();
  renderTimeline(Date.now());
  renderResources();
  setupMenu();
  setupFaq();
  setupDisabledLinks();
  setupAnchorNavigation();
  setupScheduleNow();
  setupScoreCharts();
  setupMapPopup();
  setupScrollStack();
  updateNextEvent(Date.now());
  updateClock();
  setupAnimations();
  window.setInterval(updateClock, 1000);
}

document.addEventListener("DOMContentLoaded", init);
