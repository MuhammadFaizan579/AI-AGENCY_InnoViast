/* ============================================================
   INNOVIAST — script.js
   GSAP-powered animations (Vercel/Stripe/Linear-grade)
   ============================================================ */

// Add .js class immediately so CSS knows JS is active (prevents FOUC)
document.documentElement.classList.add('js');

// ── Reduced motion check ─────────────────────────────────────
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── GSAP setup (registered ONCE) ─────────────────────────────
gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

// ============================================================
// 1. NAVBAR — scroll effect + active link + mobile menu
// ============================================================
function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop   = document.getElementById('menuBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
  const navLinks   = document.querySelectorAll('.nav-links a');

  // Scrolled state
  ScrollTrigger.create({
    start: 'top -40',
    end: 99999,
    onUpdate: (self) => {
      navbar.classList.toggle('scrolled', self.scroll() > 40);
    }
  });

  // Mobile menu open/close (with stagger)
  const openMenu = () => {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    backdrop && backdrop.classList.add('show');
    hamburger.setAttribute('aria-expanded', 'true');
    if (REDUCE_MOTION) return;
    gsap.fromTo(
      '.mobile-menu > *',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power2.out' }
    );
  };
  const closeMenu = () => {
    if (!REDUCE_MOTION) {
      gsap.to('.mobile-menu > *', {
        y: 10, opacity: 0, stagger: 0.03, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
          mobileMenu.classList.remove('open');
          gsap.set('.mobile-menu > *', { clearProps: 'all' });
        }
      });
    } else {
      mobileMenu.classList.remove('open');
    }
    hamburger.classList.remove('open');
    backdrop && backdrop.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop && backdrop.addEventListener('click', closeMenu);
  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 40%',
      end: 'bottom 40%',
      onToggle: (self) => {
        if (self.isActive) {
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
          });
        }
      }
    });
  });
}

