// Mobile nav: toggle + overlay + accessibility
(function(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  const overlay = document.querySelector('.nav__overlay');

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
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Dropdown toggle (works on mobile + desktop click)
  const ddBtn = document.querySelector('.dropdown__toggle');
  const ddMenu = document.getElementById('more-submenu');
  if (ddBtn && ddMenu) {
    const ddClose = () => {
      ddBtn.setAttribute('aria-expanded', 'false');
      ddMenu.hidden = true;
    };
    const ddOpen = () => {
      ddBtn.setAttribute('aria-expanded', 'true');
      ddMenu.hidden = false;
    };
    ddBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ddMenu.hidden ? ddOpen() : ddClose();
    });
    document.addEventListener('click', (e) => {
      if (!ddMenu.hidden && !ddMenu.contains(e.target) && e.target !== ddBtn) ddClose();
    });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') ddClose(); });
  }
})();

// Reveal on scroll
(function(){
  const els = document.querySelectorAll('.reveal');
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

// Scroll-spy: highlight nav link for the section in view
(function(){
  const links = [...document.querySelectorAll('.nav__link')];
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href'), a]));
  const setActive = (id) => {
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
  };

  const io = new IntersectionObserver((entries) => {
    // choose the entry most in view
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) {
      const id = '#'+visible[0].target.id;
      setActive(id);
    }
  }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

  sections.forEach(sec => io.observe(sec));
})();

// Smooth scroll (offset is handled by CSS scroll-margin-top)
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', id); // update URL hash
      }
    });
  });
})();

// FAB: back to top
(function(){
  const btn = document.querySelector('.fab-top');
  if(!btn) return;
  const toggle = () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Theme toggle with localStorage
(function(){
  const btn = document.getElementById('theme-toggle');
  if(!btn) return;

  const root = document.documentElement;
  const KEY = 'ak_theme';
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  const apply = (theme) => {
    if(theme === 'light'){
      root.setAttribute('data-theme', 'light');
      btn.setAttribute('aria-pressed', 'true');
      btn.querySelector('.theme-toggle__icon').textContent = '☀️';
      btn.title = 'Switch to dark';
    }else{
      root.removeAttribute('data-theme'); // default dark
      btn.setAttribute('aria-pressed', 'false');
      btn.querySelector('.theme-toggle__icon').textContent = '🌙';
      btn.title = 'Switch to light';
    }
  };

  const saved = localStorage.getItem(KEY);
  const initial = saved || (prefersLight ? 'light' : 'dark');
  apply(initial);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    apply(next);
    localStorage.setItem(KEY, next);
  });
})();
