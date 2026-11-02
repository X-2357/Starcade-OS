"use strict";
(function (root) {
  const cards = [
    ["Surveyor", 3, 6, 2, 4], ["Courier", 5, 2, 6, 3],
    ["Bulwark", 7, 1, 4, 3], ["Wayfarer", 4, 4, 4, 4],
    ["Interceptor", 2, 7, 3, 5], ["Prospector", 6, 3, 5, 2],
    ["Beacon", 1, 5, 7, 4], ["Pathfinder", 4, 6, 1, 6],
    ["Sentinel", 5, 3, 6, 2], ["Nomad", 3, 5, 4, 5]
  ];
  // Card edges: north, east, south, west. Ownership never changes the edges.
  function create(seed, first) {
    if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff || ![0, 1].includes(first)) throw Error("Invalid deal");
    let n = seed >>> 0;
    const deck = cards.map((_, i) => i);
    for (let i = deck.length - 1; i > 0; i--) {
      n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
      const j = n % (i + 1); [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return { seed, first, turn: first, board: Array(9).fill(null), hands: [deck.slice(0, 5), deck.slice(0, 5)], moves: [] };
  }
  function captures(state, card, cell, owner) {
    const row = Math.floor(cell / 3), col = cell % 3;
    const neighbors = [row > 0 ? cell - 3 : -1, col < 2 ? cell + 1 : -1, row < 2 ? cell + 3 : -1, col > 0 ? cell - 1 : -1];
    return neighbors.filter((pos, edge) => pos >= 0 && state.board[pos] && state.board[pos].owner !== owner && cards[card][edge + 1] > cards[state.board[pos].card][(edge + 2) % 4 + 1]);
  }
  function play(state, hand, cell) {
    if (!Number.isInteger(hand) || !Number.isInteger(cell) || cell < 0 || cell > 8 || state.board[cell] || state.moves.length >= 9) throw Error("Illegal position");
    const owner = state.turn, card = state.hands[owner][hand];
    if (card === undefined) throw Error("Missing card");
    const taken = captures(state, card, cell, owner);
    state.hands[owner].splice(hand, 1);
    state.board[cell] = { card, owner };
    taken.forEach(pos => { state.board[pos].owner = owner; });
    state.moves.push([hand, cell]); state.turn = 1 - owner;
    return taken;
  }
  function scores(state) {
    return [0, 1].map(owner => state.hands[owner].length + state.board.filter(c => c && c.owner === owner).length);
  }
  function choose(state) {
    let best = null, value = -Infinity;
    state.hands[state.turn].forEach((card, hand) => state.board.forEach((occupied, cell) => {
      if (occupied) return;
      const r = Math.floor(cell / 3), c = cell % 3;
      const protectedEdges = (r === 0 ? cards[card][3] : 0) + (r === 2 ? cards[card][1] : 0) + (c === 0 ? cards[card][2] : 0) + (c === 2 ? cards[card][4] : 0);
      const rank = captures(state, card, cell, state.turn).length * 100 + protectedEdges;
      if (rank > value) { value = rank; best = [hand, cell]; }
    }));
    return best;
  }
  function pack(state) { return { schema: 1, seed: state.seed, first: state.first, moves: state.moves.map(m => m.slice()) }; }
  function restore(value) {
    if (!value || value.schema !== 1 || !Array.isArray(value.moves) || value.moves.length > 9) throw Error("Unsupported save");
    const state = create(value.seed, value.first);
    for (const move of value.moves) {
      if (!Array.isArray(move) || move.length !== 2) throw Error("Invalid move");
      play(state, ...move);
    }
    return state;
  }
  function report(state) {
    const replay = create(state.seed, state.first), totals = [0, 0];
    let best = { count: 0, name: "No captures", space: 0 }, last = "";
    for (const [hand, cell] of state.moves) {
      const owner = replay.turn, name = cards[replay.hands[owner][hand]][0];
      const taken = play(replay, hand, cell);
      totals[owner] += taken.length;
      if (owner === 0 && taken.length > best.count) best = { count: taken.length, name, space: cell + 1 };
      if (owner === 1) last = `Rival placed ${name} in space ${cell + 1}, capturing ${taken.length}.`;
    }
    return { totals, best, last };
  }
  root.ConstellationRules = { cards, create, captures, play, scores, choose, pack, restore, report };
})(globalThis);
