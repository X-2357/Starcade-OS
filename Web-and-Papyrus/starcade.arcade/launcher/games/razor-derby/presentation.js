"use strict";
(()=>{
  const metrics={goals:'Goals',assists:'Assists',saves:'Keeper saves',steals:'Challenges won',completed:'Completed passes',shots:'Shots',appearances:'Appearances'};
  const colors=['#68e5cb','#ed91b4','#b8adff','#f2c56e','#7ac7ff','#ff9d73','#8bd790','#ddadfa'];
  function leaders(s,period='current',metric='goals'){
    if(s.schema!==2||!metrics[metric])return [];
    const archived=s.archives.filter(a=>a.schema===2),source=period==='previous'?archived.at(-1):s;
    if(!source)return [];
    const number=period==='career'?undefined:source.number;
    const rows=source.rosters.flatMap((team,t)=>team.map(p=>({...p,team:t,stats:window.RazorSeason.playerStats(s,p.id,number)}))).filter(p=>p.stats.appearances>0);
    rows.sort((a,b)=>b.stats[metric]-a.stats[metric]||a.id.localeCompare(b.id));
    rows.forEach((p,i)=>p.rank=i&&p.stats[metric]===rows[i-1].stats[metric]?rows[i-1].rank:i+1);
    return rows;
  }
  let backdrop;
  function arena(ctx,project){
    if(!backdrop){
      backdrop=document.createElement('canvas');backdrop.width=1200;backdrop.height=700;
      const c=backdrop.getContext('2d'),wash=c.createLinearGradient(0,0,0,700);wash.addColorStop(0,'#172d42');wash.addColorStop(1,'#030b13');c.fillStyle=wash;c.fillRect(0,0,1200,700);
      // Static fictional spectator lights and terraces; no extra animation loop.
      for(let row=0;row<4;row++){c.strokeStyle=`rgba(114,169,187,${.1+row*.03})`;c.lineWidth=9;c.beginPath();c.ellipse(600,360,580-row*10,300-row*9,0,0,Math.PI*2);c.stroke();}
      for(let i=0;i<110;i++){c.fillStyle=i%3?'#537286':'#b99765';c.globalAlpha=.3;c.fillRect(62+i*10,39+(i%4)*7,3,2);}c.globalAlpha=1;
      const poly=(points,fill)=>{c.fillStyle=fill;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fill();};
      const corners=[project(0,0),project(100,0),project(100,60),project(0,60)];
      poly([corners[3],corners[2],{x:corners[2].x,y:corners[2].y+19},{x:corners[3].x,y:corners[3].y+19}],'#162e3c');
      poly(corners,'#0d303b');
      for(let x=0;x<100;x+=10)poly([project(x,0),project(x+10,0),project(x+10,60),project(x,60)],x%20?'#123944':'#10333f');
      function path(points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();}
      path([...corners,corners[0]],'#75b1bd',2);path([project(50,0),project(50,60)],'#75b1bd',2);
      path(Array.from({length:65},(_,i)=>project(50+10*Math.cos(i*Math.PI/32),30+10*Math.sin(i*Math.PI/32))),'#477e8b',2);
      for(const [x,color,dir] of [[0,'#68e5cb',1],[100,'#ed91b4',-1]]){
        path([project(x,15),project(x+dir*14,15),project(x+dir*14,45),project(x,45)],'#477e8b',2);
        const a=project(x,21),b=project(x,39);c.shadowColor=color;c.shadowBlur=14;path([a,b],color,7);c.shadowBlur=0;
        const back=-dir*22;poly([a,b,{x:b.x+back,y:b.y-14},{x:a.x+back,y:a.y-14}],'#91c6cf15');
        for(let i=0;i<=6;i++){const p=project(x,21+i*3);path([p,{x:p.x+back,y:p.y-14}],'#74a3b055');}
      }
      c.textAlign='center';c.font='bold 13px Arial';c.fillStyle='#7ca6b4';c.fillText('STARCADE  /  RAZOR LEAGUE',600,43);
      c.font='12px Arial';c.fillStyle='#68e5cb';c.fillText('TEAL ATTACKS →',315,650);c.fillStyle='#ed91b4';c.fillText('← ROSE ATTACKS',885,650);
    }
    ctx.drawImage(backdrop,0,0);
  }
  function courtFeedback(s){
    if(!s||s.phase==='result')return null;
    const p=s.players?.[s.control],b=s.ball,valid=(n,a,z)=>Number.isFinite(n)&&n>=a&&n<=z;
    const energy=valid(p?.energy,0,100)?p.energy/100:null,recovery=valid(p?.cool,0,45)?p.cool/45:null;
    let tail=null;
    if(b?.owner===-1&&['pass','shot'].includes(b.kind)&&Number.isFinite(b.vx)&&Number.isFinite(b.vy)&&valid(b.x,-5,105)&&valid(b.y,-5,65)){
      const speed=Math.hypot(b.vx,b.vy);
      if(speed>0){const length=Math.min(5,speed*.1);tail={x:Math.max(0,Math.min(100,b.x-b.vx/speed*length)),y:Math.max(0,Math.min(60,b.y-b.vy/speed*length)),kind:b.kind};}
    }
    return {energy,recovery,tail};
  }
  window.RazorPresentation={metrics,colors,leaders,arena,courtFeedback};
})();
