// =====================================================
// LUKA.K — shared site behavior
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaq();
  initContactForm();
  initOrderForm();
  initHeaderShadowOnScroll();
  initScrollReveal();
  initBeforeAfterSliders();
});

/* ---------- Fade-and-slide-up on scroll ---------- */
function initScrollReveal() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach((section) => section.classList.add('reveal'));

  // If reduced motion is preferred, or IntersectionObserver isn't supported,
  // just show everything immediately instead of animating.
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

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

/* ---------- Before/after transformation sliders ---------- */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('[data-ba-slider]');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const beforeImage = slider.querySelector('.ba-before');
    const divider = slider.querySelector('.ba-divider');
    const handle = slider.querySelector('.ba-handle');
    if (!beforeImage || !divider || !handle) return;

    let dragging = false;

    function setPosition(percent) {
      const clamped = Math.min(100, Math.max(0, percent));
      beforeImage.style.clipPath = 'inset(0 ' + (100 - clamped) + '% 0 0)';
      divider.style.left = clamped + '%';
      handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
    }

    function percentFromClientX(clientX) {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function startDrag(clientX, pointerId) {
      dragging = true;
      slider.classList.add('is-dragging');
      if (pointerId !== undefined && handle.setPointerCapture) {
        try {
          handle.setPointerCapture(pointerId);
        } catch (err) {
          /* ignore unsupported capture */
        }
      }
      setPosition(percentFromClientX(clientX));
    }

    function moveDrag(clientX) {
      if (!dragging) return;
      setPosition(percentFromClientX(clientX));
    }

    function endDrag() {
      dragging = false;
      slider.classList.remove('is-dragging');
    }

    // Pointer Events cover mouse, touch, and pen in one API.
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.pointerId);
    });

    slider.addEventListener('pointerdown', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      startDrag(e.clientX);
    });

    window.addEventListener('pointermove', (e) => moveDrag(e.clientX));
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Keyboard accessibility: arrow keys move the divider by 5%.
    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(divider.style.left) || 50;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setPosition(current - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setPosition(current + 5);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setPosition(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        setPosition(100);
        e.preventDefault();
      }
    });

    setPosition(50);
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
