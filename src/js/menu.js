/**
 * The Indian Plate — menu rendering & filtering
 * -------------------------------------------------
 * Fully JSON-driven. Nothing about individual dishes is hardcoded here.
 * Edit /src/data/menu.json to add, remove or change dishes.
 */
(function () {
  "use strict";

  const CATEGORY_ORDER = ["Starters", "Chinese", "Bread", "Rice & Biryani", "Main Course", "Desserts", "Cookie Dough & Browney", "Drinks"];

  const state = {
    items: [],
    typeFilter: "all", // all | veg | non-veg
    categoryFilter: "All Categories"
  };

  const grid = document.getElementById("menu-grid");
  const emptyState = document.getElementById("menu-empty");
  const categoryFilterBar = document.getElementById("category-filters");

  function currency(value) {
    if (value === null || value === undefined || value === "") {
      return '<span class="ask-price">Ask on WhatsApp</span>';
    }
    return "£" + Number(value).toFixed(2);
  }

  function vegBadge(type) {
    const isVeg = type === "veg";
    return `
      <span class="veg-indicator ${isVeg ? "veg" : "non-veg"}" title="${isVeg ? "Vegetarian" : "Non-Vegetarian"}" aria-label="${isVeg ? "Vegetarian" : "Non-Vegetarian"}">
        <span class="veg-dot"></span>
      </span>`;
  }

  function rowTemplate(item) {
    return `
      <tr data-type="${item.type}">
        <td class="col-type">${vegBadge(item.type)}</td>
        <td class="col-name">
          ${item.name}${item.popular ? '<span class="popular-tag" title="Popular">⭐ Popular</span>' : ""}
        </td>
        <td class="col-price">${currency(item.price)}</td>
      </tr>`;
  }

  function categorySection(category, items) {
    return `
      <section class="menu-category">
        <h3 class="menu-category-title">${category}</h3>
        <div class="menu-table-wrap">
          <table class="menu-table">
            <tbody>
              ${items.map(rowTemplate).join("")}
            </tbody>
          </table>
        </div>
      </section>`;
  }

  function render() {
    const filtered = state.items.filter((item) => {
      const typeMatch = state.typeFilter === "all" || item.type === state.typeFilter;
      const catMatch = state.categoryFilter === "All Categories" || item.category === state.categoryFilter;
      return typeMatch && catMatch;
    });

    if (!filtered.length) {
      grid.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }
    emptyState.classList.add("hidden");

    const categoriesPresent = CATEGORY_ORDER.filter((c) => filtered.some((i) => i.category === c));

    grid.innerHTML = categoriesPresent
      .map((cat) => categorySection(cat, filtered.filter((i) => i.category === cat)))
      .join("");
  }

  function setActiveButton(container, activeBtn) {
    container.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
    activeBtn.setAttribute("aria-pressed", "true");
  }

  function buildCategoryFilters() {
    const categories = ["All Categories", ...CATEGORY_ORDER.filter((c) =>
      state.items.some((i) => i.category === c)
    )];
    categoryFilterBar.innerHTML = categories
      .map(
        (cat, i) =>
          `<button type="button" class="chip" data-category="${cat}" aria-pressed="${i === 0}">${cat}</button>`
      )
      .join("");

    categoryFilterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button.chip");
      if (!btn) return;
      state.categoryFilter = btn.dataset.category;
      setActiveButton(categoryFilterBar, btn);
      render();
    });
  }

  function bindTypeFilters() {
    const typeBar = document.getElementById("type-filters");
    typeBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button.type-chip");
      if (!btn) return;
      state.typeFilter = btn.dataset.type;
      setActiveButton(typeBar, btn);
      render();
    });
  }

  function showLoadError() {
    const cfg = window.SITE_CONFIG;
    const waNumber = cfg ? cfg.whatsappNumber : "";
    const waMessage = encodeURIComponent(
      (cfg && cfg.whatsappDefaultMessage) || "Hi, I'd like to see the menu please."
    );
    const waHref = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : "#";
    grid.innerHTML = `
      <div class="menu-error">
        <p>Menu temporarily unavailable. Please contact us on WhatsApp.</p>
        <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.32a8.22 8.22 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.26-8.24a8.2 8.2 0 0 1 5.84 2.42 8.18 8.18 0 0 1 2.42 5.83c0 4.55-3.7 8.28-8.26 8.28zm4.52-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.65.3-.23.24-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>
          Message Us on WhatsApp
        </a>
      </div>`;
    emptyState.classList.add("hidden");
  }

  // A brand-new visit can hit a cold connection (DNS/TLS not yet warmed up),
  // which sometimes fails the very first fetch even though the file is fine —
  // a plain refresh then works because the connection is already open.
  // Retrying a couple of times before giving up avoids showing an error for that case.
  async function fetchJsonWithRetry(url, attempts = 3, delayMs = 500) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`${url} request failed with status ${res.status}`);
        return await res.json();
      } catch (err) {
        lastErr = err;
        if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs));
      }
    }
    throw lastErr;
  }

  async function init() {
    try {
      const items = await fetchJsonWithRetry("src/data/menu.json");
      // Only show dishes that are explicitly available (or don't specify the flag at all).
      state.items = items.filter((item) => item.available !== false);
    } catch (err) {
      console.error("Could not load menu.json", err);
      showLoadError();
      return;
    }

    if (!state.items.length) {
      showLoadError();
      return;
    }

    buildCategoryFilters();
    bindTypeFilters();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
