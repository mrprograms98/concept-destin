window.addEventListener("load", function() {
        setTimeout(() => {
            document.querySelector(".preloader").classList.add("fade-out");
        }, 2200);
    });
document.addEventListener('DOMContentLoaded', () => {
  // --- CORE VARIABLES (één bron van waarheid) ---
  const slides = Array.from(document.querySelectorAll('.bg-slide'));
if (!slides.length) {
    // Geen slides → sla ALLEEN de achtergrond-slider functionaliteit over
    enableUI(); 
    return;
}
 // geen slides, nothing to do

  let activeIndex = 0;
  let isChanging = false;
  const CHANGE_COOLDOWN = 800; // ms

  // Zorg dat EXACT maar 1 slide active is
  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
  }

  // init
  showSlide(activeIndex);

  // --- SCROLL (wheel) ---
  window.addEventListener('wheel', (e) => {
    if (isChanging) return;
    isChanging = true;

    if (e.deltaY > 0) {
      activeIndex = (activeIndex + 1) % slides.length;
    } else if (e.deltaY < 0) {
      activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    }

    showSlide(activeIndex);
    setTimeout(() => { isChanging = false; }, CHANGE_COOLDOWN);
  }, { passive: true });

  // --- KNOPPEN (prev / next) ---
  const btnNext = document.getElementById('bg-next');
  const btnPrev = document.getElementById('bg-prev');

  // Safety: maak de knoppen zichtbaar/enabled alleen als ze bestaan
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isChanging) return;
      isChanging = true;
      activeIndex = (activeIndex + 1) % slides.length;
      showSlide(activeIndex);
      setTimeout(() => { isChanging = false; }, CHANGE_COOLDOWN);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isChanging) return;
      isChanging = true;
      activeIndex = (activeIndex - 1 + slides.length) % slides.length;
      showSlide(activeIndex);
      setTimeout(() => { isChanging = false; }, CHANGE_COOLDOWN);
    });
  }

  // --- OPTIONEEL: klik ergens op de pagina verandert ook (indien gewenst) ---
  // Als je wilt dat álle klikken (behalve op knoppen) ook wisselen, uncomment:
  // document.addEventListener('click', (e) => {
  //   if (e.target.closest('#bg-next') || e.target.closest('#bg-prev')) return;
  //   if (isChanging) return;
  //   isChanging = true;
  //   activeIndex = (activeIndex + 1) % slides.length;
  //   showSlide(activeIndex);
  //   setTimeout(() => { isChanging = false; }, CHANGE_COOLDOWN);
  // });

  // --- EXTRA: auto-hide arrows als gebruiker 3s niet beweegt ---
  let idleTimer;
  const arrows = document.querySelectorAll('.bg-arrow');
  function showArrows() {
    arrows.forEach(a => a.classList.remove('hidden'));
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => arrows.forEach(a => a.classList.add('hidden')), 3000);
  }
  // show arrows bij muis bewegen of toetsen
  ['mousemove','touchstart','keydown'].forEach(ev => window.addEventListener(ev, showArrows, { passive: true }));
  // init hide timer
  showArrows();

  // --- WhatsApp knop safe bind (als aanwezig) ---
  const whatsapp = document.getElementById('whatsappBtn');
  if (whatsapp) {
    whatsapp.addEventListener('click', () => window.open('https://wa.me/31612345678','_blank'));
  }

  // --- Hamburger binding (veilig) ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('open');
    });

    hamburger.addEventListener('click', () => {
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('is-active');
      if (hamburger.classList.contains('is-active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '1';
          spans[2].style.transform = '';
      }
    });
  }
});
function enableUI() {
  // WhatsApp knop
  const whatsapp = document.getElementById('whatsappBtn');
  if (whatsapp) {
    whatsapp.addEventListener('click', () => window.open('https://wa.me/31612345678','_blank'));
  }

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('open');
    });

    hamburger.addEventListener('click', () => {
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('is-active');
      if (hamburger.classList.contains('is-active')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '1';
          spans[2].style.transform = '';
      }
    });
  }
}

