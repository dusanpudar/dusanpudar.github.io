// Replace with your deployed Google Apps Script Web App URL
const CONTACT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNf8zYYTwbVJyX7CcxAFwQsn0ikkVsk1XguluCnglCyUGN-fVI8_hpcmWbOT5IvdVcHg/exec";
// Must match the site key used in the reCAPTCHA <script> tag in index.html
const RECAPTCHA_SITE_KEY = "6LcBBL0tAAAAAIUOhda9Aaz7-fOTONDZQJ_iL9gu";

const pageLoadedAt = Date.now();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  initSmoothScroll();
  initMobileNav();
  initHeaderShadow();
  initScrollReveal();
  initTimelineScroll();
  initImageProtection();
  initProjectsCarousel();
  initCvModal();
  initContactForm();
  initBackToTop();
  initTypingEffect();
});

// Smooth scroll to in-page sections without adding #hash to the URL
function initSmoothScroll() {
  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileNav();
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("is-active");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.getElementById("nav").classList.toggle("is-open", isOpen);
  });
}

function closeMobileNav() {
  document.getElementById("navToggle").classList.remove("is-active");
  document.getElementById("navToggle").setAttribute("aria-expanded", "false");
  document.getElementById("nav").classList.remove("is-open");
}

function initHeaderShadow() {
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  });
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  btn.hidden = false;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 500);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initTypingEffect() {
  const el = document.getElementById("eyebrowText");
  const text = el.textContent;
  el.textContent = "";

  function type(i) {
    el.textContent = text.slice(0, i);
    if (i < text.length) {
      setTimeout(() => type(i + 1), 45);
    } else {
      setTimeout(() => erase(text.length), 2500);
    }
  }

  function erase(i) {
    el.textContent = text.slice(0, i);
    if (i > 0) {
      setTimeout(() => erase(i - 1), 30);
    } else {
      setTimeout(() => type(0), 500);
    }
  }

  type(0);
}

// Reveals elements as they enter the viewport
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !revealEls.length) return;

  document.documentElement.classList.add("js-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// Lights up each timeline dot/line as it scrolls into view
function initTimelineScroll() {
  const items = document.querySelectorAll(".timeline-item");
  if (!("IntersectionObserver" in window) || !items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

// Best-effort deterrent against casual image saving
function initImageProtection() {
  document.addEventListener("contextmenu", (event) => {
    if (event.target.tagName === "IMG") event.preventDefault();
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target.tagName === "IMG") event.preventDefault();
  });
}

function initProjectsCarousel() {
  const track = document.getElementById("projectsTrack");
  if (!track) return;

  document.querySelectorAll(".carousel-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = parseInt(btn.dataset.dir, 10);
      const item = track.querySelector(".project-item");
      const step = item ? item.getBoundingClientRect().width + 20 : 320;
      track.scrollBy({ left: dir * step * 2, behavior: "smooth" });
    });
  });
}

function initCvModal() {
  const modal = document.getElementById("cvModal");
  const frame = document.getElementById("cvFrame");
  const openers = document.querySelectorAll("[data-cv-open]");
  const closers = modal.querySelectorAll("[data-cv-close]");
  const cvUrl = "assets/pdf/DusanPudarCV.pdf?v=2";

  openers.forEach((btn) => btn.addEventListener("click", open));
  closers.forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) close();
  });

  function open() {
    // Mobile browsers can't reliably render a PDF inside an iframe
    if (window.matchMedia("(max-width: 768px)").matches) {
      window.open(cvUrl, "_blank");
      return;
    }
    frame.src = cvUrl;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.hidden = true;
    frame.src = "";
    document.body.style.overflow = "";
  }
}

function getRecaptchaToken(action) {
  return new Promise((resolve, reject) => {
    if (typeof grecaptcha === "undefined") {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }
    grecaptcha.ready(() => {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector(".form-submit");
  const submitLabel = form.querySelector(".form-submit-label");
  const successCard = document.getElementById("formSuccess");
  const resetBtn = document.getElementById("formSuccessReset");

  resetBtn.addEventListener("click", () => {
    successCard.hidden = true;
    form.hidden = false;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      showToast("Please fill in all fields correctly.", "error");
      return;
    }

    // Honeypot: real visitors never fill this field
    if (form.website.value.trim() !== "") {
      showFormSuccess(form, successCard);
      return;
    }

    // Timing check: a submit within 2s of page load is almost certainly a bot
    if (Date.now() - pageLoadedAt < 2000) {
      showToast("Please try again in a moment.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = "Sending...";

    try {
      const token = await getRecaptchaToken("contact");
      const formData = new FormData(form);
      formData.append("recaptchaToken", token);

      await fetch(CONTACT_SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      showFormSuccess(form, successCard);
    } catch (error) {
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "Send message";
    }
  });
}

function showFormSuccess(form, successCard) {
  form.reset();
  form.hidden = true;
  successCard.hidden = false;
}

let toastTimer = null;

function showToast(message, type) {
  const toast = document.getElementById("toast");
  const icon = toast.querySelector(".toast-icon");
  const text = toast.querySelector(".toast-text");

  clearTimeout(toastTimer);
  toast.hidden = false;
  toast.className = `toast is-${type}`;
  icon.className = `toast-icon fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`;
  text.textContent = message;

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => { toast.hidden = true; }, 250);
  }, 4000);
}
