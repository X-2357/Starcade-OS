"use strict";

// Starcade launcher polish (stage 1). Observes the launcher; changes nothing it owns.
// Event-driven only: no timers, no animation-frame loop. If anything is missing it does nothing.
(function () {
  try {
    const $ = (id) => document.getElementById(id);
    const shell = $("shell"), grid = $("gameGrid"), player = $("player");
    if (!shell || !grid) return;
    let cameFromPlayer = true;   // true at first load, so the library gets its intro
    let lastKey = "";

    function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

    // 1. Which view is showing. Created BEFORE the grid observer: observers are notified in creation order,
    //    so on return from a game this runs first and the grid redraw that follows sees cameFromPlayer.
    if (player) {
      let wasInGame = false;
      const syncView = () => {
        const inGame = !player.classList.contains("hidden");
        if (wasInGame && !inGame) cameFromPlayer = true;
        wasInGame = inGame;
        shell.dataset.view = inGame ? "player" : "library";
      };
      new MutationObserver(syncView).observe(player, { attributes: true, attributeFilter: ["class"] });
      syncView();
    }

    // 2. Card entrance. The launcher redraws every card on every native state push, so the entrance is
    //    gated: it plays only when the filter/game list changed or the library is shown again after a game.
    function onGrid() {
      const cards = Array.from(grid.children);
      cards.forEach((card, i) => card.style.setProperty("--i", String(i)));
      const filter = (document.querySelector(".filter.active") || {}).dataset?.filter || "";
      const key = filter + "|" + cards.map((card) => (card.querySelector("h3") || {}).textContent || "").join("|");
      const play = cards.length > 0 && (key !== lastKey || cameFromPlayer);
      lastKey = key;
      cameFromPlayer = false;
      grid.classList.remove("enter");
      if (play) restart(grid, "enter");
    }
    new MutationObserver(onGrid).observe(grid, { childList: true });
    grid.addEventListener("animationend", (event) => {
      if (event.animationName !== "cardIn" || !event.target.classList.contains("game-card")) return;
      const last = Math.min(grid.children.length - 1, 12);
      if (Number(event.target.style.getPropertyValue("--i")) >= last) grid.classList.remove("enter");
    });
    onGrid();

    // 2b. Pointer spotlight: the hovered card gets --mx/--my (CSS draws the glow). Mouse only; one card at a time.
    grid.addEventListener("pointermove", (event) => {
      const card = event.target.closest ? event.target.closest(".game-card") : null;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", (event.clientX - box.left) + "px");
      card.style.setProperty("--my", (event.clientY - box.top) + "px");
    });
    grid.addEventListener("pointerout", (event) => {
      const card = event.target.closest ? event.target.closest(".game-card") : null;
      if (card && !card.contains(event.relatedTarget)) { card.style.removeProperty("--mx"); card.style.removeProperty("--my"); }
    });

    // 3. Text panels slide in, but only when their text actually changed.
    function watchText(el) {
      if (!el) return;
      let last = el.textContent;
      new MutationObserver(() => {
        const now = el.textContent;
        if (now !== last) { last = now; restart(el, "flash"); }
      }).observe(el, { childList: true, characterData: true, subtree: true });
    }
    watchText($("details"));
    watchText($("categoryTitle"));

    // 4. The equaliser follows the real audio element, not the on/off setting.
    const audio = $("musicPlayer"), musicButton = $("musicToggle");
    if (audio && musicButton) {
      const on = () => musicButton.classList.add("is-playing");
      const off = () => musicButton.classList.remove("is-playing");
      audio.addEventListener("playing", on);
      ["pause", "ended", "emptied", "error"].forEach((name) => audio.addEventListener(name, off));
      if (!audio.paused && !audio.ended) on();
    }
  } catch (error) {
    // Cosmetic layer only: never let it affect the launcher.
  }
})();
