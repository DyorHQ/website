/* DyorHQ landing. No dependencies, no scroll listeners.
   IntersectionObserver reveals + nav state, the mobile menu, footer year. */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* Nav stuck state via a sentinel (no scroll listener). */
  const nav = $('#nav');
  if (nav && 'IntersectionObserver' in window) {
    const s = document.createElement('div');
    s.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
    document.body.prepend(s);
    new IntersectionObserver(([e]) => nav.classList.toggle('stuck', !e.isIntersecting), { threshold: 0 }).observe(s);
  }

  /* Scroll reveals. */
  const items = $$('.reveal:not(.in)');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  /* Mobile menu drawer. */
  const burger = $('[data-menu]'), drawer = $('#drawer');
  const setMenu = (open) => {
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
    document.body.classList.toggle('is-locked', open);
  };
  if (burger && drawer) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', drawer).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* Footer year. */
  $$('[data-year]').forEach((e) => { e.textContent = String(new Date().getFullYear()); });
})();
