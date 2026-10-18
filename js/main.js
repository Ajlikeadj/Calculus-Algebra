/* ═══════════════════════════════════════════════════
   CAL-ALGE | Main JavaScript
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavScroll();
  initRevealAnimations();
  initCursorGlow();
  initTOC();
  initParticles();
  initMobileNav();
  initMobileTOC();
  initCounters();
});

/* ══════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ══════════════════════════════════════════
   NAV SCROLL BEHAVIOR
══════════════════════════════════════════ */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ══════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
══════════════════════════════════════════ */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════ */
function initCursorGlow() {
  // Only on desktop
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animate = () => {
    glowX += (mouseX - glowX) * 0.06;
    glowY += (mouseY - glowY) * 0.06;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });
}

/* ══════════════════════════════════════════
   TABLE OF CONTENTS (active highlighting)
══════════════════════════════════════════ */
function initTOC() {
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.content-section, .subsection');
  if (!tocLinks.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-68px 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => {
    if (section.id) observer.observe(section);
  });

  // Smooth scroll on click
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile sidebar if open
        const sidebar = document.querySelector('.topic-sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
      }
    });
  });
}

/* ══════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.querySelector('.particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.5 - 0.1;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 100;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      const progress = this.life / this.maxLife;
      const alpha = this.opacity * Math.sin(progress * Math.PI);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife);
    particles.push(p);
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animId = requestAnimationFrame(animate);
  };

  animate();
}

/* ══════════════════════════════════════════
   MOBILE NAVIGATION
══════════════════════════════════════════ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);

    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(calc(50% + 5px)) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(calc(-50% - 5px)) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

/* ══════════════════════════════════════════
   MOBILE TOC & SIDEBAR TOGGLE
══════════════════════════════════════════ */
function initMobileTOC() {
  const sidebar = document.querySelector('.topic-sidebar, .sidebar, aside');
  if (!sidebar) return;

  // Find or create mobile TOC toggle button if on a unit page
  let toggle = document.querySelector('.toc-mobile-toggle, .mobile-toc-toggle, .toc-toggle, #tocToggle, #mobileToggle');
  
  if (!toggle && document.querySelector('.toc-list')) {
    toggle = document.createElement('button');
    toggle.className = 'toc-mobile-toggle';
    toggle.setAttribute('aria-label', 'Toggle Table of Contents');
    toggle.textContent = '☰';
    document.body.appendChild(toggle);
  }

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar.classList.toggle('open') || sidebar.classList.toggle('mobile-open');
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close when tapping on any link in the TOC
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebar.classList.remove('mobile-open');
        toggle.textContent = '☰';
      });
    });

    // Close on tapping outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove('open');
        sidebar.classList.remove('mobile-open');
        toggle.textContent = '☰';
      }
    });
  }
}

/* ══════════════════════════════════════════
   ANIMATED COUNTERS (stats section)
══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1500;
  const start = performance.now();

  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.innerHTML = `${prefix}${current}<span class="accent">${suffix}</span>`;

    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

/* ══════════════════════════════════════════
   SMOOTH INTERNAL LINKS
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
