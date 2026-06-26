/* ===================================================================
   Portafolio Artístico · Representativos Dancísticos EMA
   Lógica de interacción
   =================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNavbarScroll();
    initBackToTop();
    initQRCodes();
    initReveal();
    initCounters();
    initLightbox();
    initNavCollapseOnClick();
  });

  /* ---- Navbar: fondo sólido al hacer scroll ---- */
  function initNavbarScroll() {
    var nav = document.getElementById("mainNav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Botón volver arriba ---- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
  }

  /* ---- Generación de códigos QR ---- */
  function initQRCodes() {
    var boxes = document.querySelectorAll("[data-qr]");
    if (typeof QRCode === "undefined") return;
    boxes.forEach(function (box) {
      var url = box.getAttribute("data-qr");
      if (!url) return;
      try {
        new QRCode(box, {
          text: url,
          width: 220,
          height: 220,
          colorDark: "#1a1620",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (e) {
        box.textContent = "QR";
      }
    });
  }

  /* ---- Animación de aparición al hacer scroll ---- */
  function initReveal() {
    var targets = document.querySelectorAll(
      ".section-head, .row, .group-hero, .collage, .stats, .impact-card, .quote-card"
    );
    targets.forEach(function (el) { el.classList.add("reveal"); });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { obs.observe(el); });
  }

  /* ---- Contadores animados en sección Impacto ---- */
  function initCounters() {
    var nums = document.querySelectorAll(".stat-num[data-count]");
    if (!nums.length) return;

    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var dur = 1600, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + (progress === 1 ? "+" : "");
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { obs.observe(el); });
  }

  /* ---- Lightbox para fotos ---- */
  function initLightbox() {
    var lb = document.getElementById("lightbox");
    var content = document.getElementById("lightboxContent");
    var close = document.getElementById("lightboxClose");
    if (!lb || !content) return;

    document.querySelectorAll(".photo").forEach(function (fig) {
      fig.addEventListener("click", function () {
        var img = fig.querySelector("img");
        if (img) {
          content.innerHTML = '<img src="' + img.src + '" alt="' + (img.alt || "") + '">';
        } else {
          content.textContent = fig.getAttribute("data-photo") || "Imagen";
        }
        lb.classList.add("open");
      });
    });

    var hide = function () { lb.classList.remove("open"); };
    if (close) close.addEventListener("click", hide);
    lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });
  }

  /* ---- Cerrar menú móvil al hacer clic en un enlace ---- */
  function initNavCollapseOnClick() {
    var navLinks = document.querySelectorAll("#navItems .nav-link:not(.dropdown-toggle), #navItems .dropdown-item");
    var collapseEl = document.getElementById("navItems");
    if (!collapseEl || typeof bootstrap === "undefined") return;
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (collapseEl.classList.contains("show")) {
          var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
          bsCollapse.hide();
        }
      });
    });
  }
})();
