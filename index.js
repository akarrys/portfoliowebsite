// Minimal, fast JS

// Year
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Mobile menu
(function(){
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!nav || !toggle || !menu) return;

  const open  = () => { nav.classList.add('nav-open');  toggle.setAttribute('aria-expanded','true');  };
  const close = () => { nav.classList.remove('nav-open'); toggle.setAttribute('aria-expanded','false'); };

  toggle.addEventListener('click', () => {
    nav.classList.contains('nav-open') ? close() : open();
  });

  // Close when clicking a link (mobile)
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// Keep section offset accurate (if header height changes)
(function(){
  const header = document.getElementById('site-header');
  const set = () => {
    const h = header ? header.offsetHeight : 64;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  };
  set();
  window.addEventListener('resize', set);
})();
