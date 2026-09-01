"use strict";
(function () {
  if (!window.StarcadeHost) return;

  StarcadeHost.ready({ title: "Mah Jong" });

  // Mah Jong manages its own save/progress state entirely internally (backed
  // by this page's own localStorage, same mechanism every Starcade game
  // already relies on for file://-safe persistence). Starcade does not yet
  // read a live score/tiles-remaining readout from its Angular component
  // tree - there's no simple, stable DOM hook for it the way Micropolis
  // exposes #population, and guessing at one risked shipping something
  // fragile. StarcadeHost.finish()/leaderboard/XP participation is left for
  // a future pass once a real hook is identified.
})();
