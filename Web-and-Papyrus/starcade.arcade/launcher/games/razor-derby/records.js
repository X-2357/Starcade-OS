"use strict";
(()=>{
 const validEntry=e=>e&&typeof e.id==='string'&&/^[a-f0-9-]{1,64}$/.test(e.id)&&e.rules===1&&Number.isSafeInteger(e.ended)&&e.ended>=0&&Array.isArray(e.goals)&&e.goals.length===2&&e.goals.every(n=>Number.isInteger(n)&&n>=0&&n<=240)&&e.stats&&['shots','passes','steals','saves','turnovers'].every(k=>Array.isArray(e.stats[k])&&e.stats[k].length===2&&e.stats[k].every(n=>Number.isInteger(n)&&n>=0&&n<=10000));
 function read(text){if(text===null)return [];const v=JSON.parse(text);if(v?.schema!==1||!Array.isArray(v.entries)||v.entries.length>10||!v.entries.every(validEntry)||new Set(v.entries.map(e=>e.id)).size!==v.entries.length)throw Error('Unsupported or damaged records');return v.entries;}
 function append(entries,entry){if(!validEntry(entry))throw Error('Invalid result');if(entries.some(e=>e.id===entry.id))return entries;return [...entries,JSON.parse(JSON.stringify(entry))].slice(-10);}
 window.RazorRecords={read,append};
})();
