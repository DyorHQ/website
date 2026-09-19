/* DyorHQ landing. No dependencies, no scroll listeners.
   Theme toggle, IntersectionObserver reveals + nav elevation, hero parallax,
   mobile menu, the big-word switcher, and the expanding media row. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* Theme toggle, persisted. */
  const tgl = $('[data-theme-toggle]');
  if (tgl) {
    tgl.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme');
      let next;
      if (cur === 'dark') next = 'light';
      else if (cur === 'light') next = 'dark';
      else next = matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      const meta = $('meta[name="theme-color"]');
      try { localStorage.setItem('dyorhq.theme', next); } catch (e) {}
    });
  }

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

  /* Nav elevation once the page scrolls past the top. */
  const nav = $('#nav');
  if (nav && 'IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
    document.body.prepend(sentinel);
    const nio = new IntersectionObserver(
      ([e]) => nav.classList.toggle('stuck', !e.isIntersecting),
      { threshold: 0 }
    );
    nio.observe(sentinel);
  }

  /* Hero parallax: fine pointers only, rAF-eased, sets --mx/--my on the stage. */
  const stage = $('[data-parallax]');
  if (stage && !reduce.matches && matchMedia('(pointer:fine)').matches) {
    const hero = stage.closest('.hero2') || stage;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const clamp = (n) => Math.max(-1, Math.min(1, n));
    const loop = () => {
      cx += (tx - cx) * 0.09; cy += (ty - cy) * 0.09;
      stage.style.setProperty('--mx', cx.toFixed(3));
      stage.style.setProperty('--my', cy.toFixed(3));
      raf = (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) ? requestAnimationFrame(loop) : 0;
    };
    hero.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
      ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
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
        p.style.height = on ? p.scrollHeight + 'px' : '0px';
      });
      if (img && btn.dataset.img) img.src = btn.dataset.img;
      if (tag && btn.dataset.tag) tag.textContent = btn.dataset.tag;
    };
    btns.forEach((b) => b.addEventListener('click', () => open(b)));
    const first = btns.find((b) => b.getAttribute('aria-expanded') === 'true') || btns[0];
    if (first) open(first);
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
