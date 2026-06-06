/* ─────────────────────────────────────────
   AA Code Lab — script.js
───────────────────────────────────────── */

'use strict';

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
function handleNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavbar, { passive: true });
handleNavbar();

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ── Back to top ── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function addReveal(selector, stagger = false) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (stagger) el.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(el);
  });
}
addReveal('.service-card', true);
addReveal('.pricing-card', true);
addReveal('.why-card', true);
addReveal('.testi-card', true);
addReveal('.about-card', true);
addReveal('.section-title');
addReveal('.section-sub');

/* ── Animated Counters ── */
function animateCount(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      animateCount(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Contact Form Validation ── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field)  field.classList.add('error');
  if (err)    err.textContent = msg;
}
function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.remove('error');
  if (err)   err.textContent = '';
}

['fname','email','service','message'].forEach(id => {
  const field = document.getElementById(id);
  if (field) field.addEventListener('input', () => clearError(id, id + 'Err'));
  if (field) field.addEventListener('change', () => clearError(id, id + 'Err'));
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form && form.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  const fname   = document.getElementById('fname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  if (!fname) { showError('fname', 'fnameErr', 'Full name is required.'); valid = false; }
  if (!email) { showError('email', 'emailErr', 'Email address is required.'); valid = false; }
  else if (!isValidEmail(email)) { showError('email', 'emailErr', 'Please enter a valid email.'); valid = false; }
  if (!service) { showError('service', 'serviceErr', 'Please select a service.'); valid = false; }
  if (!message) { showError('message', 'messageErr', 'Please describe your requirements.'); valid = false; }

  if (!valid) return;

  // Simulate form submission
  const submitBtn  = form.querySelector('.submit-btn');
  const btnText    = form.querySelector('.btn-text');
  const btnLoader  = form.querySelector('.btn-loader');

  submitBtn.disabled = true;
  btnText.style.display  = 'none';
  btnLoader.style.display = 'inline';

  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    btnText.style.display  = 'inline';
    btnLoader.style.display = 'none';
    formSuccess.style.display = 'block';
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  }, 1600);
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => activeSectionObserver.observe(s));

/* ── Typing tag line (optional flourish in hero badge) ── */
// nothing heavy, just a subtle pulse already handled in CSS
