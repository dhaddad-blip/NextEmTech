/**
 * Slide-out drawer menu — toggle, backdrop click, Escape key, focus handling.
 */
(function () {
  "use strict";

  function init() {
    var toggle = document.querySelector(".menu-toggle");
    var drawer = document.getElementById("side-drawer");
    var backdrop = document.getElementById("side-drawer-backdrop");
    var closeBtn = document.querySelector(".side-drawer-close");
    if (!toggle || !drawer || !backdrop) return;

    function open() {
      drawer.classList.add("open");
      backdrop.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      toggle.focus();
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
