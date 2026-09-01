const audio = document.querySelector("#anthem-audio");
const playButton = document.querySelector("#play-button");
const visualizer = document.querySelector(".visualizer");
const seekControl = document.querySelector("#seek-control");
const currentTimeLabel = document.querySelector("#current-time");
const durationLabel = document.querySelector("#duration");
const statusLabel = document.querySelector("#audio-status");
const statusDot = document.querySelector("#status-dot");
const currentLyric = document.querySelector("#current-lyric");
const lyricsList = document.querySelector("#lyrics-list");
const lyricsScroll = document.querySelector("#lyrics-scroll");
const lyricPosition = document.querySelector("#lyric-position");
const lyricTotal = document.querySelector("#lyric-total");
const waveCanvas = document.querySelector("#wave-canvas");
const ambientCanvas = document.querySelector("#ambient-canvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let audioContext = null;
let analyser = null;
let sourceNode = null;
let frequencyData = null;
let waveformData = null;
let lyricLines = [];
let activeLyricIndex = -1;
let animationFrame = 0;

function formatTime(value) {
  if (!Number.isFinite(value)) return "--:--";
  const seconds = Math.max(0, Math.floor(value));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function setStatus(text, state = "ready") {
  statusLabel.textContent = text;
  statusDot.classList.toggle("is-live", state === "live");
  statusDot.classList.toggle("is-error", state === "error");
}

function updatePlayerState() {
  const playing = !audio.paused && !audio.ended;
  playButton.classList.toggle("is-playing", playing);
  playButton.setAttribute("aria-label", playing ? "暫停〈把未來做出來〉" : "播放〈把未來做出來〉");
  visualizer.dataset.playing = String(playing);
  setStatus(playing ? "SIGNAL LIVE" : audio.ended ? "TRACK ENDED" : "AUDIO READY", playing ? "live" : "ready");
}

async function ensureAudioGraph() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioContext = new AudioContextClass();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.82;
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    waveformData = new Uint8Array(analyser.fftSize);
  }

  if (audioContext.state === "suspended") await audioContext.resume();
}

async function togglePlayback() {
  if (!audio.paused) {
    audio.pause();
    return;
  }

  try {
    await ensureAudioGraph();
    await audio.play();
  } catch {
    setStatus("PLAYBACK BLOCKED", "error");
    currentLyric.textContent = "瀏覽器阻擋了播放，請再按一次播放鍵。";
  }
}

function updateProgress() {
  const duration = audio.duration;
  const progress = Number.isFinite(duration) && duration > 0 ? audio.currentTime / duration : 0;
  const value = Math.round(progress * 1000);
  const elapsed = formatTime(audio.currentTime);
  const total = formatTime(duration);

  seekControl.value = String(value);
  seekControl.style.setProperty("--seek-progress", `${progress * 100}%`);
  seekControl.setAttribute("aria-valuetext", `${elapsed} / ${total}`);
  currentTimeLabel.textContent = elapsed;
  currentTimeLabel.dateTime = `PT${Math.floor(audio.currentTime)}S`;
  durationLabel.textContent = total;
  if (Number.isFinite(duration)) durationLabel.dateTime = `PT${Math.floor(duration)}S`;
  updateActiveLyric(progress);
}

function createLyricTimings() {
  if (!lyricLines.length) return;
  const totalWeight = lyricLines.reduce((sum, line) => sum + line.weight, 0);
  let elapsedWeight = 0;

  lyricLines.forEach((line) => {
    line.startRatio = elapsedWeight / totalWeight;
    elapsedWeight += line.weight;
    line.endRatio = elapsedWeight / totalWeight;
  });
}

