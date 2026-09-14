/**
 * Contact form — mailto-prefill. No backend, no data leaves the browser:
 * on submit we build a mailto: link from the field values and hand off
 * to the user's own email client. Localized strings come from data-*
 * attributes on the <form> so this one file serves both EN and AR pages.
 */
(function () {
  "use strict";

  function init() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var note = document.getElementById("cf-note");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var topic = form.elements["topic"].value;
      var message = form.elements["message"].value.trim();

      if (!name || !email || !message) {
        if (note) note.textContent = form.getAttribute("data-required-msg") || "Please fill in all fields.";
        return;
      }
      if (note) note.textContent = "";

      var prefix = form.getAttribute("data-subject-prefix") || "Inquiry";
      var lblName = form.getAttribute("data-label-name") || "Name";
      var lblEmail = form.getAttribute("data-label-email") || "Email";
      var lblTopic = form.getAttribute("data-label-topic") || "Topic";

      var subject = prefix + " (" + topic + ") \u2014 nextmtech.com";
      var bodyLines = [
        lblName + ": " + name,
        lblEmail + ": " + email,
        lblTopic + ": " + topic,
        "",
        message
      ];

      var mailto = "mailto:info@nextmtech.com"
        + "?subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
