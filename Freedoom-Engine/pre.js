var Module = {};
var pressed_keys = {};
var key_queue = [];
var starcadeCanvas = null;
var starcadeContext = null;
var starcadeImage = null;
var starcadeFrames = 0;

function print_msg(msg) {
  if (typeof console !== "undefined" && console.log) console.log("[Freedoom] " + msg);
}

Module.print = print_msg;
Module.printErr = print_msg;
Module.arguments = ["-iwad", "doom1.wad", "-nomusic", "-nosound"];

function starcade_status(message) {
  var status = document.getElementById("status");
  if (status) status.textContent = message;
}

starcade_status("PARSING ASM.JS ENGINE...");

function starcade_key_code(event) {
  var key = event.key || "";
  var map = {
    ArrowLeft: "a", ArrowRight: "d", ArrowUp: "w", ArrowDown: "s",
    Escape: "q", Enter: "z", " ": " ", Control: " ", Shift: "_", Tab: "m"
  };
  if (map[key] !== undefined) return map[key];
  if (key.length === 1) return key.toLowerCase();
  return "";
}

function key_down(key_str) {
  if (!key_str) return;
  var doomkey = _key_to_doomkey(key_str.charCodeAt(0));
  if (doomkey !== -1) pressed_keys[doomkey] = 1;
}

function key_up(key_str) {
  if (!key_str) return;
  var doomkey = _key_to_doomkey(key_str.charCodeAt(0));
  if (doomkey !== -1) pressed_keys[doomkey] = 0;
}

window.addEventListener("keydown", function (event) {
  var key = starcade_key_code(event);
  if (!key) return;
  key_down(key);
  event.preventDefault();
});

window.addEventListener("keyup", function (event) {
  var key = starcade_key_code(event);
  if (!key) return;
  key_up(key);
  event.preventDefault();
});

window.addEventListener("message", function (event) {
  var data = event.data;
  if (!data || data.channel !== "starcade" || data.type !== "input") return;
  var input = data.value || {};
  var key = starcade_key_code({ key:String(input.key || "") });
  if (!key) return;
  if (input.down) key_down(key); else key_up(key);
});

function write_file(filename, data) {
  var stream = FS.open("/" + filename, "w+");
  FS.write(stream, data, 0, data.length, 0);
  FS.close(stream);
}

function create_framebuffer(width, height) {
  starcadeCanvas = document.getElementById("screen");
  if (!starcadeCanvas) throw new Error("Starcade Doom canvas was not found");
  starcadeCanvas.width = width;
  starcadeCanvas.height = height;
  starcadeContext = starcadeCanvas.getContext("2d");
  starcadeImage = starcadeContext.createImageData(width, height);
  var status = document.getElementById("status");
  if (status) status.textContent = "STARTING FREEDOOM";
}

function update_framebuffer(framebuffer_ptr, framebuffer_len, width, height) {
  var framebuffer = Module.HEAPU8.subarray(framebuffer_ptr, framebuffer_ptr + framebuffer_len);
  starcadeImage.data.set(framebuffer);
  starcadeContext.putImageData(starcadeImage, 0, 0);
  starcadeFrames++;
  if (starcadeFrames === 1) {
    var status = document.getElementById("status");
    if (status) status.textContent = "ENGINE ONLINE - WORLD SIMULATION ACTIVE";
    if (window.parent) window.parent.postMessage({ channel: "starcade", type: "ready", value: { title: "Freedoom: Phase 1" } }, "*");
  }
}

Module.onAbort = function (reason) {
  var status = document.getElementById("status");
  var error = document.getElementById("error");
  if (status) status.textContent = "ENGINE ERROR";
  if (error) {
    error.hidden = false;
    error.textContent = "Freedoom: Phase 1 asm.js engine stopped.\n\n" + String(reason);
  }
};

window.onerror = function (message, source, line, column, error) {
  var status = document.getElementById("status");
  var target = document.getElementById("error");
  if (status) status.textContent = "ENGINE ERROR";
  if (target) {
    target.hidden = false;
    target.textContent = "Freedoom: Phase 1 startup failed.\n\n" + String(message) +
      "\nLine " + String(line || "?") + ":" + String(column || "?") +
      (error && error.stack ? "\n\n" + String(error.stack) : "");
  }
  return false;
};
