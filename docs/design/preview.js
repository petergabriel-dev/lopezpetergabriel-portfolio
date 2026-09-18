const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function setTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === "dark";
  themeToggle.textContent = dark ? "Use light theme" : "Use dark theme";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function activateTab(tab, moveFocus = false) {
  const panelId = tab.getAttribute("aria-controls");

  tabs.forEach((candidate) => {
    const active = candidate === tab;
    candidate.setAttribute("aria-selected", String(active));
    candidate.tabIndex = active ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== panelId;
  });

  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;

    event.preventDefault();
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    activateTab(tabs[nextIndex], true);
  });
});
