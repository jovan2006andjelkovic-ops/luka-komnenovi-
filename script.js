// =====================================================
// LUKA.K — shared site behavior
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaq();
  initContactForm();
  initOrderForm();
  initHeaderShadowOnScroll();
});

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all others (accordion behavior)
      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------- Contact form (landing page) ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const success = document.getElementById('contact-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.style.display = 'none';
    if (success) success.classList.add('show');
    if (success) success.setAttribute('tabindex', '-1');
    if (success) success.focus();
  });
}

/* ---------- Order form (narucivanje page) ---------- */
function initOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  const success = document.getElementById('order-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.style.display = 'none';
    if (success) success.classList.add('show');
    if (success) success.setAttribute('tabindex', '-1');
    if (success) success.focus();
  });
}

/* ---------- Subtle header background on scroll ---------- */
function initHeaderShadowOnScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
      } else {
        header.style.boxShadow = 'none';
      }
    },
    { passive: true }
  );
}
