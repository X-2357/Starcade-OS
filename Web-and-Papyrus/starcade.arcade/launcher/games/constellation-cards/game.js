"use strict";
(() => {
  const R = ConstellationRules, H = StarcadeHost, key = "starcade.constellation-cards.match.v1";
  const $ = id => document.getElementById(id);
  let state, selected = null, zone = "hand", cursor = 0, armed = false, loaded = false;
  function persist() {
    const data = R.pack(state);
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) { $("notice").textContent = "Local save unavailable. Keep this duel open to finish it."; }
    H.save(data);
  }
  function fresh() {
    const random = crypto.getRandomValues(new Uint32Array(2));
    state = R.create(random[0], random[1] % 2); selected = null; armed = false; zone = "hand"; cursor = 0;
    $("confirm").hidden = true; H.score(0); advance(false);
  }
  function markup(card) {
    const c = R.cards[card];
    return `<span class="card"><strong>${c[0]}</strong><b class="north">${c[1]}</b><b class="east">${c[2]}</b><b class="south">${c[3]}</b><b class="west">${c[4]}</b></span>`;
  }
  function render() {
    const [you, rival] = R.scores(state), done = state.moves.length === 9;
    const report = R.report(state);
    $("preview").textContent = report.last || "Both captains receive the same five ships. First player is chosen at random.";
    $("debrief").textContent = done ? `You made ${report.totals[0]} captures; your rival made ${report.totals[1]}. ${report.best.count ? `Your strongest move: ${report.best.name} in space ${report.best.space}, capturing ${report.best.count}.` : "You made no captures. Look for touching edges you can beat next duel."} The final unplayed card counts toward control.` : "";
    $("status").textContent = done ? `${you > rival ? "Victory" : you < rival ? "Defeat" : "Draw"} — ${you} to ${rival}. New duel for a rematch.` : selected === null ? "Your turn — choose a ship card." : "Choose an empty space. Gold outlines show captures.";
    $("score").textContent = `YOU ${you} · RIVAL ${rival}`;
    $("opponent").textContent = `${state.hands[1].length} cards remaining. Teal: yours. Rose: opponent.`;
    $("hand").replaceChildren();
    state.hands[0].forEach((card, i) => {
      const b = document.createElement("button"); b.innerHTML = markup(card); b.disabled = done;
      b.dataset.index = i; b.className = selected === i ? "selected" : "";
      b.setAttribute("aria-label", `${R.cards[card][0]}, north ${R.cards[card][1]}, east ${R.cards[card][2]}, south ${R.cards[card][3]}, west ${R.cards[card][4]}`);
      b.onclick = () => { selected = i; zone = "board"; cursor = state.board.findIndex(c => !c); render(); focus(); };
      $("hand").append(b);
    });
    $("board").replaceChildren();
    state.board.forEach((placed, i) => {
      const b = document.createElement("button"); b.dataset.index = i;
      b.innerHTML = placed ? markup(placed.card) : `<span>${i + 1}</span>`;
      b.className = placed ? placed.owner === 0 ? "yours" : "enemy" : "";
      b.disabled = done; // Occupied spaces remain focusable for board inspection.
      const count = !placed && selected !== null ? R.captures(state, state.hands[0][selected], i, 0).length : 0;
      if (count) { b.classList.add("preview"); b.title = `Captures ${count}`; }
      b.setAttribute("aria-label", `Space ${i + 1}: ${placed ? `${placed.owner === 0 ? "your" : "opponent"} ${R.cards[placed.card][0]}` : `empty, captures ${count}`}`);
      b.onfocus = () => { $("preview").textContent = placed ? `Space ${i + 1}: ${placed.owner === 0 ? "your" : "rival"} ${R.cards[placed.card][0]}.` : selected === null ? "Choose a ship from your flight deck first." : `Place ${R.cards[state.hands[0][selected]][0]} in space ${i + 1}: ${count} captures.`; };
      b.onclick = () => {
        if (placed || selected === null || done) return;
        R.play(state, selected, i); selected = null; persist(); advance(true); focus();
      };
      $("board").append(b);
    });
  }
  function advance(report) {
    if (state.turn === 1 && state.moves.length < 9) R.play(state, ...R.choose(state));
    zone = "hand"; cursor = 0; persist(); render();
    if (state.moves.length === 9) H.score(R.scores(state)[0] * 100);
    if (report && state.moves.length === 9) H.finish(R.scores(state)[0] * 100);
  }
  function focus() {
    const controls = [...$(zone).querySelectorAll("button:not(:disabled)")];
    (controls[cursor] || $("new")).focus();
  }
  function load(value) {
    if (loaded) return; loaded = true;
    try {
      let saved = value;
      if (!saved) { try { saved = JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { $("notice").textContent = "Unreadable local save. Starting a fresh duel."; } }
      if (!saved) { fresh(); return; }
      state = R.restore(saved); advance(false);
    } catch (_) { $("notice").textContent = "This save could not be restored. Starting a fresh duel."; fresh(); }
  }
  $("new").onclick = () => {
    if (!state) return;
    if (state.moves.length > 0 && state.moves.length < 9 && !armed) { armed = true; $("confirm").hidden = false; return; }
    fresh(); focus();
  };
  $("exit").onclick = () => { persist(); H.exit(); };
  addEventListener("keydown", e => {
    if (!state || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key.toLowerCase() === "x") { e.preventDefault(); selected = null; zone = "hand"; cursor = 0; render(); focus(); return; }
    if (e.key.toLowerCase() === "y") { e.preventDefault(); if (!e.repeat) $("new").click(); return; }
    if (e.key === "Escape") { persist(); return; }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(e.key)) return;
    if (e.repeat) { e.preventDefault(); return; }
    const active = document.activeElement;
    if (active === $("new") || active === $("exit")) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); active.click(); return; }
    }
    e.preventDefault();
    if (e.key === "Enter" || e.key === " ") { if (active?.matches("#hand button,#board button")) active.click(); else focus(); return; }
    if (active?.parentElement?.id === "board") { zone = "board"; cursor = Number(active.dataset.index); }
    else if (active?.parentElement?.id === "hand") { zone = "hand"; cursor = Number(active.dataset.index); }
    const length = zone === "board" ? 9 : state.hands[0].length;
    const delta = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" ? zone === "board" ? -3 : -1 : zone === "board" ? 3 : 1;
    cursor = (cursor + delta + length) % length; focus();
  });
  H.onLoad(load);
  // Standalone browser play has no parent host to answer ready.
  if (parent === window) load(null);
  H.ready({ title: "Constellation Cards" });
})();
