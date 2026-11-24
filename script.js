/* =========================================
   PERSONAL PORTFOLIO — INTERACTIONS
   Vanilla JavaScript only.
   ========================================= */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const backToTop = document.querySelector("#back-to-top");
  const contactForm = document.querySelector("#contact-form");
  const formFeedback = document.querySelector("#form-feedback");
  const currentYear = document.querySelector("#current-year");

  // Keep the footer year current.
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  // Mobile navigation.
  function closeMenu() {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) closeMenu();
    });
  }

  // Mark the navigation link for the section currently in view.
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.id;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("active", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Reveal sections as they enter the viewport. Content stays visible
  // automatically in browsers without IntersectionObserver support.
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Back-to-top control.
  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // Placeholder project links are intentionally prevented from navigating.
  // Replace their href="#" values with real project URLs when available.
  document.querySelectorAll(".placeholder-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
        const originalText = link.textContent;
        link.textContent = "Add your URL in index.html";
        window.setTimeout(() => { link.textContent = originalText; }, 2200);
      }
    });
  });

  // Frontend-only validation. This form does not transmit or store data.
  if (contactForm) {
    const fields = [...contactForm.querySelectorAll("input, textarea")];

    function validateField(field) {
      const value = field.value.trim();
      let valid = field.checkValidity();

      if (field.type === "email" && value) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      field.setAttribute("aria-invalid", String(!valid));
      return valid;
    }

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.hasAttribute("aria-invalid")) validateField(field);
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const results = fields.map(validateField);
      const allValid = results.every(Boolean);

      formFeedback.classList.remove("error");

      if (!allValid) {
        formFeedback.textContent = "Please check the highlighted fields and complete the form correctly.";
        formFeedback.classList.add("error");
        const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      formFeedback.textContent = "Your message passed validation. Message delivery is not configured on this demo.";
      contactForm.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
    });
  }
});
