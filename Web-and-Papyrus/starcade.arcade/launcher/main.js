"use strict";

(function () {
  const games = window.STARCADE_GAMES || [];
  const $ = (id) => document.getElementById(id);
  const grid = $("gameGrid");
  const library = $("library");
  const player = $("player");
  const frame = $("gameFrame");
  let filter = "all";
  let selected = 0;
  let current = null;
  let currentScore = 0;
  let runFinished = false;
  let leaderboardGame = 0;
  let nativeState = { games: {}, achievements: [] };
  let externalState = {};
  const padHeld = new Set();
  let stickHeld = new Set();
  let backTimer = 0;
  let xpToastTimer = 0;
  let lastXPToast = { amount:0, time:0 };

  // Curated attribution for the bundled tracks (see audio/music/SOURCE-AND-LICENSES.txt).
  // Any .mp3 dropped into audio/music/ that isn't listed here still plays fine - its
  // title is just derived from the filename instead of a curated one.
  const KNOWN_TRACK_INFO = {
    "arpmedia-retro-arcade-game-music-577821.mp3": { title:"Retro Arcade Game Music", artist:"arpmedia" },
    "arthurhale-8bit-video-game-music-289970.mp3": { title:"8-Bit Video Game Music", artist:"ArthurHale" },
    "boons_freak-future-8bit-174447.mp3": { title:"Future 8-Bit", artist:"Boons Freak" },
    "brutaldesign-pixel-art-481480.mp3": { title:"Pixel Art", artist:"BrutalDesign" },
    "djartmusic-8-bit-console-from-my-childhood-301286.mp3": { title:"8-Bit Console From My Childhood", artist:"DjArtMusic" },
    "djartmusic-best-game-console-301284.mp3": { title:"Best Game Console", artist:"DjArtMusic" },
    "djartmusic-fun-with-my-8-bit-game-301278.mp3": { title:"Fun With My 8-Bit Game", artist:"DjArtMusic" },
    "djartmusic-my-8-bit-hero-301280.mp3": { title:"My 8-Bit Hero", artist:"DjArtMusic" },
    "djartmusic-return-to-the-8-bit-past-301282.mp3": { title:"Return To The 8-Bit Past", artist:"DjArtMusic" },
    "djartmusic-so-happy-with-my-8-bit-game-301275.mp3": { title:"So Happy With My 8-Bit Game", artist:"DjArtMusic" },
    "djartmusic-the-return-of-the-8-bit-era-301292.mp3": { title:"The Return Of The 8-Bit Era", artist:"DjArtMusic" },
    "djartmusic-the-world-of-8-bit-games-301273.mp3": { title:"The World Of 8-Bit Games", artist:"DjArtMusic" },
    "djlofi-pixel-dreams-259187.mp3": { title:"Pixel Dreams", artist:"DjLofi" },
    "kaden_cook-8-bit-dungeon-251388.mp3": { title:"8-Bit Dungeon", artist:"Kaden Cook" },
    "lofiewme-pixel-fantasia-355123.mp3": { title:"Pixel Fantasia", artist:"LofiEwme" },
    "monume-retro-arcade-game-music-577980.mp3": { title:"Retro Arcade Game Music", artist:"Monume" },
    "moodmode-a-video-game-248444.mp3": { title:"A Video Game", artist:"MoodMode" },
    "moodmode-level-iii-294428.mp3": { title:"Level III", artist:"MoodMode" },
    "niknet_art-retro-8bit-happy-adventure-videogame-music-246635.mp3": { title:"Retro 8-Bit Happy Adventure I", artist:"Niknet Art" },
    "niknet_art-retro-8bit-happy-adventure-videogame-music-246636.mp3": { title:"Retro 8-Bit Happy Adventure II", artist:"Niknet Art" },
    "niknet_art-retro-8bit-happy-adventure-videogame-music-246638.mp3": { title:"Retro 8-Bit Happy Adventure III", artist:"Niknet Art" },
    "niknet_art-retro-8bit-happy-adventure-videogame-music-246639.mp3": { title:"Retro 8-Bit Happy Adventure IV", artist:"Niknet Art" },
    "niknet_art-retro-8bit-happy-videogame-music-243997.mp3": { title:"Retro 8-Bit Happy Video Game I", artist:"Niknet Art" },
    "niknet_art-retro-8bit-happy-videogame-music-246631.mp3": { title:"Retro 8-Bit Happy Video Game II", artist:"Niknet Art" },
    "niknet_art-retro-8bit-happy-videogame-music-418482.mp3": { title:"Retro 8-Bit Happy Video Game III", artist:"Niknet Art" },
    "nocopyrightsound633-8-bit-music-no-copyright-background-instrumental-pixel-party-322342.mp3": { title:"Pixel Party", artist:"NoCopyrightSounds633" },
    "nocopyrightsound633-arcade-beat-323176.mp3": { title:"Arcade Beat", artist:"NoCopyrightSounds633" },
    "thatlofishow-pixelate-pixelated-dreams-313358.mp3": { title:"Pixelated Dreams", artist:"ThatLofiShow" }
  };
  function titleFromFilename(file) {
    let name = file.replace(/\.mp3$/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    name = name.replace(/\s+\d{5,}$/, "");
    return name.replace(/\b\w/g, (c) => c.toUpperCase()) || file;
  }
  function trackInfo(file) {
    return KNOWN_TRACK_INFO[file] || { title: titleFromFilename(file), artist: "" };
  }

  const musicPlayer = $("musicPlayer");
  const musicToggleButton = $("musicToggle");
  const musicVolumeSlider = $("musicVolume");
  let musicTracks = [];
  let musicOrder = [];
  let musicPos = 0;
  let musicEnabled = localStorage.getItem("starcade.music.enabled") === "true";
  const savedVolume = parseFloat(localStorage.getItem("starcade.music.volume"));
  musicPlayer.volume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.45;
  if (musicVolumeSlider) musicVolumeSlider.value = String(Math.round(musicPlayer.volume * 100));

  function buildMusicTracks(files) {
    musicTracks = (files || []).map((file) => ({ file, ...trackInfo(file) }));
    musicOrder = musicTracks.map((_, i) => i);
    for (let i = musicOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [musicOrder[i], musicOrder[j]] = [musicOrder[j], musicOrder[i]];
    }
    musicPos = 0;
    musicPlayer.removeAttribute("src");
    if (musicEnabled && musicTracks.length) armAutoplayOnFirstGesture();
  }
  // Fallback when the native file-listing bridge isn't available (e.g. standalone
  // browser testing outside the real OSF UI host) - use the known bundled files.
  function useFallbackTrackList() {
    if (musicTracks.length) return;
    buildMusicTracks(Object.keys(KNOWN_TRACK_INFO));
  }

  function updateMusicButton() {
    musicToggleButton.classList.toggle("on", musicEnabled);
    musicToggleButton.innerHTML = musicEnabled ? "&#9834; MUSIC ON" : "&#9834; MUSIC OFF";
  }
  function loadCurrentTrack() {
    if (!musicTracks.length) return;
    const track = musicTracks[musicOrder[musicPos]];
    musicPlayer.src = `audio/music/${track.file}`;
  }
  function playMusicNow() {
    if (!musicTracks.length) return;
    if (!musicPlayer.src) loadCurrentTrack();
    musicPlayer.play().catch(() => {});
  }
  function armAutoplayOnFirstGesture() {
    const start = () => { if (musicEnabled) playMusicNow(); };
    document.addEventListener("pointerdown", start, { once:true });
    document.addEventListener("keydown", start, { once:true });
  }
  function setMusicEnabled(next) {
    musicEnabled = next;
    localStorage.setItem("starcade.music.enabled", String(musicEnabled));
    updateMusicButton();
    if (musicEnabled) playMusicNow(); else musicPlayer.pause();
  }
  function stepTrack(delta) {
    if (!musicOrder.length) return;
    musicPos = (musicPos + delta + musicOrder.length) % musicOrder.length;
    loadCurrentTrack();
    if (musicEnabled) playMusicNow();
  }
  function setMusicVolume(next) {
    const volume = Math.min(1, Math.max(0, next));
    musicPlayer.volume = volume;
    localStorage.setItem("starcade.music.volume", String(volume));
  }
  musicPlayer.addEventListener("ended", () => stepTrack(1));
  updateMusicButton();

  function showXP(result) {
    const amount = Math.max(0, Math.floor(Number(result?.amount) || 0));
    if (!amount) return;
    const now = Date.now();
    if (amount === lastXPToast.amount && now - lastXPToast.time < 1500) return;
    lastXPToast = { amount, time:now };
    const toast = $("xpToast");
    const total = Math.max(0, Math.floor(Number(result?.total) || 0));
    toast.textContent = `+${amount} XP EARNED${total ? ` \u00b7 STARCADE TOTAL ${total}` : ""}`;
    toast.classList.add("visible");
    clearTimeout(xpToastTimer);
    xpToastTimer = setTimeout(() => toast.classList.remove("visible"), 3500);
  }

  function filteredGames() { return games.filter((g) => filter === "all" || g.category === filter); }
  function scoreKey(id) { return `starcade.score.${id}`; }
  function recentKey(id) { return `starcade.recent.${id}`; }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]); }
  function playerName() { return String(nativeState.playerName || "PLAYER").trim() || "PLAYER"; }
  function localRecent(id) {
    try { return JSON.parse(localStorage.getItem(recentKey(id)) || "[]").map(Number).filter(Number.isFinite).slice(-10); }
    catch { return []; }
  }
  function getBest(id) {
    const nativeBest = Number(nativeState.games?.[id]?.highScore) || 0;
    const localBest = Number(localStorage.getItem(scoreKey(id))) || 0;
    return Math.max(nativeBest, localBest);
  }
  function setBest(id, value) {
    if (value > getBest(id)) localStorage.setItem(scoreKey(id), String(value));
    if (osfui.available()) osfui.send("starcade.arcade.score.submit", { game:id, score:value });
  }
  function recordFinishedRun(id, value) {
    const score = Math.max(0, Math.floor(Number(value) || 0));
    const game = games.find((candidate) => candidate.id === id);
    const oldBest = getBest(id);
    const nativeRecent = nativeState.games?.[id]?.recentScores;
    const prior = Array.isArray(nativeRecent) ? nativeRecent.map(Number).filter(Number.isFinite) : localRecent(id);
    const recent = [...prior, score].slice(-10);
    localStorage.setItem(recentKey(id), JSON.stringify(recent));
    localStorage.setItem(scoreKey(id), String(Math.max(getBest(id), score)));
    nativeState.games ||= {};
    const entry = nativeState.games[id] ||= {};
    entry.highScore = Math.max(Number(entry.highScore) || 0, score);
    entry.recentScores = recent;
    entry.completedRuns = (Number(entry.completedRuns) || 0) + 1;
    const rivalScores = game ? companionScores(game).map((rival) => rival.score) : [];
    const rank = 1 + rivalScores.filter((rivalScore) => rivalScore > score).length;
    if (osfui.available()) osfui.send("starcade.arcade.run.finish", {
      game:id, score, rank, category:game?.category || "", oldBest
    });
  }
  function stableHash(value) {
    let hash = 2166136261;
    for (const ch of String(value)) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619) >>> 0;
    return hash;
  }
  function companionScores(game) {
    const hash = stableHash(game.id);
    const base = Math.max(2400, Number(game.seedScore) || (4200 + hash % 4800));
    const rivals = [
      ["Sarah Morgan", {strategy:1.10,puzzle:1.07,arcade:.98}],
      ["Andreja", {arcade:1.10,strategy:1.06,puzzle:.98}],
      ["Barrett", {puzzle:1.11,arcade:1.04,strategy:1.00}],
      ["Sam Coe", {arcade:1.08,strategy:1.03,puzzle:.97}],
      ["Cora Coe", {puzzle:1.13,strategy:1.04,arcade:1.00}],
      ["Walter Stroud", {strategy:1.12,puzzle:1.00,arcade:.94}],
      ["Noel", {puzzle:1.12,strategy:1.02,arcade:.96}],
      ["Adoring Fan", {arcade:1.13,puzzle:.95,strategy:.92}],
      ["Vladimir Sall", {strategy:1.09,arcade:1.05,puzzle:1.01}],
      ["Matteo", {puzzle:1.08,strategy:1.07,arcade:.99}]
    ];
    return rivals.map(([name,skills]) => {
      const mixed = stableHash(`${game.id}:${name}`);
      const categorySkill = Number(skills[game.category]) || 1;
      const gameAffinity = .87 + (mixed % 2801) / 10000;
      const score = Math.max(100, Math.floor(base * categorySkill * gameAffinity));
      return { name, score, seeded:true };
    });
  }
  function showLeaderboard() {
    const game = games[leaderboardGame]; if (!game) return;
    const nativeRecent = nativeState.games?.[game.id]?.recentScores;
    const recent = (Array.isArray(nativeRecent) ? nativeRecent : localRecent(game.id)).map(Number).filter(Number.isFinite).slice(-10).reverse();
    const character = playerName();
    const player = recent.map((score,i) => ({ name:i===0?`${character} · LATEST`:character, score, player:true }));
    const top = [...companionScores(game),...player].sort((a,b)=>b.score-a.score).slice(0,10);
    $("leaderboardTitle").textContent = `${game.title} · Top 10`;
    $("leaderboardTop").innerHTML = top.map((r,i)=>`<div class="score-row${r.player?" player-score":""}"><span class="rank">${String(i+1).padStart(2,"0")}</span><span>${escapeHtml(r.name)}${r.seeded?" · RIVAL":""}</span><span class="score">${r.score.toLocaleString()}</span></div>`).join("") || "<p>No completed runs yet.</p>";
    $("leaderboardRecent").innerHTML = recent.map((score,i)=>`<div class="score-row player-score"><span class="rank">${String(i+1).padStart(2,"0")}</span><span>${escapeHtml(character)}</span><span class="score">${score.toLocaleString()}</span></div>`).join("") || "<p>Finish a run to create your history.</p>";
    $("leaderboard").classList.remove("hidden");
  }

  function render() {
    const list = filteredGames();
    selected = Math.max(0, Math.min(selected, list.length - 1));
    grid.innerHTML = "";
    list.forEach((game, index) => {
      const card = document.createElement("button");
      card.className = "game-card" + (index === selected ? " selected" : "");
      card.style.setProperty("--card", game.color);
      card.innerHTML = `<span class="card-mark">${String(index + 1).padStart(2,"0")}</span><span class="card-body"><small>${game.category.toUpperCase()}</small><h3>${game.title}</h3><p>${game.description}</p></span>`;
      card.onclick = () => launch(game);
      card.onfocus = () => { selected = index; updateDetails(); };
      grid.appendChild(card);
    });
    $("gameCount").textContent = `${list.length} INSTALLED`;
    $("categoryTitle").textContent = filter === "all" ? "All Games" : filter[0].toUpperCase() + filter.slice(1);
    updateDetails();
  }

  function updateDetails() {
    const game = filteredGames()[selected];
    if (!game) { $("details").textContent = "No games installed in this category."; return; }
    const status = game.external
      ? `<br>${externalState[game.external]?.installed ? "READY TO LAUNCH" : "INSTALLATION CHECK REQUIRED"}`
      : `<br>PERSONAL BEST: ${String(getBest(game.id)).padStart(6,"0")}`;
    $("details").innerHTML = `<strong>${game.title}</strong> · ${game.controls}${status}`;
    [...grid.children].forEach((el, i) => el.classList.toggle("selected", i === selected));
  }

  function launch(game) {
    if (game.external) {
      $("statusText").textContent = `CHECKING ${game.title.toUpperCase()}`;
      if (osfui.available()) osfui.send("starcade.arcade.external.launch", { id:game.external });
      else $("statusText").textContent = "NATIVE LAUNCH SERVICE UNAVAILABLE";
      return;
    }
    musicPlayer.pause();
    current = game;
    currentScore = 0;
    runFinished = false;
    $("playerTitle").textContent = game.title.toUpperCase();
    $("scoreLabel").textContent = "SCORE 000000";
    frame.src = game.entry;
    if (osfui.available()) osfui.send("starcade.arcade.score.submit", { game:game.id, title:game.title, score:0, newRun:true });
    library.classList.add("hidden");
    player.classList.remove("hidden");
    $("statusText").textContent = "APPLICATION RUNNING";
    setRawGamepad(true);
    frame.focus();
  }

  function closeGame() {
    releaseControllerInputs();
    setRawGamepad(false);
    if (current && current.category === "casino" && osfui.available()) {
      osfui.send("starcade.arcade.credits.transaction", { game:current.id, action:"cancel", amount:0, requestId:`cancel-${Date.now()}-${Math.random().toString(16).slice(2)}` });
    }
    frame.src = "about:blank";
    current = null;
    player.classList.add("hidden");
    library.classList.remove("hidden");
    $("statusText").textContent = "LOCAL LIBRARY ONLINE";
    if (musicEnabled) playMusicNow();
    render();
    const card = grid.children[selected]; if (card) card.focus();
  }

  function setRawGamepad(raw) {
    if (osfui.available()) osfui.send("osfui.gamepadRaw", { raw:Boolean(raw) });
  }
  function sendGameInput(key, down) {
    if (current && frame.contentWindow) frame.contentWindow.postMessage({ channel:"starcade", type:"input", value:{ key, down:Boolean(down) } }, "*");
  }
  function mappedButton(id) {
    if (id === 0x1000) return current?.id === "freedoom" ? " " : "Enter";
    if (id === 0x4000) return current?.id === "freedoom" ? "e" : current?.id === "starfall-blocks" ? "c" : current?.id === "hextris" ? "p" : "x";
    if (id === 0x8000) return current?.id === "starfall-blocks" ? "p" : current?.id === "minefield-protocol" ? "c" : "y";
    if (id === 0x0010) return current?.id === "freedoom" ? "q" : "Enter";
    return ({1:"ArrowUp",2:"ArrowDown",4:"ArrowLeft",8:"ArrowRight",256:"Shift",512:"Control"})[id] || "";
  }
  function handleGamepad(payload) {
    if (!current || !payload) return;
    if (payload.kind === "button" && payload.button) {
      const id=Number(payload.button.id), down=Boolean(payload.button.down);
      if (id === 0x2000) {
        if (current?.id !== "freedoom") { if(down) closeGame(); return; }
        if (down && !backTimer) backTimer = setTimeout(() => { backTimer=0; if(current) closeGame(); }, 1200);
        else if (!down && backTimer) { clearTimeout(backTimer); backTimer=0; }
        return;
      }
      const key=mappedButton(id); if (!key) return;
      const token=`b${id}`;
      if (down && !padHeld.has(token)) { padHeld.add(token); sendGameInput(key,true); }
      else if (!down && padHeld.delete(token)) sendGameInput(key,false);
    } else if (payload.kind === "stick" && payload.axes) {
      const x=Number(payload.axes.lx)||0, y=Number(payload.axes.ly)||0, next=new Set();
      if(x<-.35)next.add("ArrowLeft"); if(x>.35)next.add("ArrowRight");
      if(y>.35)next.add("ArrowUp"); if(y<-.35)next.add("ArrowDown");
      stickHeld.forEach((key)=>{if(!next.has(key))sendGameInput(key,false)});
      next.forEach((key)=>{if(!stickHeld.has(key))sendGameInput(key,true)});
      stickHeld=next;
    }
  }
  function releaseControllerInputs() {
    if(backTimer){clearTimeout(backTimer);backTimer=0}
    padHeld.forEach((token)=>{const key=mappedButton(Number(token.slice(1)));if(key)sendGameInput(key,false)});
    stickHeld.forEach((key)=>sendGameInput(key,false));
    padHeld.clear(); stickHeld.clear();
  }

  window.addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow || !event.data || event.data.channel !== "starcade") return;
    const message = event.data;
    if (message.type === "score" && current) {
      const score = Math.max(0, Math.floor(Number(message.value) || 0));
      if (score === 0 && currentScore > 0) runFinished = false;
      currentScore = score;
      $("scoreLabel").textContent = `SCORE ${String(score).padStart(6,"0")}`;
    } else if (message.type === "finish" && current) {
      const score = Math.max(0, Math.floor(Number(message.value) || 0));
      currentScore = score;
      runFinished = true;
      setBest(current.id, score);
      recordFinishedRun(current.id, score);
    } else if (message.type === "save" && current) {
      localStorage.setItem(`starcade.save.${current.id}`, JSON.stringify(message.value));
      if (osfui.available()) osfui.send("starcade.arcade.save.set", { game:current.id, value:message.value });
    } else if (message.type === "achievement" && current) {
      if (osfui.available()) osfui.send("starcade.arcade.achievement.unlock", { game:current.id, id:message.value });
    } else if (message.type === "ready" && current) {
      const saved = nativeState.games?.[current.id]?.save ?? JSON.parse(localStorage.getItem(`starcade.save.${current.id}`) || "null");
      frame.contentWindow.postMessage({ channel:"starcade", type:"load", value:saved }, "*");
    } else if (message.type === "credits" && current) {
      const request = message.value || {};
      if (osfui.available()) osfui.send("starcade.arcade.credits.transaction", { game:current.id, ...request });
      else frame.contentWindow.postMessage({ channel:"starcade", type:"credits", value:{ requestId:request.requestId, success:false, error:"Starfield credit service unavailable" } }, "*");
    } else if (message.type === "exit") closeGame();
  });

  window.addEventListener("keydown", (event) => {
    if (!player.classList.contains("hidden")) {
      if (event.key === "Escape") { event.preventDefault(); closeGame(); }
      return;
    }
    const list = filteredGames();
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) {
      const cols = innerWidth < 1050 ? 2 : 3;
      const delta = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" ? -cols : cols;
      selected = (selected + delta + list.length) % list.length;
      render(); const card = grid.children[selected]; if (card) card.focus(); event.preventDefault();
    } else if (event.key === "Enter" && list[selected]) launch(list[selected]);
  });

  document.querySelectorAll(".filter[data-filter]").forEach((button) => button.onclick = () => {
    document.querySelectorAll(".filter[data-filter]").forEach((b) => b.classList.remove("active"));
    button.classList.add("active"); filter = button.dataset.filter; selected = 0; render();
  });
  $("musicToggle").onclick = () => setMusicEnabled(!musicEnabled);
  $("musicPrev").onclick = () => stepTrack(-1);
  $("musicNext").onclick = () => stepTrack(1);
  if (musicVolumeSlider) musicVolumeSlider.oninput = () => setMusicVolume(Number(musicVolumeSlider.value) / 100);
  $("backButton").onclick = closeGame;
  $("exitButton").onclick = () => osfui.available() ? osfui.send("close") : window.close();
  $("licensesButton").onclick = () => $("licenses").classList.remove("hidden");
  $("closeLicenses").onclick = () => $("licenses").classList.add("hidden");
  $("leaderboardButton").onclick = () => { const chosen=filteredGames()[selected]; leaderboardGame=Math.max(0,games.findIndex(g=>chosen&&g.id===chosen.id)); showLeaderboard(); };
  $("previousLeaderboard").onclick = () => { leaderboardGame=(leaderboardGame+games.length-1)%games.length; showLeaderboard(); };
  $("nextLeaderboard").onclick = () => { leaderboardGame=(leaderboardGame+1)%games.length; showLeaderboard(); };
  $("closeLeaderboard").onclick = () => $("leaderboard").classList.add("hidden");
  $("licenseList").innerHTML = games.map((g) => `<div class="license-row"><strong>${g.title}</strong><p><b>CODE ORIGIN:</b> ${g.origin}</p><p><b>LICENSE:</b> ${g.license}</p><p><b>EDITABLE SOURCE:</b> ${g.source}</p></div>`).join("");
  if (osfui.available()) {
    osfui.on("ui.gamepad", handleGamepad);
    osfui.on("starcade.state", (state) => { nativeState = state || nativeState; render(); });
    osfui.on("starcade.credits", (result) => {
      if (current) frame.contentWindow.postMessage({ channel:"starcade", type:"credits", value:result }, "*");
    });
    osfui.on("starcade.xp", showXP);
    osfui.on("starcade.external", (result) => {
      if (!result?.id) return;
      externalState[result.id] = result;
      $("statusText").textContent = result.message || (result.installed ? `${result.id.toUpperCase()} READY` : `${result.id.toUpperCase()} NOT READY`);
      updateDetails();
    });
    osfui.on("starcade.music.list", (files) => {
      buildMusicTracks(Array.isArray(files) ? files : []);
      if (!musicTracks.length) useFallbackTrackList();
    });
    osfui.ready.then(() => {
      osfui.send("osfui.handleBack", { handle:true });
      setRawGamepad(false);
      osfui.send("starcade.arcade.state.get");
      osfui.send("starcade.arcade.music.list");
      games.filter((g) => g.external).forEach((g) => osfui.send("starcade.arcade.external.status", { id:g.external }));
    });
  } else {
    useFallbackTrackList();
  }
  render();
})();
