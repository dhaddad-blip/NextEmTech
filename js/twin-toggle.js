/**
 * Digital Twin view toggle — switches between Steering Committee and
 * Engineering Telemetry sample views. Static data, no backend.
 */
(function () {
  "use strict";

  function init() {
    var toggle = document.querySelector(".twin-toggle");
    if (!toggle) return;
    var buttons = Array.prototype.slice.call(toggle.querySelectorAll(".twin-toggle-btn"));
    var panels = Array.prototype.slice.call(document.querySelectorAll(".twin-view"));

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var view = btn.getAttribute("data-view");

        buttons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });

        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-view-panel") !== view;
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
