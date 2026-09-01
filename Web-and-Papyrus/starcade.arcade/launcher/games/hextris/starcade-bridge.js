"use strict";
(function () {
  let lastScore = -1;
  let lastState;

  function report() {
    const value = Math.max(0, Math.floor(Number(window.score) || 0));
    if (value !== lastScore) {
      lastScore = value;
      window.StarcadeHost?.score(value);
    }
    if (window.gameState === 2 && lastState !== 2) {
      window.StarcadeHost?.finish(value);
    }
    lastState = window.gameState;
    requestAnimationFrame(report);
  }

  addEventListener("DOMContentLoaded", function () {
    const social = document.getElementById("socialShare");
    const buttons = document.getElementById("buttonCont");
    if (social) social.remove();
    if (buttons) buttons.remove();
    document.querySelectorAll("a[href^='http'], a[href^='https']").forEach((link) => {
      link.removeAttribute("href");
      link.removeAttribute("target");
    });
    window.StarcadeHost?.ready({ title: "Hextris", version: "1.1-starcade" });
    requestAnimationFrame(report);
  });
})();
