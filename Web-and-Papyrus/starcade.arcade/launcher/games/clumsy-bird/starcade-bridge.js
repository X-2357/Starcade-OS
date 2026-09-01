"use strict";
(function () {
  if (!window.StarcadeHost) return;

  StarcadeHost.ready({ title: "Clumsy Bird" });

  // Clumsy Bird (melonJS) keeps its run score in the plain global `game.data.steps`
  // (incremented on each pipe cleared - see js/entities/entities.js BirdEntity
  // onCollision) and enters the melonJS `me.state.GAME_OVER` state once the bird
  // dies (see js/game.js and js/screens/gameover.js). Both are verified, stable
  // globals exposed by the game itself, so we poll them rather than touch any
  // internal engine object.
  var reportedThisRun = false;

  function poll() {
    try {
      if (window.game && window.game.data) {
        var value = Math.max(0, Math.floor(Number(window.game.data.steps) || 0));
        StarcadeHost.score(value);
      }
      if (window.me && window.me.state && typeof window.me.state.isCurrent === "function") {
        var isGameOver = window.me.state.isCurrent(window.me.state.GAME_OVER);
        if (isGameOver && !reportedThisRun) {
          reportedThisRun = true;
          var finalScore = (window.game && window.game.data) ? window.game.data.steps : 0;
          StarcadeHost.finish(Math.max(0, Math.floor(Number(finalScore) || 0)));
        } else if (!isGameOver) {
          reportedThisRun = false;
        }
      }
    } catch (e) {
      // Never let bridge polling break the game.
    }
    requestAnimationFrame(poll);
  }

  requestAnimationFrame(poll);
})();
