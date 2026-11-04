"use strict";
(()=>{
  const teamKeys=['shots','passes','steals','saves','turnovers'],playerKeys=['ticks','goals','assists','shots','passes','completed','steals','saves'];
  const integer=(n,max=10000)=>Number.isInteger(n)&&n>=0&&n<=max;
  function build(s,meta={}){
    if(!s||!Array.isArray(s.goals)||s.goals.length!==2||!s.goals.every(n=>integer(n,240)))throw Error('Match score unavailable');
    const names=[meta.home||'Teal',meta.away||'Rose'],complete=meta.complete===true||s.phase==='result';
    const stats=s.stats&&teamKeys.every(k=>Array.isArray(s.stats[k])&&s.stats[k].length===2&&s.stats[k].every(n=>integer(n)))?Object.fromEntries(teamKeys.map(k=>[k,s.stats[k].slice()])):null;
    const covered=Array.isArray(s.individual)&&s.individual.length===12&&integer(s.metricsFromTick,7200)&&s.individual.every(p=>p&&playerKeys.every(k=>integer(p[k],k==='ticks'?7200:10000))&&p.completed<=p.passes);
    const lineup=s.lineup||s.leagueLineup,roster=new Map((meta.rosters||[]).flat().map(p=>[p.id,p]));
    const players=covered?s.individual.map((p,i)=>{const side=i<6?0:1,id=Array.isArray(lineup)&&lineup.length===12?lineup[i]:null,athlete=id?roster.get(id):null;return {...p,id,side,name:athlete?.name||`${side?'Rose':'Teal'} ${i%6?'runner '+(i%6+1):'keeper'}`};}):null;
    const tracked=players?[0,1].map(side=>{const rows=players.filter(p=>p.side===side);return {passes:rows.reduce((n,p)=>n+p.passes,0),completed:rows.reduce((n,p)=>n+p.completed,0)};}):null;
    const hints=[];
    if(stats){
      if(stats.turnovers[0])hints.push(`Teal recorded ${stats.turnovers[0]} possession-clock turnovers. Passes do not reset that clock; shoot before it expires.`);
      if(tracked&&tracked[0].passes>tracked[0].completed)hints.push(`Teal completed ${tracked[0].completed} of ${tracked[0].passes} tracked passes. Try the passing circuit and watch current lane coverage.`);
      if(!stats.shots[0])hints.push('Teal has no recorded shots. Try the finishing drill: carry near goal, move off-centre and shoot when recovery ends.');
      else if(s.goals[0]<stats.shots[0])hints.push(`Teal recorded ${stats.shots[0]} shots and ${s.goals[0]} goals. Compare closer and off-centre attempts in the finishing drill.`);
      if(!hints.length)hints.push('Compare the team counters below, then try a different receiver or defensive switch in practice.');
    }
    const contributors=players?players.filter(p=>p.goals>0).sort((a,b)=>b.goals-a.goals||a.side-b.side||a.name.localeCompare(b.name)):[];
    return {names,goals:s.goals.slice(),complete,tick:integer(s.tick,7200)?s.tick:null,stats,players,tracked,fromTick:covered?s.metricsFromTick:null,contributors,hints};
  }
  function passes(value){if(!value)return 'Not recorded';return `${value.completed}/${value.passes}${value.passes?` (${Math.round(value.completed/value.passes*100)}%)`:' — no attempts'}`;}
  window.RazorReport={build,passes};
})();
