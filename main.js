// Main Application Entry Point with Scroll Reveals & Button Micro-Animations
import { ScrollEngine } from './scrollEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core 60FPS Scroll Engine
  const engine = new ScrollEngine({
    canvasId: 'hero-canvas',
    trackId: 'scroll-track',
    frameCount: 240
  });

  // Smooth Scroll for Explore Button & Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Scroll Reveal Animations with Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.reveal-on-scroll, .tech-border, .section-header, .stat-pill').forEach(el => {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
  });

  // Button Magnetic / Ripple Effect
  document.querySelectorAll('.btn-primary, .btn-accent').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--mouse-x', `${x}px`);
      btn.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
