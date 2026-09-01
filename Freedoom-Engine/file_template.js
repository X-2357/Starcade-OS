function b64_to_uint8array(str) {
  var binary;
  if (window.atob) {
    binary = window.atob(str);
  } else {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = [];
    var bits = 0;
    var bitCount = 0;
    for (var sourceIndex = 0; sourceIndex < str.length; sourceIndex++) {
      var character = str.charAt(sourceIndex);
      if (character === "=") break;
      var value = alphabet.indexOf(character);
      if (value < 0) continue;
      bits = (bits << 6) | value;
      bitCount += 6;
      if (bitCount >= 8) {
        bitCount -= 8;
        output.push((bits >> bitCount) & 255);
      }
    }
    return new Uint8Array(output);
  }
  var result = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) result[i] = binary.charCodeAt(i) & 255;
  return result;
}

starcade_status("DECODING FREEDOOM DATA...");
var file_data = b64_to_uint8array("__iwad_file__");
var file_name = "__iwad_filename__";
var file2_data = null;
var file2_name = null;

starcade_status("INITIALIZING DOOM ENGINE...");

if (file_data.length <= 9) throw new Error("Freedoom IWAD not found");
