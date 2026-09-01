"use strict";
(function () {
  if (!window.StarcadeHost) return;

  StarcadeHost.ready({ title: "Micropolis" });

  // Micropolis is an open-ended sandbox with no defined win/lose state or run boundary,
  // unlike every other Starcade game - it deliberately never calls StarcadeHost.finish(),
  // so it never enters the arcade leaderboard/XP system. Population is reported purely as
  // a live HUD readout via StarcadeHost.score(). Saving is handled entirely by Micropolis's
  // own built-in Save/Load (backed by this page's own localStorage), independent of
  // Starcade's own per-game save slot.
  var lastPopulation = -1;
  setInterval(function () {
    var el = document.getElementById("population");
    if (!el) return;
    var population = parseInt(String(el.textContent).replace(/[^0-9]/g, ""), 10);
    if (!isNaN(population) && population !== lastPopulation) {
      lastPopulation = population;
      StarcadeHost.score(population);
    }
  }, 2000);
})();
