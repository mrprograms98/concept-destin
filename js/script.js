// --- Preloader fade-out ---
window.addEventListener("load", () => {
    setTimeout(() => {
        const preloader = document.querySelector(".preloader");
        if (preloader) preloader.classList.add("fade-out");
    }, 2200);
});

document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTEN ---
    const slides = Array.from(document.querySelectorAll('.bg-slide'));
    const btnNext = document.getElementById('bg-next');
    const btnPrev = document.getElementById('bg-prev');
    const arrows = document.querySelectorAll('.bg-arrow');
    const whatsapp = document.getElementById('whatsappBtn');

    const hamburger = document.getElementById('hamburger');
    const menu = document.querySelector('.nav-menu');

    // --- HAMBURGER MENU ---
    if (hamburger && menu) {
        hamburger.addEventListener("click", () => {
            menu.classList.toggle("active");
            document.body.classList.toggle("menu-open");
            hamburger.classList.toggle("active"); // voor animatie
        });
    }

    // --- SLIDESHOW ---
    if (slides.length) {
        let activeIndex = 0;
        let isChanging = false;
        const CHANGE_COOLDOWN = 800;

        const showSlide = (index) =>
            slides.forEach((s, i) => s.classList.toggle('active', i === index));

        showSlide(activeIndex);

        window.addEventListener('wheel', (e) => {
            if (isChanging) return;
            isChanging = true;
            activeIndex = e.deltaY > 0
                ? (activeIndex + 1) % slides.length
                : (activeIndex - 1 + slides.length) % slides.length;
            showSlide(activeIndex);
            setTimeout(() => isChanging = false, CHANGE_COOLDOWN);
        }, { passive: true });

        if (btnNext) btnNext.addEventListener('click', () => {
            if (isChanging) return;
            isChanging = true;
            activeIndex = (activeIndex + 1) % slides.length;
            showSlide(activeIndex);
            setTimeout(() => isChanging = false, CHANGE_COOLDOWN);
        });

        if (btnPrev) btnPrev.addEventListener('click', () => {
            if (isChanging) return;
            isChanging = true;
            activeIndex = (activeIndex - 1 + slides.length) % slides.length;
            showSlide(activeIndex);
            setTimeout(() => isChanging = false, CHANGE_COOLDOWN);
        });

        let idleTimer;
        const showArrows = () => {
            arrows.forEach(a => a.classList.remove('hidden'));
            clearTimeout(idleTimer);
            idleTimer = setTimeout(
                () => arrows.forEach(a => a.classList.add('hidden')),
                3000
            );
        };

        ['mousemove','touchstart','keydown']
            .forEach(ev => window.addEventListener(ev, showArrows, { passive: true }));

        showArrows();
    }

    // --- WhatsApp knop ---
    if (whatsapp) {
        whatsapp.addEventListener('click', () =>
            window.open('https://wa.me/31612345678','_blank')
        );
    }

});

