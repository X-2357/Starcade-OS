"use strict";
(()=>{
  const balance=document.querySelector("#balance"),result=document.querySelector("#result"),status=document.querySelector("#status"),mode=document.querySelector("#bet"),wager=document.querySelector("#wager"),play=document.querySelector("#play");
  let busy=false,point=0,activeWager=0,rolls=0;
  const die=()=>1+Math.floor(Math.random()*6),show=()=>balance.textContent=`CREDITS: ${CasinoBank.balance??"---"}`;
  async function settle(multiplier,message){const score=Math.max(0,Math.floor(activeWager*(multiplier-1)));await CasinoBank.payout(Math.floor(activeWager*multiplier));status.textContent=message;StarcadeHost.score(score);StarcadeHost.finish(score);point=0;activeWager=0;play.textContent="NEW PASS";mode.disabled=false;wager.disabled=false;show()}
  async function roll(){if(busy)return;busy=true;play.disabled=true;try{
    if(!point){activeWager=Number(wager.value);await CasinoBank.wager(activeWager);mode.disabled=true;wager.disabled=true;rolls=0}
    const a=die(),b=die(),total=a+b;rolls++;result.textContent=`${a} + ${b} = ${total}`;
    if(mode.value!=="pass"){
      const win=mode.value==="low"?total<7:mode.value==="high"?total>7:total===7;
      if(win)await settle(mode.value==="seven"?5:2,mode.value==="seven"?"EXACT SEVEN · 5x RETURN":"PREDICTION CORRECT · 2x RETURN");
      else{await CasinoBank.payout(0);status.textContent="WAGER LOST";StarcadeHost.finish(0);point=0;activeWager=0;play.textContent="ROLL";mode.disabled=false;wager.disabled=false;show()}
    }else if(!point){
      if(total===7||total===11)await settle(2,"NATURAL · PASS LINE WINS");
      else if(total===2||total===3||total===12){await CasinoBank.payout(0);status.textContent="CRAPS · PASS LINE LOSES";StarcadeHost.finish(0);activeWager=0;play.textContent="NEW PASS";mode.disabled=false;wager.disabled=false;show()}
      else{point=total;status.textContent=`POINT IS ${point} · MAKE ${point} BEFORE 7`;play.textContent="ROLL POINT"}
    }else if(total===point)await settle(2,`POINT ${point} MADE IN ${rolls} ROLLS · PASS WINS`);
    else if(total===7){await CasinoBank.payout(0);status.textContent=`SEVEN OUT · POINT ${point} LOST`;StarcadeHost.finish(0);point=0;activeWager=0;play.textContent="NEW PASS";mode.disabled=false;wager.disabled=false;show()}
    else status.textContent=`POINT ${point} · ${total} ROLLED · CONTINUE`;
  }catch(e){status.textContent=e.message;point=0;activeWager=0;mode.disabled=false;wager.disabled=false}finally{busy=false;play.disabled=false}}
  play.onclick=roll;addEventListener("keydown",e=>{if(StarcadeInput.key(e)==="Action"){e.preventDefault();roll()}});CasinoBank.refresh().then(show).catch(e=>status.textContent=e.message);StarcadeHost.ready({title:"Settled Systems Dice"});
})();
