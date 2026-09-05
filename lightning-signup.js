const SIGNUP_RELEASE = new Date("2026-09-05T09:00:00+08:00").getTime();
const SIGNUP_URL = "https://forms.gle/SvfyNtQSpe1aJkcK8";

const signupStatus = document.querySelector("#signup-status");
const signupHours = document.querySelector("#signup-hours");
const signupMinutes = document.querySelector("#signup-minutes");
const signupSeconds = document.querySelector("#signup-seconds");
const signupCountdownNote = document.querySelector("#signup-countdown-note");
const signupLink = document.querySelector("#signup-link");

function formatSignupUnit(value) {
  return String(value).padStart(2, "0");
}

function updateSignupCountdown() {
  const remaining = Math.max(0, SIGNUP_RELEASE - Date.now());
  const seconds = Math.ceil(remaining / 1000);
  const isOpen = remaining === 0;

  signupHours.textContent = formatSignupUnit(Math.floor(seconds / 3600));
  signupMinutes.textContent = formatSignupUnit(Math.floor((seconds % 3600) / 60));
  signupSeconds.textContent = formatSignupUnit(seconds % 60);
  document.body.classList.toggle("is-signup-open", isOpen);

  if (isOpen) {
    signupStatus.lastElementChild.textContent = "報名現正開放";
    signupCountdownNote.textContent = "現在就上台，讓你的想法被聽見。";
    signupLink.href = SIGNUP_URL;
    signupLink.target = "_blank";
    signupLink.rel = "noreferrer";
    signupLink.removeAttribute("aria-disabled");
    signupLink.textContent = "立即報名";
    return true;
  }

  return false;
}

function initSignupCountdown() {
  if (updateSignupCountdown()) return;
  const refreshDelay = SIGNUP_RELEASE - Date.now() + 250;
  window.setTimeout(() => window.location.reload(), refreshDelay);
  window.setInterval(() => updateSignupCountdown(), 1000);
}

document.addEventListener("DOMContentLoaded", initSignupCountdown);
