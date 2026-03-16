/* ===========================
   LEOTTA MOTORS — main.js
   Improved navigation & UX
   =========================== */

// ── LOADER ──────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

// ── NAVBAR SCROLL ────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── MOBILE MENU ──────────────────────────────────────
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.style.opacity = '0';
    setTimeout(() => {
      menu.classList.remove('open');
      menu.style.opacity = '';
    }, 300);
  } else {
    menu.classList.add('open');
    requestAnimationFrame(() => { menu.style.opacity = '1'; });
  }
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

// Close mobile menu on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) {
      toggleMenu();
    }
  }
});

// ── SCROLL ANIMATIONS ────────────────────────────────
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── SMOOTH SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── ACTIVE NAV TRACKING ──────────────────────────────
const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
const sections = [];
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  const section = document.querySelector(href);
  if (section) sections.push({ el: section, link });
});

function updateActiveNav() {
  const scrollY = window.scrollY + 150;
  let current = null;
  sections.forEach(({ el, link }) => {
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (scrollY >= top && scrollY < bottom) current = link;
  });
  navLinks.forEach(l => l.classList.remove('active'));
  if (current) current.classList.add('active');
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ── BACK TO TOP ──────────────────────────────────────
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── SERVICE TABS ─────────────────────────────────────
const serviceTabs = document.querySelectorAll('.service-tab');
const servicePanels = document.querySelectorAll('.service-panel');

serviceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    // Update tabs
    serviceTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // Update panels
    servicePanels.forEach(p => {
      p.classList.remove('active');
      if (p.id === target) p.classList.add('active');
    });
  });
});

// ── CATALOG FILTERS ──────────────────────────────────
const filterBrand = document.getElementById('filterBrand');
const filterType = document.getElementById('filterType');
const filterBudget = document.getElementById('filterBudget');
const filterFormula = document.getElementById('filterFormula');
const filterReset = document.getElementById('filterReset');
const catalogGrid = document.getElementById('catalogGrid');
const catalogEmpty = document.getElementById('catalogEmpty');

function applyFilters() {
  if (!catalogGrid) return;
  const cards = catalogGrid.querySelectorAll('.catalog-card');
  const brand = filterBrand ? filterBrand.value : '';
  const type = filterType ? filterType.value : '';
  const budget = filterBudget ? filterBudget.value : '';
  const formula = filterFormula ? filterFormula.value : '';

  let visibleCount = 0;

  cards.forEach(card => {
    let show = true;
    if (brand && card.dataset.brand !== brand) show = false;
    if (type && card.dataset.type !== type) show = false;
    if (formula && card.dataset.formula !== formula) show = false;
    if (budget) {
      const price = parseInt(card.dataset.price, 10);
      if (budget === '500' && price > 500) show = false;
      if (budget === '1000' && (price <= 500 || price > 1000)) show = false;
      if (budget === '2000' && (price <= 1000 || price > 2000)) show = false;
      if (budget === '2001' && price <= 2000) show = false;
    }
    card.classList.toggle('hidden', !show);
    if (show) visibleCount++;
  });

  if (catalogEmpty) {
    catalogEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

function resetFilters() {
  if (filterBrand) filterBrand.value = '';
  if (filterType) filterType.value = '';
  if (filterBudget) filterBudget.value = '';
  if (filterFormula) filterFormula.value = '';
  applyFilters();
}

// Add listeners
[filterBrand, filterType, filterBudget, filterFormula].forEach(el => {
  if (el) el.addEventListener('change', applyFilters);
});
if (filterReset) filterReset.addEventListener('click', resetFilters);

// ── FORM HANDLING ────────────────────────────────────
const formSubmit = document.getElementById('formSubmit');
const formSuccess = document.getElementById('formSuccess');
const formName = document.getElementById('formName');
const formPhone = document.getElementById('formPhone');

if (formSubmit) {
  formSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    // Simple validation
    if (formName && !formName.value.trim()) {
      formName.focus();
      formName.style.borderColor = '#c0392b';
      setTimeout(() => { formName.style.borderColor = ''; }, 2000);
      return;
    }
    if (formPhone && !formPhone.value.trim()) {
      formPhone.focus();
      formPhone.style.borderColor = '#c0392b';
      setTimeout(() => { formPhone.style.borderColor = ''; }, 2000);
      return;
    }
    // Show success
    formSubmit.style.display = 'none';
    if (formSuccess) formSuccess.style.display = 'flex';
    // Reset after a while
    setTimeout(() => {
      formSubmit.style.display = '';
      if (formSuccess) formSuccess.style.display = 'none';
      if (formName) formName.value = '';
      if (formPhone) formPhone.value = '';
      const formCar = document.getElementById('formCar');
      if (formCar) formCar.value = '';
    }, 5000);
  });
}

// ── VEHICLE CARD CTA VISIBILITY ON MOBILE ────────────
// On touch devices, show CTA buttons always
if ('ontouchstart' in window) {
  document.querySelectorAll('.vehicle-card-btn').forEach(btn => {
    btn.style.opacity = '1';
    btn.style.transform = 'translateY(0)';
  });
}
