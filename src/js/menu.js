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

  async function init() {
    try {
      const res = await fetch("src/data/menu.json", { cache: "no-store" });
      state.items = await res.json();
    } catch (err) {
      console.error("Could not load menu.json", err);
      grid.innerHTML = `<p class="text-center text-charcoal/70">Menu is temporarily unavailable. Please contact us directly.</p>`;
      return;
    }
    buildCategoryFilters();
    bindTypeFilters();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
