/**
 * The Indian Table — theme presets & live preview switcher
 * -------------------------------------------------
 * Each theme sets the four brand color variables (as "R G B" channel
 * triples) that both Tailwind's utility classes and the custom CSS in
 * styles.css read from (see :root in styles.css). Switching is instant —
 * no reload needed, the whole page re-themes live.
 *
 * This is a TEMPORARY preview tool so you can compare options and decide.
 * Once you've picked a favourite, tell me which one and I'll bake it in
 * as the permanent default and remove this switcher bar.
 */
(function () {
  "use strict";

  const DEFAULT_THEME_ID = "midnight-gold";

  const THEMES = [
    {
      id: "midnight-gold",
      name: "Midnight & Gold (default)",
      colors: { red: "74 30 30", orange: "201 162 39", cream: "247 241 227", charcoal: "26 22 20" }
    },
    {
      id: "classic-red",
      name: "Classic Red",
      colors: { red: "163 38 56", orange: "217 98 43", cream: "251 243 231", charcoal: "34 28 26" }
    },
    {
      id: "golden-saffron",
      name: "Golden Saffron (matches your menu/logo art)",
      colors: { red: "110 27 32", orange: "224 168 42", cream: "253 246 229", charcoal: "46 27 16" }
    },
    {
      id: "terracotta-spice",
      name: "Terracotta Spice",
      colors: { red: "181 80 46", orange: "224 147 46", cream: "251 243 231", charcoal: "43 31 22" }
    },
    {
      id: "curry-green-gold",
      name: "Curry Green & Gold",
      colors: { red: "47 82 51", orange: "217 166 46", cream: "251 243 231", charcoal: "34 28 26" }
    }
  ];

  const STORAGE_KEY = "tip-preview-theme";
  const DARK_STORAGE_KEY = "tip-dark-mode";

  function applyTheme(theme) {
    const root = document.documentElement.style;
    root.setProperty("--color-red-rgb", theme.colors.red);
    root.setProperty("--color-orange-rgb", theme.colors.orange);
    root.setProperty("--color-cream-rgb", theme.colors.cream);
    root.setProperty("--color-charcoal-rgb", theme.colors.charcoal);
  }

  function currentRgbVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Keeps the actual browser color-scheme and the mobile browser-chrome
  // color in sync with whichever mode + accent theme is currently active,
  // so native controls (scrollbars, form fields, the address bar tint on
  // mobile) never clash with the page.
  function applyColorScheme(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    const meta = document.getElementById("meta-theme-color");
    if (meta) {
      const rgb = isDark ? currentRgbVar("--color-charcoal-rgb") : currentRgbVar("--color-cream-rgb");
      if (rgb) meta.setAttribute("content", `rgb(${rgb.trim().split(/\s+/).join(",")})`);
    }
  }

  function initThemeSelect() {
    const select = document.getElementById("theme-select");
    if (!select) return;

    select.innerHTML = THEMES.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");

    const saved = localStorage.getItem(STORAGE_KEY);
    const fallback = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];
    const initial = THEMES.find((t) => t.id === saved) || fallback;
    select.value = initial.id;
    applyTheme(initial);

    select.addEventListener("change", () => {
      const theme = THEMES.find((t) => t.id === select.value) || THEMES[0];
      applyTheme(theme);
      localStorage.setItem(STORAGE_KEY, theme.id);
      // Re-sync theme-color meta since the accent colors just changed.
      applyColorScheme(document.documentElement.classList.contains("dark"));
    });
  }

  function initDarkToggle() {
    const toggle = document.getElementById("dark-mode-toggle");
    if (!toggle) return;

    // Light mode is the default regardless of the device's system setting —
    // only an explicit toggle (remembered below) switches this to dark.
    const saved = localStorage.getItem(DARK_STORAGE_KEY);
    const isDark = saved === "1";

    toggle.checked = isDark;
    applyColorScheme(isDark);

    toggle.addEventListener("change", () => {
      applyColorScheme(toggle.checked);
      localStorage.setItem(DARK_STORAGE_KEY, toggle.checked ? "1" : "0");
    });
  }

  function init() {
    initThemeSelect();
    initDarkToggle();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
