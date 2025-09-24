// Portfolio Interactions & Dynamic Content

const portfolioGrid = document.getElementById('portfolioGrid');
const loadMoreButton = document.getElementById('loadMore');
const yearSpan = document.getElementById('year');
// removed dynamic sections

function setCurrentYear() {
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function generateRandomSeed() {
  return Math.random().toString(36).slice(2);
}

function createWorkCard(index) {
  const seed = `${Date.now()}-${index}-${generateRandomSeed()}`;
  const width = 600;
  const height = 400;
  const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

  const card = document.createElement('article');
  card.className = 'work-card tilt';
  card.setAttribute('data-tilt', '');
  card.setAttribute('data-reveal', '');

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Random inspiration from Picsum';
  img.loading = 'lazy';

  const meta = document.createElement('div');
  meta.className = 'work-meta';

  const title = document.createElement('h4');
  title.className = 'work-title';
  title.textContent = 'Visual Concept';

  const sub = document.createElement('p');
  sub.className = 'work-sub';
  sub.textContent = 'Randomized from Picsum';

  meta.appendChild(title);
  meta.appendChild(sub);
  card.appendChild(img);
  card.appendChild(meta);
  return card;
}

function loadPortfolio(batchSize = 9) {
  if (!portfolioGrid) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < batchSize; i++) {
    const card = createWorkCard(i);
    fragment.appendChild(card);
  }
  portfolioGrid.appendChild(fragment);
  requestAnimationFrame(() => revealOnScroll());
}


// Simple tilt interaction
function attachTiltEffects() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  const perspective = 800;
  const maxTilt = 10; // degrees

  tiltElements.forEach((el) => {
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform .15s ease';

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const px = (e.clientX - cx) / (rect.width / 2);
      const py = (e.clientY - cy) / (rect.height / 2);
      const rotateY = Math.max(Math.min(px * maxTilt, maxTilt), -maxTilt);
      const rotateX = Math.max(Math.min(-py * maxTilt, maxTilt), -maxTilt);
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function onLeave() {
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

// Reveal on scroll
let revealObserver;
function initRevealObserver() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (revealObserver) {
    elements.forEach((el) => revealObserver.observe(el));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((el) => revealObserver.observe(el));
}

// Mobile nav toggle
function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // close on link click (mobile)
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Smooth scroll and scrollspy
function setupScrollBehavior() {
  const navLinks = document.querySelectorAll('.nav-links a[data-link]');
  // smooth scroll
  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    });
  });

  // scrollspy
  const sections = Array.from(navLinks).map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const onScroll = () => {
    const scrollPos = window.scrollY + 90; // account for header
    let current;
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach((a) => a.classList.remove('active'));
    if (current) {
      const active = document.querySelector(`.nav-links a[href="#${current.id}"]`);
      if (active) active.classList.add('active');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Contact form (no backend)
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const message = String(fd.get('message') || '').trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill out all fields.';
      status.style.color = 'var(--danger)';
      return;
    }

    status.textContent = 'Thanks! Your message has been prepared (no backend).';
    status.style.color = 'var(--fg-dim)';
    form.reset();
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  setupNavToggle();
  setupScrollBehavior();
  attachTiltEffects();
  loadPortfolio(9);
  initRevealObserver();
  setupContactForm();
});

// About Read More/Less toggles
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle-more');
  if (!btn) return;
  const card = btn.closest('.about-card');
  if (!card) return;
  const expanded = card.classList.toggle('expanded');
  const text = card.querySelector('.about-text');
  if (text) {
    if (expanded) {
      text.classList.remove('clamp');
      btn.textContent = 'Read Less';
    } else {
      text.classList.add('clamp');
      btn.textContent = 'Read More';
    }
  }
});


