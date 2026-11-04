"use strict";
(()=>{
  const RazorSeason=window.RazorSeason;
  function amount(ordinal,result){
    if(!Number.isInteger(ordinal)||ordinal<1||ordinal>8000000)throw Error('Invalid prize ordinal');
    if(ordinal%8===0){if(!Number.isInteger(result)||result<1||result>8)throw Error('Invalid placing');return {credits:result===1?500:result===2?300:result===3?150:100,medpacks:result===1?3:result===2?2:1};}
    if(!Number.isInteger(result)||result<0||result>2)throw Error('Invalid outcome');return {credits:100+result*50,medpacks:0};
  }
  function entitlements(value){
    const s=RazorSeason.restore(value);if(s.schema!==2)return [];
    const out=[];
    for(const a of [...s.archives,s]){
      if(a.schema!==2)continue;
      if(a.number>1000000)throw Error('World-prize season limit reached');
      for(const m of a.results.filter(m=>m.a===0||m.b===0)){
        const i=m.a===0?0:1,result=m.goals[i]>m.goals[1-i]?2:m.goals[i]===m.goals[1-i]?1:0,ordinal=(a.number-1)*8+m.round+1;
        out.push({ordinal,result,label:`Season ${a.number} round ${m.round+1} · ${['loss','draw','win'][result]}`,...amount(ordinal,result)});
      }
      if(a.results.length===28){const ordinal=a.number*8,result=RazorSeason.sportingRank(a);out.push({ordinal,result,label:`Season ${a.number} placing ${result}`,...amount(ordinal,result)});}
    }
    return out.sort((a,b)=>a.ordinal-b.ordinal);
  }
  window.RazorPrizes={amount,entitlements};
})();
