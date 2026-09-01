"use strict";
(function () {
  const send = (type, value) => parent.postMessage({ channel: "starcade", type, value }, "*");
  window.StarcadeHost = {
    ready: (meta) => send("ready", meta || {}), score: (value) => send("score", value),
    finish: (value) => send("finish", value),
    save: (value) => send("save", value), achievement: (id) => send("achievement", id), exit: () => send("exit"),
    credits: (requestId) => send("credits", { action:"balance", requestId:requestId || crypto.randomUUID() }),
    wager: (requestId, amount) => send("credits", { action:"wager", requestId, amount }),
    payout: (requestId, amount) => send("credits", { action:"payout", requestId, amount }),
    cancel: (requestId) => send("credits", { action:"cancel", requestId, amount:0 }),
    onCredits(fn) { addEventListener("message", (event) => { if (event.data?.channel === "starcade" && event.data.type === "credits") fn(event.data.value); }); },
    onLoad(fn) { addEventListener("message", (event) => { if (event.data?.channel === "starcade" && event.data.type === "load") fn(event.data.value); }); }
  };
  window.StarcadeInput = {
    key(event) {
      if (event.key === " " || event.key === "Spacebar" || event.key === "Enter") return "Action";
      if (event.key === "Escape") return "Back";
      return event.key;
    },
    isControl(key) { return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Action", "Back"].includes(key); }
  };
  function focusables() {
    return Array.from(document.querySelectorAll("button:not(:disabled), select:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])"))
      .filter((element) => element.offsetParent !== null);
  }
  function dispatchControllerKey(key, down) {
    let event;
    try { event = new KeyboardEvent(down ? "keydown" : "keyup", { key, bubbles:true, cancelable:true }); }
    catch (_) {
      event = document.createEvent("Event"); event.initEvent(down ? "keydown" : "keyup", true, true);
      Object.defineProperty(event, "key", { value:key });
    }
    const unhandled = window.dispatchEvent(event);
    if (!down || !unhandled) return;
    const controls = focusables(); if (!controls.length) return;
    const active = controls.includes(document.activeElement) ? document.activeElement : null;
    if (key === "Enter" || key === " ") { (active || controls[0]).click(); return; }
    if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(key)) return;
    if (active && active.tagName === "SELECT") {
      const delta = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
      active.selectedIndex = Math.max(0, Math.min(active.options.length - 1, active.selectedIndex + delta));
      active.dispatchEvent(new Event("change", { bubbles:true })); return;
    }
    const index = active ? controls.indexOf(active) : -1;
    const delta = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    controls[(index + delta + controls.length) % controls.length].focus();
  }
  addEventListener("message", (event) => {
    if (event.data?.channel !== "starcade" || event.data.type !== "input") return;
    const input = event.data.value || {};
    if (typeof input.key === "string") dispatchControllerKey(input.key, Boolean(input.down));
  });
  addEventListener("keydown", (event) => {
    if (window.StarcadeInput.key(event) === "Back") {
      event.preventDefault();
      send("exit");
    }
  });
})();
