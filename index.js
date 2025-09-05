// Hamburger Toggle (robust)
(function(){
  const hamBtn = document.querySelector('.header__main-ham-menu-cont');
  const smallMenu = document.querySelector('.header__sm-menu');
  const iconOpen = document.querySelector('.header__main-ham-menu');
  const iconClose = document.querySelector('.header__main-ham-menu-close');
  const links = document.querySelectorAll('.header__sm-menu-link a');
  if(!hamBtn || !smallMenu) return;
  const openMenu = () => {
    smallMenu.classList.add('header__sm-menu--active');
    iconOpen && iconOpen.classList.add('d-none');
    iconClose && iconClose.classList.remove('d-none');
    hamBtn.setAttribute('aria-expanded','true');
    document.body.classList.add('no-scroll');
  };
  const closeMenu = () => {
    smallMenu.classList.remove('header__sm-menu--active');
    iconOpen && iconOpen.classList.remove('d-none');
    iconClose && iconClose.classList.add('d-none');
    hamBtn.setAttribute('aria-expanded','false');
    document.body.classList.remove('no-scroll');
  };
  const toggle = () => smallMenu.classList.contains('header__sm-menu--active') ? closeMenu() : openMenu();
  hamBtn.addEventListener('click', toggle);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
  links.forEach(a => a.addEventListener('click', closeMenu));
})();

// Logo click
const headerLogoContainer = document.querySelector('.header__logo-container');
if (headerLogoContainer) {
  headerLogoContainer.addEventListener('click', () => location.href = 'index.html');
}

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
