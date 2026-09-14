/**
 * Strip carousel — continuous auto-sliding strip with manual prev/next.
 * Progressive enhancement: without this file, .strip-track falls back to
 * the plain CSS @keyframes auto-scroll (see css/styles.css), so motion
 * still works with JS disabled — it just can't be manually navigated.
 * When this file runs, it takes over position control entirely (adds
 * .strip-carousel--js, which turns off the CSS animation) so manual
 * clicks and continuous motion never fight each other.
 */
(function () {
  "use strict";

  function initStrip(root) {
    var track = root.querySelector(".strip-track");
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children);
    var half = cards.length / 2; // cards are duplicated in the HTML for a seamless loop
    if (!Number.isInteger(half) || half < 1) return;

    var reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var setWidth = 0; // px width of one full (non-duplicated) set of cards
    var step = 0; // px width of a single card + its gap
    function measure() {
      var first = cards[0].getBoundingClientRect();
      var afterHalf = cards[half].getBoundingClientRect();
      setWidth = Math.abs(afterHalf.left - first.left);
      if (cards.length > 1) {
        var second = cards[1].getBoundingClientRect();
        step = Math.abs(second.left - first.left);
      }
    }

    function isRTL() {
      return getComputedStyle(root).direction === "rtl";
    }

    var offset = 0; // logical distance traveled, always kept within [0, setWidth)
    var paused = false;
    var manualAnimating = false;
    var lastTs = null;
    var speed = 34; // px per second, matches the prior CSS animation's pace
    var resumeTimer = null;

    function applyTransform() {
      var sign = isRTL() ? 1 : -1;
      track.style.transform = "translateX(" + sign * offset + "px)";
    }

    function tick(ts) {
      if (lastTs === null) lastTs = ts;
      var dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (!paused && !manualAnimating && !reduceMotion && setWidth > 0) {
        offset += speed * dt;
        if (offset >= setWidth) offset -= setWidth;
        applyTransform();
      }
      requestAnimationFrame(tick);
    }

    function restartPauseTimer() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () {
        paused = false;
      }, 2500);
    }

    function manualStep(direction) {
      // direction: +1 for next, -1 for prev (logical, not visual — RTL handled in applyTransform)
      if (manualAnimating || setWidth === 0) return;
      paused = true;
      manualAnimating = true;
      clearTimeout(resumeTimer);
      var start = offset;
      var delta = direction * step;
      var duration = 380;
      var startTime = null;

      function frame(ts) {
        if (!startTime) startTime = ts;
        var t = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        offset = start + delta * eased;
        applyTransform();
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          offset = ((offset % setWidth) + setWidth) % setWidth;
          applyTransform();
          manualAnimating = false;
          restartPauseTimer();
        }
      }
      requestAnimationFrame(frame);
    }

    var prevBtn = root.querySelector(".carousel-arrow-prev");
    var nextBtn = root.querySelector(".carousel-arrow-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { manualStep(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { manualStep(1); });

    root.addEventListener("mouseenter", function () { paused = true; });
    root.addEventListener("mouseleave", function () {
      clearTimeout(resumeTimer);
      paused = false;
    });
    root.addEventListener("focusin", function () { paused = true; });
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) {
        clearTimeout(resumeTimer);
        paused = false;
      }
    });

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    });

    root.classList.add("strip-carousel--js");
    measure();
    requestAnimationFrame(tick);
  }

  function init() {
    var strips = document.querySelectorAll(".strip-carousel");
    Array.prototype.forEach.call(strips, initStrip);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
