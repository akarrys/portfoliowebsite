'use strict';

// Tiny helpers
const qs  = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

// Update CSS vars for header height & scroll offset
(function syncHeaderVars(){
  const header = qs('#site-header');
  const setVars = () => {
    const h = header ? header.offsetHeight : 64;
    document.documentElement.style.setProperty('--header-h', h + 'px');
    document.documentElement.style.setProperty('--scroll-mt', (h + 12) + 'px');
  };
  setVars();
  window.addEventListener('resize', setVars);
})();

// Mobile nav + overlay
(function navController(){
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

  toggle.addEventListener('click', () => nav.classList.contains('is-open') ? close() : open());
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });

  // Dropdown (More)
  const ddItem = qs('.menu-item--has-dropdown', nav);
  const ddBtn  = qs('.dropdown__toggle', ddItem || undefined);
  const ddMenu = qs('#more-submenu', ddItem || undefined);

  if (ddItem && ddBtn && ddMenu) {
    const ddOpen  = () => { ddBtn.setAttribute('aria-expanded', 'true'); ddMenu.hidden = false; ddItem.classList.add('open'); };
    const ddClose = () => { ddBtn.setAttribute('aria-expanded', 'false'); ddMenu.hidden = true; ddItem.classList.remove('open'); };

    ddBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ddMenu.hidden ? ddOpen() : ddClose();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!ddMenu.hidden && !ddItem.contains(e.target)) ddClose();
    });

    // Keyboard close
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') ddClose(); });
  }

  // Close nav when a nav button is clicked (mobile)
  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav__btn');
    if (btn && nav.classList.contains('is-open')) close();
  });
})();

// JS-driven precise scrolling (no anchors)
(function scrollButtons(){
  const header = qs('#site-header');
  const buttons = qsa('.nav__btn, .js-scroll');

  const scrollToTarget = (selector) => {
    const target = qs(selector);
    if (!target) return;
    const h = header ? header.offsetHeight : 64;
    const top = window.scrollY + target.getBoundingClientRect().top - (h + 12);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const to = btn.getAttribute('data-target');
      if (to) scrollToTarget(to);
    });
  });
})();

// Reveal on scroll
(function revealOnScroll(){
  const els = qsa('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) { els.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

// Scroll-spy (accurate active state)
(function scrollSpy(){
  const btns = qsa('.nav__btn');
  const ids  = btns.map(b => b.dataset.target).filter(Boolean);
  const secs = ids.map(id => qs(id)).filter(Boolean);
  if (!secs.length) return;

  const setActive = (id) => {
    btns.forEach(b => b.classList.toggle('is-active', b.dataset.target === id));
  };

  const onScroll = () => {
    const h = (qs('#site-header')?.offsetHeight || 64) + 12;
    const pos = window.scrollY + h;
    let current = ids[0];
    for (let i = 0; i < secs.length; i++) {
      if (pos >= secs[i].offsetTop) current = ids[i];
    }
    setActive(current);
  };

  // Run & bind
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();

// Back-to-top button visibility + action
(function backToTop(){
  const btn = qs('.fab-top');
  if(!btn) return;
  const toggle = () => { (window.scrollY > 400) ? btn.classList.add('show') : btn.classList.remove('show'); };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Theme toggle with localStorage
(function themeToggle(){
  const btn = qs('#theme-toggle');
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
      root.removeAttribute('data-theme');
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

// Footer year
(function footerYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
