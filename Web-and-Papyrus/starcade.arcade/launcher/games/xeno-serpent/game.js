"use strict";
(()=>{
  const c=game,x=c.getContext("2d"),size=24,cols=c.width/size,rows=c.height/size;
  let snake,dir,next,food,bonus,hazards,score,tick,alive,finished,eaten,stage,lastMove;
  const occupied=(p)=>snake.some(q=>q.x===p.x&&q.y===p.y)||hazards.some(q=>q.x===p.x&&q.y===p.y);
  function freeCell(){let p;do p={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)};while(occupied(p)||(bonus&&bonus.x===p.x&&bonus.y===p.y));return p}
  function spawnFood(){food=freeCell()}
  function addHazards(){const count=Math.min(3,1+Math.floor(stage/2));for(let i=0;i<count;i++)hazards.push(freeCell())}
  function reset(){snake=[{x:15,y:11},{x:14,y:11},{x:13,y:11}];dir={x:1,y:0};next=dir;hazards=[];bonus=null;score=0;eaten=0;stage=1;tick=126;alive=true;finished=false;lastMove=0;spawnFood();StarcadeHost.score(0)}
  function fail(){alive=false;if(!finished){finished=true;StarcadeHost.finish(score)}}
  function update(now){
    if(!alive)return;dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    const willGrow=(h.x===food.x&&h.y===food.y)||(bonus&&h.x===bonus.x&&h.y===bonus.y);
    const collisionBody=willGrow?snake:snake.slice(0,-1);
    if(h.x<0||h.y<0||h.x>=cols||h.y>=rows||collisionBody.some(p=>p.x===h.x&&p.y===h.y)||hazards.some(p=>p.x===h.x&&p.y===h.y)){fail();return}
    snake.unshift(h);let grew=false;
    if(h.x===food.x&&h.y===food.y){eaten++;score+=100*stage;grew=true;if(eaten%5===0){stage++;addHazards();bonus={...freeCell(),until:now+6000};if(stage===6)StarcadeHost.achievement("great-serpent-stage-six")}spawnFood()}
    if(bonus&&h.x===bonus.x&&h.y===bonus.y){score+=500*stage;grew=true;bonus=null}
    if(!grew)snake.pop();if(bonus&&now>bonus.until)bonus=null;
    tick=Math.max(48,126-eaten*2.7-stage*2);StarcadeHost.score(score);
  }
  function draw(){
    x.fillStyle="#07100e";x.fillRect(0,0,c.width,c.height);x.strokeStyle="#11231f";for(let i=0;i<=cols;i++){x.beginPath();x.moveTo(i*size,0);x.lineTo(i*size,c.height);x.stroke()}for(let i=0;i<=rows;i++){x.beginPath();x.moveTo(0,i*size);x.lineTo(c.width,i*size);x.stroke()}
    hazards.forEach(p=>{x.fillStyle="#8c4c62";x.fillRect(p.x*size+3,p.y*size+3,size-6,size-6);x.strokeStyle="#ff8d72";x.strokeRect(p.x*size+6,p.y*size+6,size-12,size-12)});
    x.fillStyle="#f2c879";x.fillRect(food.x*size+5,food.y*size+5,size-10,size-10);if(bonus){x.fillStyle="#c58cff";x.beginPath();x.arc(bonus.x*size+12,bonus.y*size+12,9,0,Math.PI*2);x.fill()}
    snake.forEach((p,i)=>{x.fillStyle=i?"#4dbb91":"#aaffdc";x.fillRect(p.x*size+2,p.y*size+2,size-4,size-4)});x.fillStyle="#c8d8d2";x.font="14px Arial";x.textAlign="left";x.fillText(`STAGE ${stage}   LENGTH ${snake.length}   SCORE ${score}`,14,20);
    if(!alive){x.fillStyle="rgba(2,7,6,.86)";x.fillRect(0,0,c.width,c.height);x.fillStyle="#e8f4f2";x.textAlign="center";x.font="28px Arial";x.fillText("SPECIMEN CONTAINMENT FAILED",c.width/2,c.height/2-10);x.font="15px Arial";x.fillStyle="#8df7c7";x.fillText("PRESS A / ENTER TO RESTART",c.width/2,c.height/2+28)}
  }
  function loop(t){if(t-lastMove>tick){update(t);lastMove=t}draw();requestAnimationFrame(loop)}
  addEventListener("keydown",e=>{const k=StarcadeInput.key(e),dirs={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};if(dirs[k]&&!(dirs[k].x===-dir.x&&dirs[k].y===-dir.y))next=dirs[k];if(k==="Action"&&!alive)reset();if(StarcadeInput.isControl(k))e.preventDefault()});
  reset();StarcadeHost.ready({title:"Great Serpent"});requestAnimationFrame(loop);
})();
