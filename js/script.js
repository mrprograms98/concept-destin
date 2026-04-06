gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- CURSOR ---
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
const hoverEls = document.querySelectorAll('a, button, .carousel-card, .gg-item, .service-card');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});
function animCursor() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

// --- HERO CANVAS ---
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.6 + 0.1
  });
}
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[j].x - p.x, dy = particles[j].y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${(1 - dist/120) * 0.06})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// --- PRELOADER ---
const preloader = document.getElementById('preloader');
const pbar = document.getElementById('pbar');
const ppct = document.getElementById('ppct');
const plogo = document.querySelector('.preloader-logo');
const pbarWrap = document.querySelector('.preloader-bar-wrap');

const tl = gsap.timeline();
tl.to(plogo, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
  .to([pbarWrap, ppct], { opacity: 1, duration: 0.4 }, '-=0.3')
  .to(pbar, { left: '0%', duration: 1.4, ease: 'power2.inOut',
    onUpdate: function() {
      const p = Math.round(this.progress() * 100);
      ppct.textContent = p + '%';
    }
  }, '-=0.1')
  .to(preloader, { opacity: 0, duration: 0.7, ease: 'power2.inOut', delay: 0.2,
    onComplete: () => {
      preloader.style.display = 'none';
      initAnimations();
    }
  });

// --- HERO ANIMATIONS ---
function initAnimations() {
  const heroTl = gsap.timeline({ delay: 0.1 });
  heroTl.to('.hero-label', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.hero-title', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .to('.hero-btns', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .to('.hero-stats', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .to('.hero-scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.2');

  // count up
  document.querySelectorAll('.count').forEach(el => {
    const target = parseInt(el.dataset.target);
    gsap.to({ val: 0 }, {
      val: target, duration: 2, delay: 1.5,
      ease: 'power2.out',
      onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
    });
  });

  // SCROLL REVEALS
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el, start: 'top 88%',
        toggleActions: 'play none none none'
      },
      delay: (i % 3) * 0.08
    });
  });
}

// --- NAVBAR ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});
document.querySelectorAll('.nav-link, .nav-logo, .nav-cta').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' });
    }
  });
});

// --- HAMBURGER / MOBILE MENU ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileItems = document.querySelectorAll('.mobile-nav-item');
const mobileLang = document.querySelector('.mobile-lang');
let menuOpen = false;
hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    const spans = hamburger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 45, y: 6.5, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.2 });
    gsap.to(spans[2], { rotation: -45, y: -6.5, duration: 0.3 });
    gsap.to(mobileItems, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out', delay: 0.1 });
    gsap.to(mobileLang, { opacity: 1, y: 0, duration: 0.5, delay: 0.45 });
  } else {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to([...mobileItems, mobileLang], { opacity: 0, y: 20, duration: 0.3 });
  }
});
mobileItems.forEach(item => {
  item.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to([...mobileItems, mobileLang], { opacity: 0, y: 20, duration: 0.3 });
    const href = item.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) setTimeout(() => gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' }), 300);
    }
  });
});

// --- CAROUSEL ---
let carPos = 0;
const track = document.getElementById('carouselTrack');
const cards = track.querySelectorAll('.carousel-card');
const cardW = 420 + 24;
const maxPos = (cards.length - 1) * cardW;
function setCarousel(pos) {
  carPos = Math.max(0, Math.min(pos, maxPos - cardW * 2));
  gsap.to(track, { x: -carPos, duration: 0.7, ease: 'power3.inOut' });
}
document.getElementById('carNext').addEventListener('click', () => setCarousel(carPos + cardW));
document.getElementById('carPrev').addEventListener('click', () => setCarousel(carPos - cardW));
// Drag
let isDragging = false, dragStart = 0, posStart = 0;
const wrap = document.getElementById('carouselWrap');
wrap.addEventListener('mousedown', e => { isDragging = true; dragStart = e.clientX; posStart = carPos; });
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const delta = dragStart - e.clientX;
  setCarousel(posStart + delta);
});
document.addEventListener('mouseup', () => { isDragging = false; });
wrap.addEventListener('touchstart', e => { dragStart = e.touches[0].clientX; posStart = carPos; });
wrap.addEventListener('touchmove', e => {
  const delta = dragStart - e.touches[0].clientX;
  setCarousel(posStart + delta);
});

// --- LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lbClose = document.getElementById('lightbox-close');
document.querySelectorAll('.gg-item').forEach(item => {
  item.addEventListener('click', () => {
    lightbox.classList.add('open');
  });
});
lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

// --- LANG ---
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// --- PARALLAX ---
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  gsap.to('.hero-title', { x: x * 0.4, y: y * 0.3, duration: 1, ease: 'power1.out' });
  gsap.to('.hero-img-wrap img', { x: x * 0.6, y: y * 0.4, duration: 1.2, ease: 'power1.out' });
});

// ── FORM ──
const form=document.getElementById('contactForm');
const successEl=document.getElementById('formSuccess');
form.addEventListener('submit',e=>{
  e.preventDefault();
  // Animate out form
  form.style.transition='opacity .5s, transform .5s';
  form.style.opacity='0'; form.style.transform='translateY(-20px)';
  setTimeout(()=>{
    form.style.display='none';
    successEl.style.display='flex';
    setTimeout(()=>successEl.style.opacity='1',50);
  },500);
});


// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement;
    const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(f=>f.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });


// ── PARTICLES ──
const canvas = document.getElementById('pCanvas');
const ctx = canvas.getContext('2d');
let W,H,pts=[];
function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
window.addEventListener('resize',resize); resize();
for(let i=0;i<55;i++) pts.push({x:Math.random()*3000,y:Math.random()*1000,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.3,a:Math.random()*.35+.08});
(function draw(){
  ctx.clearRect(0,0,W,H);
  pts.forEach((p,i)=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0;
    if(p.y<0)p.y=H; if(p.y>H)p.y=0;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(192,57,43,${p.a})`; ctx.fill();
    for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(192,57,43,${.055*(1-d/110)})`; ctx.lineWidth=.5; ctx.stroke(); }
    }
  });
  requestAnimationFrame(draw);
})();
});
// Optioneel: voeg nummers toe aan menu items via JS
// Plak dit in initAnimations() of direct na DOMContentLoaded:
document.querySelectorAll('.mobile-nav-item').forEach((item, i) => {
  const num = document.createElement('span');
  num.style.cssText = `
    font-family: var(--font-caps);
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.18);
    margin-right: 20px;
    vertical-align: middle;
  `;
  num.textContent = String(i + 1).padStart(2, '0');
  item.prepend(num);
});


