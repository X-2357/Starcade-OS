/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

import { TILE_COUNT } from "./tileValues.ts";

// Tiles must be 16px square
var TILE_SIZE = 16;
var TILES_PER_ROW = Math.sqrt(TILE_COUNT);
var ACCEPTABLE_DIMENSION = TILES_PER_ROW * TILE_SIZE;


function TileSet(image, callback, errorCallback) {
  if (!(this instanceof TileSet))
    return new TileSet(image, callback, errorCallback);

  if (callback === undefined || errorCallback === undefined) {
    if (callback === undefined && errorCallback === undefined)
      throw new Error('Tileset constructor called with no callback or errorCallback');
    else
      throw new Error('Tileset constructor called with no ' + (callback === undefined ? 'callback' : 'errorCallback'));
  }

  this.isValid = false;

  if (!(image instanceof Image)) {
    // Spin the event loop
    window.setTimeout(errorCallback, 0);
    return;
  }

  this._verifyImage(image, callback, errorCallback);
}


TileSet.prototype._verifyImage = function(image, callback, errorCallback) {
  var width = image.width;
  var height = image.height;

  // We expect tilesets to be square, and of the required width/height
  if (width !== height || width !== ACCEPTABLE_DIMENSION) {
    // Spin the event loop
    window.setTimeout(errorCallback, 0);
    return;
  }

  var tileWidth = this.tileWidth = TILE_SIZE;
  var tileCount = TILE_COUNT;

  // Starcade: slice tiles by drawing each one directly onto its own small
  // canvas, instead of the original approach of painting onto a shared canvas
  // and reading it back via toDataURL() to build an Image. toDataURL() (and
  // getImageData()) throw a SecurityError once a canvas has had a source
  // image drawn onto it that the browser doesn't consider same-origin with
  // the page - which happens unconditionally here, on every load, for a
  // sibling image loaded over file:// (Chromium treats file:// resources as
  // opaque-origin by default). drawImage() itself has no such restriction,
  // and gameCanvas.js's only consumer of these tiles already just calls
  // ctx.drawImage(tile, ...), which accepts a canvas exactly like an Image -
  // so this is a drop-in, synchronous replacement with no external behaviour
  // change.
  for (var i = 0; i < tileCount; i++) {
    var sourceX = i % TILES_PER_ROW * tileWidth;
    var sourceY = Math.floor(i / TILES_PER_ROW) * tileWidth;

    var tileCanvas = document.createElement('canvas');
    tileCanvas.width = tileWidth;
    tileCanvas.height = tileWidth;
    tileCanvas.getContext('2d').drawImage(image, sourceX, sourceY, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);

    this[i] = tileCanvas;
  }

  this.isValid = true;
  // Spin the event loop, matching the original async-callback contract.
  window.setTimeout(callback, 0);
};


export { TileSet };