function updateActiveLyric(progress) {
  if (!lyricLines.length || !Number.isFinite(progress)) return;
  let nextIndex = lyricLines.findIndex((line) => progress < line.endRatio);
  if (nextIndex < 0) nextIndex = lyricLines.length - 1;
  if (nextIndex === activeLyricIndex) return;

  lyricLines[activeLyricIndex]?.element.classList.remove("is-active");
  lyricLines[activeLyricIndex]?.element.removeAttribute("aria-current");
  lyricLines.forEach((line, index) => line.element.classList.toggle("is-near", Math.abs(index - nextIndex) <= 2));

  const activeLine = lyricLines[nextIndex];
  activeLine.element.classList.add("is-active");
  activeLine.element.setAttribute("aria-current", "true");
  activeLyricIndex = nextIndex;
  lyricPosition.textContent = String(nextIndex + 1).padStart(3, "0");
  currentLyric.textContent = activeLine.text;

  if (!audio.paused) {
    const targetTop = activeLine.element.offsetTop - lyricsScroll.clientHeight / 2 + activeLine.element.offsetHeight / 2;
    lyricsScroll.scrollTo({ top: targetTop, behavior: reducedMotion.matches ? "auto" : "smooth" });
  }
}

function renderLyrics(source) {
  const rows = source.replaceAll("\r", "").split("\n");
  const fragment = document.createDocumentFragment();
  let lineNumber = 0;
  lyricsList.innerHTML = "";
  lyricLines = [];

  rows.forEach((row) => {
    const text = row.trim();
    if (!text) {
      const breakElement = document.createElement("li");
      breakElement.className = "lyric-break";
      breakElement.setAttribute("aria-hidden", "true");
      fragment.append(breakElement);
      return;
    }

    lineNumber += 1;
    const item = document.createElement("li");
    const button = document.createElement("button");
    item.className = "lyric-line";
    item.dataset.number = String(lineNumber).padStart(3, "0");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", `跳至歌詞第 ${lineNumber} 句：${text}`);
    item.append(button);
    fragment.append(item);

    const line = {
      text,
      element: item,
      weight: 1 + Math.min(Array.from(text).length, 24) * 0.095,
      startRatio: 0,
      endRatio: 0,
    };
    button.addEventListener("click", () => {
      if (!Number.isFinite(audio.duration)) return;
      audio.currentTime = line.startRatio * audio.duration;
      updateProgress();
    });
    lyricLines.push(line);
  });

  lyricsList.append(fragment);
  lyricTotal.textContent = String(lyricLines.length).padStart(3, "0");
  createLyricTimings();
  updateActiveLyric(0);
}

async function loadLyrics() {
  try {
    const response = await fetch("lyrics.txt");
    if (!response.ok) throw new Error("Lyrics unavailable");
    renderLyrics(await response.text());
  } catch {
    lyricsList.innerHTML = '<li class="lyrics-error">歌詞載入失敗，請重新整理頁面。</li>';
  }
}

