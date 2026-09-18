/* DyorHQ landing. No dependencies, no scroll listeners.
   Theme (system default, choice persisted), IntersectionObserver reveals + nav state,
   the Trade preview toggle, copy-to-clipboard, footer year. */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* Theme: system by default; an explicit choice persists locally. */
  const KEY = 'dyorhq.theme';
  const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const scheme = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const apply = (m) => {
    if (m === 'light' || m === 'dark') root.dataset.theme = m; else delete root.dataset.theme;
    const dark = scheme() === 'dark';
    $$('[data-theme-toggle]').forEach((b) => { b.dataset.scheme = dark ? 'dark' : 'light'; b.setAttribute('aria-label', dark ? 'Switch to light appearance' : 'Switch to dark appearance'); });
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = dark ? '#0E0E11' : '#F5F4F1';
  };
  apply(get());
  $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
    const next = scheme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch {}
    apply(next);
  }));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => apply(get()));

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
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }

  /* Menu drawer. */
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
    matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* Trade preview toggle (Perps / Swap). */
  const stage = $('#trade-stage');
  const setTrade = (mode) => {
    if (!stage) return;
    stage.dataset.show = mode;
    $$('[data-trade]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.trade === mode)));
    $$('[data-trade-cap]').forEach((c) => { c.hidden = c.dataset.tradeCap !== mode; });
  };
  $$('[data-trade]').forEach((b) => b.addEventListener('click', () => setTrade(b.dataset.trade)));

  /* Copy support address. */
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      const t = b.textContent; b.textContent = 'Copied'; b.classList.add('done');
      setTimeout(() => { b.textContent = t; b.classList.remove('done'); }, 1400);
    } catch {}
  }));

  /* Footer year. */
  $$('[data-year]').forEach((e) => { e.textContent = String(new Date().getFullYear()); });
})();
