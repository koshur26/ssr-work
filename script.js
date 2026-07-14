/* ====================================================
   SSR & Associates — Script
   ==================================================== */

// ── DISCLAIMER GATE ──
const DISCLAIMER_KEY = 'ssrDisclaimerAccepted';

function activateApp(instant) {
  const gate = document.getElementById('gate');
  const app  = document.getElementById('app');

  gate.style.display = 'none';
  app.style.display  = 'block';

  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-in').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), instant ? 0 : i * 100);
    });
  });

  initScrollObserver();
  updateActiveNav();
}

// Already accepted on a previous page/visit? Skip the gate immediately.
let alreadyAccepted = false;
try {
  alreadyAccepted = localStorage.getItem(DISCLAIMER_KEY) === 'true';
} catch (e) {
  // localStorage unavailable (private mode, etc.) — gate will show as normal.
}

if (alreadyAccepted) {
  activateApp(true);
}

document.getElementById('acceptBtn').addEventListener('click', function () {
  try {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
  } catch (e) {
    // If storage isn't available, the gate will simply show again next visit.
  }

  const gate = document.getElementById('gate');
  gate.style.transition = 'opacity 0.7s ease';
  gate.style.opacity = '0';

  setTimeout(() => {
    activateApp(false);
  }, 700);
});

// ── MOBILE MENU ──
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── SCROLL ANIMATIONS ──
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── ACTIVE NAV HIGHLIGHT ──
function updateActiveNav() {
  const sections = ['hero', 'about', 'practice', 'contact'];

  window.addEventListener('scroll', () => {
    let current = 'hero';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 90) current = id;
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const fragment = href.includes('#') ? href.split('#')[1] : null;
      a.classList.toggle('active', fragment === current);
    });
  });
}

// ── SMOOTH SCROLL ──
// Matches plain "#section" links AND same-page links like "/index.html#section".
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
  const href = anchor.getAttribute('href');
  const [path, fragment] = href.split('#');
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  const linkPath = (path || '').replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  const isSamePage = !path || linkPath === currentPath;

  if (!fragment || !isSamePage) return;

  anchor.addEventListener('click', function (e) {
    const target = document.getElementById(fragment);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── PHOTO UPLOAD (dev helper — replace placeholder with actual photo) ──
const photoInput = document.getElementById('photoInput');
if (photoInput) {
  photoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const placeholder = document.getElementById('photoPlaceholder');
      placeholder.innerHTML = `<img src="${e.target.result}" alt="Adv. Syed Sibtain Razvi"
        style="width:100%;height:100%;object-fit:cover;border-radius:180px 180px 120px 120px;">`;
    };
    reader.readAsDataURL(file);
  });
}
