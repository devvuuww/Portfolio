
const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

function toast(msg){
  const t = document.createElement("div");
  t.id = "toast";
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.right = "16px";
  t.style.bottom = "16px";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "12px";
  t.style.border = "1px solid rgba(255,255,255,.16)";
  t.style.background = "rgba(0,0,0,.55)";
  t.style.backdropFilter = "blur(10px)";
  t.style.color = "#fff";
  t.style.zIndex = "9999";
  t.style.fontSize = "13px";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}


window.addEventListener("load", () => {
  const loader = qs("#loader");
  setTimeout(() => loader.classList.add("hide"), 350);
});


(function initTheme(){
  const key = "theme"; 
  const saved = localStorage.getItem(key);
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  if(saved === "light" || (saved === null && prefersLight)){
    document.body.classList.add("light");
  }

  function refresh(){
    const isLight = document.body.classList.contains("light");
    qs("#themeIcon").textContent = isLight ? "☀️" : "🌙";
    qs("#themeLabel").textContent = isLight ? "Light" : "Dark";
  }
  refresh();

  qs("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem(key, document.body.classList.contains("light") ? "light" : "dark");
    refresh();
  });
})();

(function navStuff(){
  const navbar = qs(".navbar");
  const navLinks = qsa('.nav-link[href^="#"]');
  const sections = qsa("section[id]");

  function onScroll(){

    if(window.scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    
    let current = "";
    for(const sec of sections){
      const top = sec.offsetTop - 140;
      const bottom = top + sec.offsetHeight;
      if(window.scrollY >= top && window.scrollY < bottom){
        current = sec.id;
        break;
      }
    }
    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  
  navLinks.forEach(a=>{
    a.addEventListener("click", ()=>{
      const menu = qs("#navMenu");
      if(menu?.classList.contains("show")){
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menu);
        bsCollapse.hide();
      }
    });
  });
})();


(function progress(){
  const bar = qs(".scroll-progress");
  function update(){
    const st = document.documentElement.scrollTop || document.body.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = h > 0 ? (st / h) * 100 : 0;
    bar.style.width = pct + "%";
  }
  window.addEventListener("scroll", update, { passive:true });
  update();
})();

(function reveal(){
  const items = qsa(".reveal");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add("active");
    });
  }, { threshold: 0.18 });
  items.forEach(el => io.observe(el));
})();


(function staggerCards(){
  const cards = qsa(".ach-item");
  const section = qs("#achievements");
  if(!section || cards.length === 0) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      cards.forEach((card, i)=>{
        setTimeout(()=> card.classList.add("show"), i * 130);
      });
      io.disconnect();
    });
  }, { threshold: 0.20 });

  io.observe(section);
})();


(function modalPreview(){
  const btns = document.querySelectorAll(".btn-preview");
  const modalEl = document.getElementById("previewModal");
  if(!modalEl || btns.length === 0) return;

  const modal = new bootstrap.Modal(modalEl);
  const mediaContainer = document.getElementById("modalMediaContainer");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.dataset.img;
      const videoSrc = btn.dataset.video;
      const title = btn.dataset.title || "Preview";
      const desc = btn.dataset.desc || "";

      mediaContainer.innerHTML = "";

      if(videoSrc){
        mediaContainer.innerHTML = `
          <video controls autoplay class="img-fluid w-100">
            <source src="${videoSrc}" type="video/mp4">
            Browser kamu tidak mendukung video.
          </video>
        `;
      } else if(imgSrc){
        mediaContainer.innerHTML = `
          <img src="${imgSrc}" alt="preview" class="img-fluid w-100">
        `;
      } else {
        mediaContainer.innerHTML = `
          <div class="p-4 text-center text-muted">No preview available</div>
        `;
      }

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.show();
    });
  });

  modalEl.addEventListener("hidden.bs.modal", () => {
    mediaContainer.innerHTML = "";
  });
})();


(function socials(){
  const ig = qs("#igBtn");
  const tt = qs("#ttBtn");
  const mail = qs("#mailBtn");

  async function copy(text){
    try{
      await navigator.clipboard.writeText(text);
      toast("Copied: " + text);
    }catch{
      toast("Copy failed");
    }
  }

  ig?.addEventListener("click", ()=>{
    const url = ig.dataset.url;
    const cp = ig.dataset.copy;
    if(cp) copy(cp);
    if(url) window.open(url, "_blank", "noopener,noreferrer");
  });

  tt?.addEventListener("click", ()=>{
    const url = tt.dataset.url;
    const cp = tt.dataset.copy;
    if(cp) copy(cp);
    if(url) window.open(url, "_blank", "noopener,noreferrer");
  });

  mail?.addEventListener("click", ()=>{
    const email = mail.dataset.email;
    if(email) copy(email);
  });

  qs("#year").textContent = new Date().getFullYear();
})();


(function particles(){
  const canvas = qs("#particles");
  const ctx = canvas.getContext("2d");

  let w, h, dpr;
  function resize(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
  window.addEventListener("resize", resize);
  resize();

  const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 19000));
  const parts = [];
  const speed = 0.28;

  const rand = (min,max)=> Math.random()*(max-min)+min;

  for(let i=0;i<count;i++){
    parts.push({
      x: rand(0,w), y: rand(0,h),
      vx: rand(-speed,speed)*dpr,
      vy: rand(-speed,speed)*dpr,
      r: rand(1.0,2.2)*dpr
    });
  }

  function colors(){
    const isLight = document.body.classList.contains("light");
    return {
      dot: isLight ? "rgba(15,23,42,.18)" : "rgba(229,231,235,.18)",
      line: isLight ? "rgba(15,23,42,.08)" : "rgba(229,231,235,.07)"
    };
  }

  function loop(){
    const {dot, line} = colors();
    ctx.clearRect(0,0,w,h);

    
    ctx.fillStyle = dot;
    for(const p of parts){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
      if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    // lines
    const maxDist = 125 * dpr;
    for(let i=0;i<parts.length;i++){
      for(let j=i+1;j<parts.length;j++){
        const a = parts[i], b = parts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < maxDist){
          const alpha = 1 - (dist / maxDist);
          ctx.strokeStyle = line.replace(")", `,${alpha})`).replace("rgba(", "rgba(");
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }
  loop();
})();

document.querySelectorAll(".video-card").forEach(card=>{

  const video = card.querySelector("video");

  card.addEventListener("mouseenter", ()=>{
    video.play();
  });

  card.addEventListener("mouseleave", ()=>{
    video.pause();
    video.currentTime = 0;
  });

});

document.querySelectorAll(".video-card").forEach(card => {
  const video = card.querySelector(".preview-video");

  if (!video) return;

  card.addEventListener("mouseenter", () => {
    video.play();
  });

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});