// ============================================================
// 2. HERO — page load intro (navbar, headline lines, sub, CTAs)
// ============================================================
function initHeroAnimation() {
  if (REDUCE_MOTION) return;

  // Split headline into <span class="line"><span>…</span></span> for line reveal
  const headline = document.querySelector('.hero-headline');
  if (headline) {
    const lines = headline.innerHTML.split(/<br\s*\/?>/i);
    headline.innerHTML = lines
      .map(html => `<span class="line"><span>${html.trim()}</span></span>`)
      .join('');
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('#navbar', { y: -60, opacity: 0, duration: 0.8 })
    .from('.logo',            { x: -30, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.nav-links a',     { y: -15, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.4')
    .from('.nav-cta',         { opacity: 0, y: -15, duration: 0.5 }, '-=0.3')
    .from('.section-label',   { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
    .from('.hero-headline .line > span', {
      yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out'
    }, '-=0.4')
    .from('.hero-sub',        { y: 25, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero-ctas > *',   { y: 20, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.4')
    .from('.stats-bar',       { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
    .from('.stat',            { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.4');

  // Background layers — subtle intro scale + infinite float
  gsap.from('.hero-bg',   { scale: 1.08, opacity: 0, duration: 1.6, ease: 'power2.out' });
  gsap.from('.hero-glow', { scale: 0.85, opacity: 0, duration: 1.4, ease: 'power2.out' });

  gsap.to('.hero-glow', {
    y: 30, x: -20, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  // Mouse parallax on hero
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to('.hero-glow', { x: x * 40, y: y * 40, duration: 1.2, ease: 'power2.out' });
      gsap.to('.hero-grid', { x: x * 15, y: y * 15, duration: 1.5, ease: 'power2.out' });
    });
  }
}

// ============================================================
// 3. BACKGROUND — floating blobs + noise breathing
// ============================================================
function initBackgroundMotion() {
  if (REDUCE_MOTION) return;

  gsap.to('.blob-1', { x: 80,  y: 120, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.blob-2', { x: -100, y: -80, duration: 28, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.blob-3', { x: 60, y: -60,  duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  gsap.to('.bg-noise', {
    opacity: 0.055, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
}

// ============================================================
// 4. SCROLL REVEAL — alternating L / R / Center per section
// ============================================================
function initRevealAnimations() {
  if (REDUCE_MOTION) return;

  // Section headings — center up
  gsap.utils.toArray('section:not(.hero) .section-heading').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 60, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Section labels — fade + slide from left
  gsap.utils.toArray('section:not(.hero) .section-label').forEach(el => {
    gsap.from(el, {
      opacity: 0, x: -30, duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // ABOUT — text from LEFT, image from RIGHT
  if (document.querySelector('.about-grid')) {
    gsap.from('.about-text > *:not(.section-heading):not(.section-label)', {
      opacity: 0, x: -60, stagger: 0.12, duration: 1,
      scrollTrigger: { trigger: '.about-grid', start: 'top 75%', once: true }
    });
    gsap.from('.about-image-wrap', {
      opacity: 0, x: 60, duration: 1.1,
      scrollTrigger: { trigger: '.about-grid', start: 'top 75%', once: true }
    });
    gsap.from('.corner-accent', {
      opacity: 0, scale: 0, duration: 0.8, delay: 0.4,
      scrollTrigger: { trigger: '.about-grid', start: 'top 75%', once: true }
    });
  }

  // Section header row paragraph (services)
  gsap.utils.toArray('.section-header-row .body-text').forEach(el => {
    gsap.from(el, {
      opacity: 0, x: 60, duration: 0.9,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Body paragraphs inside sections
  gsap.utils.toArray('section:not(.hero) .body-text').forEach(el => {
    if (el.closest('.service-card, .portfolio-card, .testimonial-card, .about-text, .section-header-row')) return;
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.9,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Contact details rows — from left
  gsap.utils.toArray('.contact-row').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: -40, duration: 0.7, delay: i * 0.08,
      scrollTrigger: { trigger: '.contact-details', start: 'top 85%', once: true }
    });
  });

  // Contact form — from right
  gsap.from('.contact-form-wrap', {
    opacity: 0, x: 60, duration: 1,
    scrollTrigger: { trigger: '.contact-grid', start: 'top 75%', once: true }
  });
}

// ============================================================
// 5. CARDS — Services / Portfolio / Testimonials reveal stagger
// ============================================================
function initCards() {
  if (REDUCE_MOTION) return;

  const cardGroups = [
    { grid: '.services-grid',      items: '.service-card' },
    { grid: '.portfolio-grid',     items: '.portfolio-card' },
    { grid: '.testimonials-grid',  items: '.testimonial-card' }
  ];

  cardGroups.forEach(({ grid, items }) => {
    const gridEl = document.querySelector(grid);
    if (!gridEl) return;
    gsap.from(gridEl.querySelectorAll(items), {
      opacity: 0,
      y: 60,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: gridEl, start: 'top 80%', once: true }
    });
  });
}

// ============================================================
// 6. COUNTERS — animated stat numbers (once)
// ============================================================
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const finalText = counter.innerText;
    const number    = parseFloat(finalText.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return;

    // Preserve prefix ($) and suffix (+, %, M, etc.)
    const match = finalText.match(/^([^\d]*)([\d.]+)(.*)$/);
    const prefix = match ? match[1] : '';
    const suffix = match ? match[3] : '';

    const obj = { val: 0 };
    gsap.to(obj, {
      val: number,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: counter, start: 'top 90%', once: true },
      onUpdate() {
        const v = number % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(1);
        counter.innerText = prefix + v + suffix;
      },
      onComplete() { counter.innerText = finalText; }
    });
  });
}

// ============================================================
// 7. TIMELINE — AI Process (only runs if section exists)
// ============================================================
function initTimeline() {
  const timeline = document.querySelector('.timeline, .process-timeline');
  if (!timeline || REDUCE_MOTION) return;

  const steps = timeline.querySelectorAll('.timeline-step, .process-step');
  const line  = timeline.querySelector('.timeline-line, .process-line');

  if (line) {
    gsap.from(line, {
      scaleY: 0, transformOrigin: 'top center', ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 80%', scrub: true }
    });
  }
  steps.forEach((step, i) => {
    gsap.from(step, {
      opacity: 0, y: 50, duration: 0.8,
      scrollTrigger: { trigger: step, start: 'top 82%', once: true }
    });
    const num = step.querySelector('.step-number, .step-num');
    if (num) {
      gsap.from(num, {
        scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: { trigger: step, start: 'top 82%', once: true }
      });
    }
  });
}

// ============================================================
// 8. FAQ — accordion animation (only if section exists)
// ============================================================
function initFAQ() {
  const items = document.querySelectorAll('.faq-item, .accordion-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-question, .accordion-trigger');
    const content = item.querySelector('.faq-answer, .accordion-content');
    const arrow   = item.querySelector('.faq-arrow, .accordion-arrow');
    if (!trigger || !content) return;

    gsap.set(content, { height: 0, opacity: 0, overflow: 'hidden' });
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      gsap.to(content, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.5, ease: 'power3.out'
      });
      if (arrow) gsap.to(arrow, { rotate: isOpen ? 180 : 0, duration: 0.4 });
    });
  });
}

// ============================================================
// 9. CONTACT — inputs, submit ripple, success animation
// ============================================================
function initContact() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  // Ripple on submit
  const submitBtn = form.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      if (REDUCE_MOTION) return;
      const rect = submitBtn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
      submitBtn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) return;

    if (REDUCE_MOTION) {
      form.classList.add('hidden');
      success.classList.remove('hidden');
      return;
    }
    gsap.to(form, {
      opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        form.classList.add('hidden');
        success.classList.remove('hidden');
        gsap.fromTo(success,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }
        );
      }
    });
  });
}

// ============================================================
// 10. FOOTER — reveal + social stagger
// ============================================================
function initFooter() {
  if (REDUCE_MOTION) return;
  const footer = document.querySelector('.footer');
  if (!footer) return;

  gsap.from('.footer-brand, .footer-col', {
    opacity: 0, y: 40, stagger: 0.1, duration: 0.8,
    scrollTrigger: { trigger: footer, start: 'top 88%', once: true }
  });
  gsap.from('.social-link', {
    opacity: 0, scale: 0.5, stagger: 0.08, duration: 0.5, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', once: true }
  });
  gsap.from('.copyright', {
    opacity: 0, y: 15, duration: 0.6,
    scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', once: true }
  });
}

// ============================================================
// 11. MICRO-INTERACTIONS — 3D card tilt, floating icons
// ============================================================
function initMicroInteractions() {
  if (REDUCE_MOTION) return;

  // 3D tilt on service + portfolio cards
  document.querySelectorAll('.service-card, .portfolio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width  - 0.5;
      const py = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(card, {
        rotationY: px * 6,
        rotationX: -py * 6,
        transformPerspective: 1000,
        transformOrigin: 'center',
        duration: 0.5, ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: 'power3.out' });
    });
  });

  // Floating icons (hero + service icons)
  gsap.to('.service-icon', {
    y: -6, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
    stagger: { each: 0.3, from: 'random' }
  });
}

// ============================================================
// SMOOTH SCROLL (anchors)
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================================
// BOOT — lazy init after DOM ready
// ============================================================
function boot() {
  initNavbar();
  initHeroAnimation();
  initBackgroundMotion();
  initRevealAnimations();
  initCards();
  initCounters();
  initTimeline();
  initFAQ();
  initContact();
  initFooter();
  initMicroInteractions();
  initSmoothScroll();

  // Refresh once everything is set up (images, fonts)
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// Kill triggers cleanly on unload (SPA-safe)
window.addEventListener('beforeunload', () => {
  ScrollTrigger.getAll().forEach(t => t.kill());
});
