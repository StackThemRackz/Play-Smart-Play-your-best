const guideContent = {
  warmup: {
    category: "WARM UP · 8 MINUTES · NO EQUIPMENT",
    title: "Start with a warm up",
    intro: "A warm up helps you ease into movement. Use a clear space and keep everything comfortable and controlled.",
    steps: ["Walk or march gently in place until you feel settled into movement.", "Add easy, comfortable arm circles and shoulder rolls.", "Try a few slow side steps, then practice the movements you’ll use in your sport at an easy pace.", "Take a moment to check how you feel before moving into practice."],
  },
  strength: {
    category: "STRENGTH · BODYWEIGHT · FORM FIRST",
    title: "Strength starts with form",
    intro: "Good movement matters more than adding weight. Ask a coach or qualified adult to show you new exercises and help check your form.",
    steps: ["Choose a movement you already know and a space where you can move safely.", "Practice slowly, using a comfortable range of motion and steady breathing.", "Stop when your form changes, you feel pain, or you feel unwell.", "Only add challenge with guidance from a coach who knows your age, experience, and sport."],
  },
  balance: {
    category: "AT HOME · 6 MINUTES · CLEAR A SMALL SPACE",
    title: "Find your balance",
    intro: "A simple balance practice can help you pay attention to control. Stay near something sturdy you can hold if you need it.",
    steps: ["Stand comfortably with both feet on the floor and look at a steady point.", "Shift your weight gently from one side to the other.", "If you feel steady, try lifting one heel slightly while keeping a hand near support.", "Switch sides when ready. Stop if you feel unsteady or uncomfortable."],
  },
  reset: {
    category: "RESET · 5 MINUTES · TAKE IT EASY",
    title: "Take a moment to reset",
    intro: "You don’t need to force a stretch. Let your breathing return to normal and choose gentle movement that feels comfortable.",
    steps: ["Walk slowly for a little while after activity, if that feels okay.", "Relax your shoulders and take a few easy breaths without holding them.", "Try gentle, comfortable movement. Avoid bouncing or pushing into pain.", "Drink some water and let a trusted adult or coach know how the session felt."],
  },
};

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}));

const filters = [...document.querySelectorAll(".filter-tab")];
const cards = [...document.querySelectorAll(".training-card")];
const searchInput = document.querySelector("#training-search");
const noResults = document.querySelector(".no-results");
let activeFilter = "all";
function updateCards() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  cards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
    const matchesSearch = !query || `${card.dataset.search} ${card.innerText}`.toLowerCase().includes(query);
    const visible = matchesFilter && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  noResults.hidden = visibleCount > 0;
}
filters.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  filters.forEach((item) => {
    const selected = item === button;
    item.classList.toggle("selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  updateCards();
}));
filters.forEach((button) => button.setAttribute("aria-pressed", String(button.classList.contains("selected"))));
searchInput.addEventListener("input", updateCards);

document.querySelectorAll(".pro-video-cover").forEach((button) => button.addEventListener("click", () => {
  const videoId = button.dataset.youtubeId;
  if (!/^[\w-]{11}$/.test(videoId)) return;
  const player = document.createElement("iframe");
  player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
  player.title = button.dataset.videoTitle;
  player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  player.referrerPolicy = "strict-origin-when-cross-origin";
  player.allowFullscreen = true;
  button.parentElement.replaceChildren(player);
}));

const guideDialog = document.querySelector(".guide-dialog");
const guideSteps = document.querySelector("#guide-steps");
document.querySelectorAll("[data-guide]").forEach((button) => button.addEventListener("click", () => {
  const guide = guideContent[button.dataset.guide];
  document.querySelector("#guide-category").textContent = guide.category;
  document.querySelector("#guide-title").textContent = guide.title;
  document.querySelector("#guide-intro").textContent = guide.intro;
  guideSteps.replaceChildren(...guide.steps.map((step, index) => {
    const row = document.createElement("div");
    row.className = "guide-step";
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const text = document.createElement("p");
    text.textContent = step;
    row.append(number, text);
    return row;
  }));
  guideDialog.showModal();
}));
document.querySelector(".dialog-close").addEventListener("click", () => guideDialog.close());
document.querySelector(".dialog-done").addEventListener("click", () => guideDialog.close());
guideDialog.addEventListener("click", (event) => {
  if (event.target === guideDialog) guideDialog.close();
});

const checklistInputs = [...document.querySelectorAll("[data-check]")];
const checkFeedback = document.querySelector(".check-feedback");
const storageKey = "playsmart-daily-check-v1";
function localDateKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (saved.date === localDateKey()) {
    checklistInputs.forEach((input) => { input.checked = saved[input.dataset.check] === true; });
  }
} catch { /* Continue with an empty check if storage is unavailable. */ }
function updateCheck() {
  const checked = checklistInputs.filter((input) => input.checked).length;
  const data = { date: localDateKey(), ...Object.fromEntries(checklistInputs.map((input) => [input.dataset.check, input.checked])) };
  try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch { /* The checklist remains usable without storage. */ }
  checkFeedback.classList.toggle("complete", checked === checklistInputs.length);
  checkFeedback.textContent = checked === checklistInputs.length
    ? "Nice check in. You can reset this anytime."
    : checked > 0 ? `${checked} of 4 checked. Take your time.` : "No rush. You can come back to this anytime.";
}
checklistInputs.forEach((input) => input.addEventListener("change", updateCheck));
updateCheck();
document.querySelector(".reset-check").addEventListener("click", () => {
  checklistInputs.forEach((input) => { input.checked = false; });
  updateCheck();
});

const breathButton = document.querySelector(".breath-button");
const breathCircle = document.querySelector(".breath-circle");
const breathText = document.querySelector(".breath-text");
const breathButtonLabel = document.querySelector(".breath-button-label");
let breathingTimer;
let breathingTimeout;
function stopBreathing() {
  clearInterval(breathingTimer);
  clearTimeout(breathingTimeout);
  breathCircle.classList.remove("active");
  breathText.innerHTML = "BREATHE<br /><small>WITH ME</small>";
  breathButtonLabel.textContent = "Start breathing";
  breathButton.disabled = false;
}
breathButton.addEventListener("click", () => {
  let inhale = true;
  let count = 0;
  breathCircle.classList.add("active");
  breathText.innerHTML = 'BREATHE IN<br /><small class="breath-count">4 seconds</small>';
  breathButtonLabel.textContent = "Breathing…";
  breathButton.disabled = true;
  breathingTimer = setInterval(() => {
    inhale = !inhale;
    count += 1;
    breathCircle.classList.toggle("active", inhale);
    breathText.innerHTML = `${inhale ? "BREATHE IN" : "BREATHE OUT"}<br /><small class="breath-count">4 seconds</small>`;
    if (count >= 7) stopBreathing();
  }, 4000);
  breathingTimeout = setTimeout(stopBreathing, 32000);
});

const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
}, { rootMargin: "-20% 0px -62% 0px", threshold: [0, 0.15, 0.35] });
sections.forEach((section) => navObserver.observe(section));
