"use strict";
(function () {
  if (!window.StarcadeHost) return;

  StarcadeHost.ready({ title: "Quadrilactic" });

  // Quadrilactic keeps its score in an internal Scoreboard class inside its
  // bundled TypeScript/webpack output, rendered straight to the shared
  // <canvas id="viewport"> - there is no plain DOM element (like a <span>)
  // exposing the live score to poll. Guessing at internal bundle state
  // risked shipping something fragile, so StarcadeHost.finish()/leaderboard/
  // XP participation is left for a future pass once a real hook is found.
})();
