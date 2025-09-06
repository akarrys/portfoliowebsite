// Mobile nav: toggle + accessibility + overlay close
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

  // Close when clicking a nav link (mobile)
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
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

// Year in footer
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
