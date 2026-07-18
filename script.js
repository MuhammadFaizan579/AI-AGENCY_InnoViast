/* ============================================================
   INNOVIAST — script.js
   ============================================================ */

// ── Navbar scroll effect ─────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Hamburger / mobile menu ──────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ── Contact form ─────────────────────────────────────────────
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) return;

  // Swap form for success message
  contactForm.classList.add('hidden');
  formSuccess.classList.remove('hidden');
});

// ── Smooth scroll for all anchor links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===============================
// GSAP Animations
// ===============================

gsap.registerPlugin(ScrollTrigger);

// Respect reduced motion
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {

    // Navbar
    gsap.from("#navbar", {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Hero Heading
    gsap.from(".hero-headline", {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Hero Text
    gsap.from(".hero-sub", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: .3
    });

    // Hero Buttons
    gsap.from(".hero-ctas a", {
        opacity: 0,
        y: 30,
        stagger: .15,
        delay: .6,
        duration: .8
    });

    // Stats
    gsap.from(".stat", {
        opacity: 0,
        y: 40,
        stagger: .15,
        delay: .8
    });

    // Scroll Reveal
    gsap.utils.toArray("section").forEach(section => {

        gsap.from(section.children, {

            opacity:0,
            y:60,
            duration:.8,
            stagger:.15,

            scrollTrigger:{
                trigger:section,
                start:"top 80%"
            }

        });

    });

}

document.querySelectorAll(".stat-num").forEach(counter=>{

const finalValue = counter.innerText;

const number = parseInt(finalValue.replace(/[^0-9]/g,""));

let obj={value:0};

gsap.to(obj,{

value:number,

duration:2,

ease:"power2.out",

scrollTrigger:{
trigger:counter,
start:"top 85%"
},

onUpdate(){

counter.innerText=finalValue.replace(number,obj.value.toFixed(0));

}

});

});
