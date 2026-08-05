/**
 * The Indian Plate — site behaviour
 * -------------------------------------------------
 * Handles: config-driven content injection, WhatsApp links, mobile nav,
 * sticky header state, tiffin rendering, gallery lightbox, scroll reveal.
 */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG;

  function buildWhatsAppUrl(message) {
    const text = encodeURIComponent(message || cfg.whatsappDefaultMessage);
    return `https://wa.me/${cfg.whatsappNumber}?text=${text}`;
  }

  function buildMapsUrl() {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.mapsQuery)}`;
  }

  function injectConfig() {
    // Text content bindings: any element with data-cfg="path.to.value"
    document.querySelectorAll("[data-cfg]").forEach((el) => {
      const path = el.getAttribute("data-cfg").split(".");
      let value = cfg;
      path.forEach((p) => (value = value ? value[p] : undefined));
      if (value !== undefined) el.textContent = value;
    });

    // href bindings
    document.querySelectorAll('a[data-href="whatsapp"]').forEach((a) => {
      a.href = buildWhatsAppUrl();
    });
    document.querySelectorAll('a[data-href="call"]').forEach((a) => {
      a.href = `tel:${cfg.phone.replace(/\s+/g, "")}`;
    });
    document.querySelectorAll('a[data-href="directions"]').forEach((a) => {
      a.href = buildMapsUrl();
    });
    document.querySelectorAll('a[data-href="facebook"]').forEach((a) => {
      if (cfg.social.facebook) a.href = cfg.social.facebook;
      else a.classList.add("hidden");
    });
    document.querySelectorAll('a[data-href="instagram"]').forEach((a) => {
      if (cfg.social.instagram) a.href = cfg.social.instagram;
      else a.classList.add("hidden");
    });

    // Address (may appear in more than one place, e.g. contact section + footer)
    const addrHtml = (() => {
      const a = cfg.address;
      return [a.line1, a.line2, `${a.city} ${a.postcode}`, a.country].filter(Boolean).join("<br>");
    })();
    ["cfg-address", "cfg-address-footer"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = addrHtml;
    });

    // Opening hours
    const hoursEl = document.getElementById("cfg-hours");
    if (hoursEl) {
      hoursEl.innerHTML = cfg.openingHours
        .map(
          (h) =>
            `<li class="flex justify-between gap-4"><span>${h.day}</span><span class="font-medium">${h.hours}</span></li>`
        )
        .join("");
    }

    // Delivery areas
    const areasEl = document.getElementById("cfg-delivery-areas");
    if (areasEl) {
      areasEl.innerHTML = cfg.deliveryAreas
        .map((area) => `<span class="area-pill">${area}</span>`)
        .join("");
    }

  }

  function mobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  function stickyHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function renderTiffin() {
    const container = document.getElementById("tiffin-grid");
    if (!container) return;
    fetch("src/data/tiffin.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((days) => {
        container.innerHTML = days
          .map(
            (d) => `
            <div class="tiffin-day-card">
              <h3>${d.day}</h3>
              <ul>${d.items.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>`
          )
          .join("");
      })
      .catch((err) => {
        console.error("Could not load tiffin.json", err);
      });
  }

  function galleryLightbox() {
    const gallery = document.getElementById("gallery-grid");
    const lightbox = document.getElementById("lightbox");
    if (!gallery || !lightbox) return;
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("lightbox-close");

    gallery.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      lightboxImg.src = img.dataset.full || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function scrollReveal() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || !targets.length) {
      targets.forEach((t) => t.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => observer.observe(t));
  }

  function footerYear() {
    const el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function whatsappButtons() {
    // Any element with data-whatsapp-message attribute uses a custom message.
    document.querySelectorAll("[data-whatsapp]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(buildWhatsAppUrl(el.dataset.whatsappMessage), "_blank", "noopener");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectConfig();
    mobileNav();
    stickyHeader();
    renderTiffin();
    galleryLightbox();
    scrollReveal();
    footerYear();
    whatsappButtons();
  });
})();
