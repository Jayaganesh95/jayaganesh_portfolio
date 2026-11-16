/* ============================================
   JAYAGANESH K — PORTFOLIO JS
   Particles · Typing Effect · Scroll Reveals ·
   Smooth Nav · Counter Animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1.  PARTICLE SYSTEM
     ────────────────────────────────────────── */
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 150;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r  = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  /* ──────────────────────────────────────────
     2.  TYPING EFFECT
     ────────────────────────────────────────── */
  const typingEl = document.querySelector('.typing-text');
  const phrases  = [
    'Flutter Developer',
    'Mobile App Architect',
    'Android (Kotlin) Developer',
    'React Native Developer',
    'UI/UX Enthusiast',
    'Firebase Expert',
    'Problem Solver'
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    if (typingEl) {
      typingEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor"></span>';
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }
  typeLoop();


  /* ──────────────────────────────────────────
     3.  NAVIGATION
     ────────────────────────────────────────── */
  const nav       = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');

  // Scroll class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close on link click
  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < bottom) {
          navAnchors.forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNav);


  /* ──────────────────────────────────────────
     4.  SCROLL REVEAL
     ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────
     5.  COUNTER ANIMATION
     ────────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * ease);
        counter.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }


  /* ──────────────────────────────────────────
     6.  STAGGERED REVEAL FOR GRIDS
     ────────────────────────────────────────── */
  const staggerContainers = document.querySelectorAll('.projects-grid, .skills-container, .contact-links');
  staggerContainers.forEach(container => {
    const children = container.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.12}s`;
    });
  });


  /* ──────────────────────────────────────────
     7.  SMOOTH SCROLL for anchor links
     ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ──────────────────────────────────────────
     8.  TILT EFFECT on project cards
     ────────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.project-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

});
