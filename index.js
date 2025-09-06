// Helpers
const qs  = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

// Set dynamic scroll offset (header height) for anchor jumps
(function setScrollMargin() {
  const header = qs('#site-header');
  const set = () => {
    const h = header ? header.offsetHeight : 64;
    document.documentElement.style.setProperty('--scroll-mt', (h + 8) + 'px');
  };
  set();
  window.addEventListener('resize', set);
})();

// Mobile nav: toggle + overlay + accessibility
(function(){
  const nav = qs('.nav');
  const toggle = qs('.nav__toggle');
  const menu = qs('#nav-menu');
  const overlay = qs('.nav__overlay');

  if(!nav || !toggle || !menu || !overlay) return;

  const open = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
  };
  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
  };
  const isOpen = () => nav.classList.contains('is-open');

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });

  // Close on link click (mobile)
  qsa('.nav__menu a', menu).forEach(a => a.addEventListener('click', () => {
    if (isOpen()) close();
  }));

  // Dropdown toggle (mobile & desktop click)
  const ddBtn  = qs('.dropdown__toggle', nav);
  const ddMenu = qs('#more-submenu', nav);
  if (ddBtn && ddMenu) {
    const ddClose = () => { ddBtn.setAttribute('aria-expanded', 'false'); ddMenu.hidden = true; };
    const ddOpen  = () => { ddBtn.setAttribute('aria-expanded', 'true');  ddMenu.hidden = false; };

    ddBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ddMenu.hidden ? ddOpen() : ddClose();
    });
    document.addEventListener('click', (e) => {
      if (!ddMenu.hidden && !nav.contains(e.target)) ddClose();
    });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') ddClose(); });
  }
})();

// Smooth scroll with exact header offset
(function(){
  const header = qs('#site-header');
  const scrollToId = (id) => {
    const target = qs(id);
    if (!target) return;
    const headerH = header ? header.offsetHeight : 64;
    const y = window.scrollY + target.getBoundingClientRect().top - (headerH + 8);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      // Ignore empty or just "#" links
      if (!id || id === '#') return;
      const target = qs(id);
      if (target) {
        e.preventDefault();
        scrollToId(id);
        history.replaceState(null, '', id);
      }
    });
  });
})();

// Reveal on scroll
(function(){
  const els = qsa('.reveal');
  if (!els.length) return;
  const show = el => el.classList.add('is-visible');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { show(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(show);
  }
})();

// Scroll-spy: accurate active link highlighting
(function(){
  const links = qsa('.nav__link');
  const map   = links.map(a => a.getAttribute('href')).filter(h => h && h.startsWith('#'));
  const secs  = map.map(h => qs(h)).filte
