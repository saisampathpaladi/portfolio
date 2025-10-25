
// Matrix rain effect
(function matrix(){
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const cols = Math.floor(w / 18) + 1;
  const ypos = Array(cols).fill(0);
  function resetSize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  addEventListener('resize', resetSize);
  function draw(){
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#0f0';
    ctx.font = '12px monospace';
    for(let i=0;i<ypos.length;i++){
      const text = String.fromCharCode(0x30A0 + Math.random()*96);
      const x = i*18;
      ctx.fillText(text, x, ypos[i]*18);
      if(ypos[i]*18 > h && Math.random() > 0.98) ypos[i]=0;
      ypos[i] += 1;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// Typing intro (matrix-style)
(function introTyping(){
  const introEl = document.getElementById('intro');
  const phrases = [
    "> Initializing Sampath Sai Paladi Portfolio...",
    "> Accessing modules: [ABOUT][PROJECTS][CONTACT][CERTS]...",
    "> Access Granted."
  ];
  let p = 0, i = 0;
  const audio = new Audio('sounds/typing.mp3');
  audio.volume = 0.12;
  audio.loop = false;
  function typePhrase(){
    if(p >= phrases.length) return;
    const str = phrases[p];
    i = 0;
    const interval = setInterval(()=>{
      introEl.textContent = str.slice(0,i) + (i%2? '▌':'');
      if(i < str.length) {
        i++;
        try{ audio.currentTime = 0; audio.play(); }catch(e){}
      } else {
        clearInterval(interval);
        p++;
        setTimeout(typePhrase, 500);
      }
    }, 28);
  }
  typePhrase();
})();

// Encrypted about decrypt on hover (matrix scramble reveal)
(function aboutDecrypt(){
  const enc = document.getElementById('enc-text');
  const plain = document.getElementById('plain-about').textContent.trim();
  const chars = "█▓▒░@#%^&*()<>[]{}?-=+abcdefghijklmnopqrstuvwxyz0123456789";
  function scrambleText(len){
    let s = '';
    for(let k=0;k<len;k++){
      s += chars[Math.floor(Math.random()*chars.length)];
    }
    return s;
  }
  // initialize scrambled
  enc.textContent = scrambleText(plain.length);
  let timer = null;
  const audio = new Audio('sounds/typing.mp3');
  audio.volume = 0.08;
  function reveal(){
    if(timer) clearInterval(timer);
    const total = plain.length;
    let progress = 0;
    timer = setInterval(()=>{
      let display = '';
      for(let i=0;i<total;i++){
        if(Math.random() < progress/total) display += plain[i];
        else display += chars[Math.floor(Math.random()*chars.length)];
      }
      enc.textContent = display;
      try{ audio.currentTime = 0; audio.play(); }catch(e){}
      progress += Math.random()*4 + 1;
      if(progress > total+10){
        clearInterval(timer);
        enc.textContent = plain;
      }
    }, 14);
  }
  function encryptBack(){
    if(timer) clearInterval(timer);
    const total = plain.length;
    let step = 0;
    timer = setInterval(()=>{
      let display = '';
      for(let i=0;i<total;i++){
        if(Math.random() < Math.max(0,1 - step/12)) display += chars[Math.floor(Math.random()*chars.length)];
        else display += plain[i];
      }
      enc.textContent = display;
      step++;
      if(step>12){ clearInterval(timer); enc.textContent = scrambleText(total); }
    }, 14);
  }
  const parent = document.getElementById('encrypted');
  parent.addEventListener('mouseenter', reveal);
  parent.addEventListener('focus', reveal);
  parent.addEventListener('mouseleave', encryptBack);
  parent.addEventListener('blur', encryptBack);
})();

// Terminal contact window show on load with close button
(function terminalContact(){
  const term = document.getElementById('terminal-contact');
  const close = document.getElementById('term-close');
  setTimeout(()=>{ term.classList.add('visible'); term.setAttribute('aria-hidden','false'); }, 900);
  close.addEventListener('click', ()=>{ term.classList.remove('visible'); term.setAttribute('aria-hidden','true'); });
})();

// Small accessibility: trap focus on encrypted element when tabbing
(function accessibility(){
  const encParent = document.getElementById('encrypted');
  encParent.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); encParent.classList.toggle('open'); encParent.focus(); }
  });
})();