function sizeCanvas(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.dataset.width = String(width);
  canvas.dataset.height = String(height);
  canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawStageWave(context, width, height, frequencyValues, timeValues, time, live) {
  context.clearRect(0, 0, width, height);
  const center = height * 0.48;
  const barCount = 48;
  const gap = Math.max(2, width * 0.0035);
  const barWidth = Math.max(2, (width - gap * (barCount - 1)) / barCount);
  const barGradient = context.createLinearGradient(0, 0, 0, height);
  barGradient.addColorStop(0, "#d9ff43");
  barGradient.addColorStop(0.5, "rgba(217, 255, 67, 0.32)");
  barGradient.addColorStop(1, "#7b79ff");
  context.fillStyle = barGradient;

  for (let index = 0; index < barCount; index += 1) {
    const sampleIndex = Math.floor((index / barCount) * Math.min(frequencyValues?.length || 0, 180));
    const synthetic = 0.09 + (Math.sin(time * 0.0017 + index * 0.48) + 1) * 0.035;
    const strength = live && frequencyValues ? Math.max(0.035, frequencyValues[sampleIndex] / 255) : synthetic;
    const barHeight = Math.max(2, strength * height * 0.37);
    const x = index * (barWidth + gap);
    context.globalAlpha = 0.3 + strength * 0.7;
    context.fillRect(x, center - barHeight, barWidth, barHeight * 2);
  }
  context.globalAlpha = 1;

  context.beginPath();
  for (let index = 0; index < 180; index += 1) {
    const x = (index / 179) * width;
    const sampleIndex = Math.floor((index / 180) * (timeValues?.length || 0));
    const value = live && timeValues ? timeValues[sampleIndex] / 128 - 1 : Math.sin(index * 0.21 + time * 0.0022) * 0.09;
    const y = center + value * height * 0.28;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.strokeStyle = live ? "rgba(157, 231, 255, 0.76)" : "rgba(157, 231, 255, 0.28)";
  context.lineWidth = 1.3;
  context.stroke();
}

function drawAmbient(context, width, height, values, time, live) {
  context.clearRect(0, 0, width, height);
  const center = height * 0.52;

  for (let layer = 0; layer < 3; layer += 1) {
    context.beginPath();
    for (let index = 0; index <= 90; index += 1) {
      const x = (index / 90) * width;
      const sampleIndex = Math.floor((index / 90) * Math.min(values?.length || 0, 160));
      const strength = live && values ? values[sampleIndex] / 255 : 0.12;
      const drift = Math.sin(index * (0.1 + layer * 0.016) + time * (0.00035 + layer * 0.00008));
      const y = center + drift * (28 + layer * 24) * (0.35 + strength * 1.8);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = layer === 0 ? "rgba(217, 255, 67, 0.72)" : `rgba(123, 121, 255, ${0.5 - layer * 0.1})`;
    context.lineWidth = 1 + layer * 0.5;
    context.stroke();
  }
}

function drawVisuals(time) {
  const live = Boolean(analyser && !audio.paused && !audio.ended && !reducedMotion.matches);
  if (analyser) {
    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(waveformData);
  }

  const waveWidth = Number(waveCanvas.dataset.width) || 1;
  const waveHeight = Number(waveCanvas.dataset.height) || 1;
  const ambientWidth = Number(ambientCanvas.dataset.width) || 1;
  const ambientHeight = Number(ambientCanvas.dataset.height) || 1;
  drawStageWave(waveCanvas.getContext("2d"), waveWidth, waveHeight, frequencyData, waveformData, time, live);
  drawAmbient(ambientCanvas.getContext("2d"), ambientWidth, ambientHeight, frequencyData, time, live);

  let energy = 0;
  if (live && frequencyData) {
    const sampleCount = Math.min(110, frequencyData.length);
    for (let index = 0; index < sampleCount; index += 1) energy += frequencyData[index];
    energy /= sampleCount * 255;
  }
  document.documentElement.style.setProperty("--energy-scale", String(1 + energy * 0.1));
  document.documentElement.style.setProperty("--energy-opacity", String(0.14 + energy * 0.34));
  updateProgress();
  animationFrame = window.requestAnimationFrame(drawVisuals);
}

function resizeCanvases() {
  sizeCanvas(waveCanvas);
  sizeCanvas(ambientCanvas);
}

playButton.addEventListener("click", togglePlayback);
audio.addEventListener("play", updatePlayerState);
audio.addEventListener("pause", updatePlayerState);
audio.addEventListener("ended", updatePlayerState);
audio.addEventListener("waiting", () => setStatus("BUFFERING", "ready"));
audio.addEventListener("canplay", updatePlayerState);
audio.addEventListener("error", () => {
  setStatus("AUDIO ERROR", "error");
  currentLyric.textContent = "音訊載入失敗，請確認網路後重新整理。";
});
audio.addEventListener("loadedmetadata", updateProgress);
seekControl.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration)) return;
  audio.currentTime = (Number(seekControl.value) / 1000) * audio.duration;
  updateProgress();
});
document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.target.closest("button, input, a")) return;
  event.preventDefault();
  togglePlayback();
});
window.addEventListener("resize", resizeCanvases, { passive: true });
window.addEventListener("pagehide", () => window.cancelAnimationFrame(animationFrame), { once: true });

resizeCanvases();
loadLyrics();
updatePlayerState();
animationFrame = window.requestAnimationFrame(drawVisuals);
window.requestAnimationFrame(() => document.body.classList.add("is-ready"));
