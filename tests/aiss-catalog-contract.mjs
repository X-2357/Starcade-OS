// This checks current catalog coverage against the actual sibling parser and
// reads the native publisher's schema. It does NOT execute the DLL or prove VFS
// publication, reader dialogue, stream atomicity, or winning deployed versions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const readerPath=process.env.STARCADE_AISS_READER;
if(!readerPath)throw Error('Set STARCADE_AISS_READER to the actual AISS lib/starcadeContext.js; do not substitute a copied mock.');
const reader=createRequire(import.meta.url)(readerPath);
const context={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('../Web-and-Papyrus/starcade.arcade/launcher/games/catalog.js',import.meta.url),'utf8'),context);
const games=context.window.STARCADE_GAMES.filter(g=>g.entry);
assert.ok(games.length<=reader.LIMITS.games,`${games.length} catalog games exceed actual reader cap ${reader.LIMITS.games}; scope the owner contract before more score publishers.`);
for(const g of games){assert.ok(g.title.length<=reader.LIMITS.title,g.title);assert.ok(!g.title.includes(','),g.title);}
const native=fs.readFileSync(new URL('../Native/src/main.cpp',import.meta.url),'utf8');
assert.ok(native.includes('schema_version=1'));assert.ok(native.includes('"highScore", 0LL'));assert.ok(native.includes('if (best <= 0) continue;'));
const text=`[starcade]\nready=1\nschema_version=1\nlast_played_game=Signal Casebook\nlast_played_time_unix=1\nhigh_scores=${games.map((g,i)=>`${g.title}:${i+1}`).join(',')}\n`;
const result=reader.parseState(text);assert.equal(result.ok,true);assert.equal(result.state.games.length,games.length);
for(let i=0;i<games.length;i++)assert.equal(result.state.games[i].title,games[i].title);
assert.equal(reader.parseState(text.replace('ready=1','ready=0')).ok,false);
assert.equal(reader.parseState(text.replace('schema_version=1','schema_version=999')).ok,false);
const overflow=Array.from({length:reader.LIMITS.games+1},(_,i)=>`Fixture ${i}:1`).join(',');
assert.equal(reader.parseHighScores(overflow).length,reader.LIMITS.games);
console.log(`Catalog/actual AISS parser contract: ${games.length}/${reader.LIMITS.games} titles round-trip; ready/schema rejection and overflow truncation calibrated. Native runtime/VFS/dialogue not tested.`);
