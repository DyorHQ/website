/* DyorHQ landing. No dependencies, no scroll listeners.
   Reveals + nav state via IntersectionObserver, the mobile menu,
   the big-word switcher, and the expanding media row. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* Scroll reveals. */
  const items = $$('.reveal:not(.in)');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
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

  /* Big-word switcher: one open panel, swapping the media beside it. */
  const sw = $('[data-switch]');
  if (sw) {
    const btns = $$('[data-switch-btn]', sw);
    const img = $('[data-switch-img]', sw);
    const tag = $('[data-switch-tag]', sw);
    const panelOf = (b) => b.parentElement.querySelector('.switch__panel');
    const open = (btn) => {
      btns.forEach((b) => {
        const on = b === btn;
        b.setAttribute('aria-expanded', String(on));
        const p = panelOf(b);
        if (!p) return;
        if (on) { p.style.height = p.scrollHeight + 'px'; }
        else { p.style.height = '0px'; }
      });
      if (img && btn.dataset.img) img.src = btn.dataset.img;
      if (tag && btn.dataset.tag) tag.textContent = btn.dataset.tag;
    };
    btns.forEach((b) => b.addEventListener('click', () => open(b)));
    const first = btns.find((b) => b.getAttribute('aria-expanded') === 'true') || btns[0];
    if (first) open(first);
    // keep the open panel sized correctly when the viewport changes
    addEventListener('resize', () => {
      const cur = btns.find((b) => b.getAttribute('aria-expanded') === 'true');
      const p = cur && panelOf(cur);
      if (p) p.style.height = p.scrollHeight + 'px';
    });
  }

  /* Expanding media row: click or focus a tile to widen it. */
  const rail = $('[data-rail]');
  if (rail) {
    const tiles = $$('[data-tile]', rail);
    const select = (t) => tiles.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
    tiles.forEach((t) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('mouseenter', () => select(t));
      t.addEventListener('focus', () => select(t));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(t); }
      });
    });
  }
})();
