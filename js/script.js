
// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
document.querySelectorAll('a, button, .project-card, .cat-item, .filter-tab, .cta-contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});
(function animCursor() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();

// ── PRELOADER ──
const preloader = document.getElementById('preloader');
const pbar = document.getElementById('pbar');
const ppct = document.getElementById('ppct');
const plogo = document.querySelector('.preloader-logo');
const pbarWrap = document.querySelector('.preloader-bar-wrap');

setTimeout(() => {
  plogo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  plogo.style.opacity = '1';
  plogo.style.transform = 'translateY(0)';
}, 100);
setTimeout(() => {
  pbarWrap.style.transition = 'opacity 0.4s';
  pbarWrap.style.opacity = '1';
  ppct.style.transition = 'opacity 0.4s';
  ppct.style.opacity = '1';
}, 600);

let pct = 0;
const pInterval = setInterval(() => {
  pct += Math.random() * 8 + 2;
  if (pct >= 100) { pct = 100; clearInterval(pInterval); }
  ppct.textContent = Math.round(pct) + '%';
  pbar.style.left = (pct - 100) + '%';
  if (pct >= 100) {
    setTimeout(() => {
      preloader.style.transition = 'opacity 0.7s ease';
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        initHero();
      }, 700);
    }, 300);
  }
}, 80);

// ── HERO ANIMATIONS ──
function initHero() {
  function fadeIn(el, delay) {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }
  fadeIn(document.querySelector('.hero-eyebrow'), 100);
  fadeIn(document.querySelector('.hero-h1'), 300);
  fadeIn(document.querySelector('.hero-meta'), 600);
  const scroll = document.querySelector('.hero-scroll');
  if (scroll) setTimeout(() => {
    scroll.style.transition = 'opacity 0.6s';
    scroll.style.opacity = '1';
  }, 900);

  document.querySelectorAll('.count').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── HAMBURGER / MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileItems = document.querySelectorAll('.mobile-nav-item');
const mobileLang = document.querySelector('.mobile-lang');
let menuOpen = false;

// Nummers toevoegen aan mobiele menu items
mobileItems.forEach((item, i) => {
  const num = document.createElement('span');
  num.style.cssText = 'font-family:var(--font-caps);font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.18);margin-right:20px;vertical-align:middle;';
  num.textContent = String(i + 1).padStart(2, '0');
  item.prepend(num);
});

function openMenu() {
  menuOpen = true;
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.cssText = 'transition:all 0.3s;transform:rotate(45deg) translate(4px,4px)';
  spans[1].style.cssText = 'transition:all 0.2s;opacity:0';
  spans[2].style.cssText = 'transition:all 0.3s;transform:rotate(-45deg) translate(4px,-4px)';
  mobileItems.forEach((item, i) => {
    setTimeout(() => {
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 + i * 70);
  });
  setTimeout(() => {
    mobileLang.style.transition = 'opacity 0.5s ease';
    mobileLang.style.opacity = '1';
  }, 450);
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.cssText = 'transition:all 0.3s;transform:none';
  spans[1].style.cssText = 'transition:all 0.3s;opacity:1';
  spans[2].style.cssText = 'transition:all 0.3s;transform:none';
  mobileItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
  });
  mobileLang.style.opacity = '0';
}

hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
mobileItems.forEach(item => item.addEventListener('click', closeMenu));

// ── FILTER LOGICA ──
const filterTabs = document.querySelectorAll('.filter-tab');
const cards = document.querySelectorAll('.project-card');
const projCount = document.getElementById('projCount');
const noResults = document.getElementById('noResults');
const catItems = document.querySelectorAll('.cat-item');

function filterProjects(filter) {
  let visible = 0;
  cards.forEach(card => {
    const show = filter === 'all' || card.dataset.cat === filter;
    card.style.display = show ? 'block' : 'none';
    if (show) visible++;
  });
  const label = filter === 'all' ? 'Alle projecten' : filter.charAt(0).toUpperCase() + filter.slice(1);
  projCount.innerHTML = `${label} — <strong>${visible}</strong> realisaties`;
  noResults.classList.toggle('show', visible === 0);
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterProjects(tab.dataset.f);
  });
});

catItems.forEach(item => {
  item.addEventListener('click', () => {
    const filter = item.dataset.filter;
    filterTabs.forEach(t => t.classList.remove('active'));
    const matchTab = document.querySelector(`.filter-tab[data-f="${filter}"]`);
    if (matchTab) matchTab.classList.add('active');
    filterProjects(filter);
    document.getElementById('filters').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── MODAL ──
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

cards.forEach(card => {
  const expandBtn = card.querySelector('.card-expand-btn');
  function openModal() {
    const bgClass = [...card.querySelector('.card-placeholder').classList]
      .find(c => /^p\d$/.test(c));
    document.getElementById('modalImgPlaceholder').className = 'modal-img-placeholder ' + (bgClass || '');
    document.getElementById('modalCat').textContent   = card.dataset.type;
    document.getElementById('modalTitle').textContent = card.dataset.title;
    document.getElementById('modalDesc').textContent  = card.dataset.desc;
    document.getElementById('modalLoc').textContent   = card.dataset.location;
    document.getElementById('modalArea').textContent  = card.dataset.area;
    document.getElementById('modalType').textContent  = card.dataset.type;
    document.getElementById('modalYear').textContent  = card.dataset.year;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  if (expandBtn) expandBtn.addEventListener('click', e => { e.stopPropagation(); openModal(); });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); if (menuOpen) closeMenu(); }
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal-fade').forEach(el => observer.observe(el));

// ── COUNT UP (statistieken) ──
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.cnt2').forEach(el => {
        const target = parseInt(el.dataset.t);
        let current = 0;
        const step = target / 80;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current);
          if (current >= target) clearInterval(timer);
        }, 20);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('#interlude').forEach(el => statObserver.observe(el));

// ── PARALLAX HERO (muisbeweging) ──
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 15;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;
  const h1 = document.querySelector('.hero-h1');
  if (h1) h1.style.transform = `translate(${x * 0.4}px, ${y * 0.3}px)`;
});
