/**
 * NextEmTech — lightweight, dependency-free carousel.
 * Progressive enhancement: without this file, .carousel-track falls back
 * to a plain stacked list (see css/styles.css), so content is always visible.
 * Works for both index.html (ltr) and index-ar.html (rtl).
 */
(function () {
  "use strict";

  function initCarousel(root) {
    var track = root.querySelector("[data-carousel-track]");
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var total = slides.length;
    if (!track || total < 2) return;

    var dots = Array.prototype.slice.call(
      root.querySelectorAll("[data-carousel-dot]")
    );
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var status = root.querySelector("[data-carousel-status]");

    var index = 0;
    var timer = null;
    var autoplayMs = 6000;
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function isRTL() {
      return getComputedStyle(root).direction === "rtl";
    }

    function render() {
      var sign = isRTL() ? 1 : -1;
      track.style.transform = "translateX(" + sign * index * 100 + "%)";

      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
        dot.tabIndex = active ? 0 : -1;
      });

      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });

      if (status) {
        status.textContent = "Slide " + (index + 1) + " of " + total;
      }
    }

    function goTo(i) {
      index = (i + total) % total;
      render();
      restart();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function play() {
      if (reduceMotion) return;
      stop();
      timer = window.setInterval(next, autoplayMs);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function restart() {
      play();
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
      });
    });

    // Pause on hover / keyboard focus, resume when the pointer/focus leaves
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) play();
    });

    // Pause entirely if the tab isn't visible
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else play();
    });

    // Arrow-key navigation, direction-aware
    root.addEventListener("keydown", function (e) {
      var rtl = isRTL();
      if (e.key === "ArrowRight") {
        rtl ? prev() : next();
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        rtl ? next() : prev();
        e.preventDefault();
      }
    });

    // Basic swipe support for touch devices
    var touchStartX = null;
    root.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].clientX;
        stop();
      },
      { passive: true }
    );
    root.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var threshold = 40;
      var rtl = isRTL();
      if (dx > threshold) rtl ? next() : prev();
      else if (dx < -threshold) rtl ? prev() : next();
      touchStartX = null;
      play();
    });

    root.classList.add("carousel--active");
    render();
    play();
  }

  function init() {
    var carousels = document.querySelectorAll("[data-carousel]");
    Array.prototype.forEach.call(carousels, initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
