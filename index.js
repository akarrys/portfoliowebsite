// Header nav: toggle mobile menu and accessibility hooks
(function(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');

  if(!nav || !toggle || !menu) return;

  const open = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };
  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const isOpen = () => nav.classList.contains('is-open');

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });

  // close when clicking a link
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
document.getElementById('year').textContent = new Date().getFullYear();
