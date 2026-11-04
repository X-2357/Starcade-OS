"use strict";
(()=>{
  const labels={auto:'Auto',upper:'Upper lane',lower:'Lower lane'},modes=Object.keys(labels);
  function next(mode){return modes[(Math.max(0,modes.indexOf(mode))+1)%modes.length];}
  function point(s,mode){if(!s||s.ball.owner!==s.control)return null;return RazorDerby.shotTarget(s,s.control,mode);}
  window.RazorAim={labels,next,point};
})();
