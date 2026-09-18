/* DyorHQ landing — theme, navigation, reveals and the illustrative live mockups.
   No dependencies. Every number the mockups animate is an example, never a quote. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Theme: system by default, explicit choice persists locally ---------- */
  const THEME_KEY = 'dyorhq.theme';
  const readTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
  const currentScheme = () => root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const applyTheme = (mode) => {
    if (mode === 'light' || mode === 'dark') root.dataset.theme = mode; else delete root.dataset.theme;
    $$('[data-theme-toggle]').forEach((btn) => {
      const dark = currentScheme() === 'dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light appearance' : 'Switch to dark appearance');
      btn.dataset.scheme = dark ? 'dark' : 'light';
    });
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = currentScheme() === 'dark' ? '#18191B' : '#F7F7F5';
  };
  applyTheme(readTheme());
  $$('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', () => {
    const next = currentScheme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    applyTheme(next);
  }));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(readTheme()));

  /* ---------- Navigation ---------- */
  const nav = $('.nav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = $('[data-menu-toggle]');
  const drawer = $('#nav-drawer');
  const setMenu = (open) => {
    if (!menuBtn || !drawer) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  };
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    $$('a', drawer).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Scroll reveals ---------- */
  const revealables = $$('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Trade section: Swap | Perps ---------- */
  const tradeStage = $('[data-trade-stage]');
  const setTradeMode = (mode) => {
    if (!tradeStage) return;
    tradeStage.dataset.mode = mode;
    $$('[data-trade-mode]').forEach((b) => {
      const on = b.dataset.tradeMode === mode;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-trade-copy]').forEach((p) => { p.hidden = p.dataset.tradeCopy !== mode; });
  };
  $$('[data-trade-mode]').forEach((b) => b.addEventListener('click', () => setTradeMode(b.dataset.tradeMode)));
  if (tradeStage) setTradeMode(tradeStage.dataset.mode || 'perps');

  /* ---------- Leverage ruler (illustrative) ---------- */
  $$('[data-leverage]').forEach((wrap) => {
    const input = $('input[type="range"]', wrap);
    const outs = $$('[data-leverage-out]');
    const chips = $$('[data-leverage-set]', wrap);
    const paint = () => {
      const v = Number(input.value);
      const pct = ((v - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty('--pct', pct + '%');
      outs.forEach((o) => { o.textContent = v + 'x'; });
      chips.forEach((c) => c.classList.toggle('is-on', Number(c.dataset.leverageSet) === v));
      const MARGIN = 11.66, ENTRY = 76369.7; // isolated margin fixed; notional scales with leverage
      $$('[data-notional]').forEach((n) => { n.textContent = (MARGIN * v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' AUSD'; });
      $$('[data-liq]').forEach((l) => { l.textContent = Math.round(ENTRY * (1 - 0.92 / v)).toLocaleString('en-US'); });
    };
    input.addEventListener('input', paint);
    chips.forEach((c) => c.addEventListener('click', () => { input.value = c.dataset.leverageSet; paint(); }));
    paint();
  });

  /* ---------- Hero mockup: a gently moving example market ---------- */
  const fmtUSD = (n, d) => 'US$' + n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtPct = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(2) + '%';
  const monEls = $$('[data-live="mon-price"]');
  const monChangeEls = $$('[data-live="mon-change"]');
  const balanceEls = $$('[data-live="balance"]');
  const balanceDeltaEls = $$('[data-live="balance-delta"]');
  const refreshEls = $$('[data-live="refresh"]');
  let mon = 0.0233, monOpen = 0.02254, balanceBase = 8214.36, refresh = 12;
  const tick = () => {
    if (document.hidden) return;
    mon = Math.max(0.021, mon + (Math.random() - 0.5) * 0.00012);
    const change = ((mon / monOpen) - 1) * 100;
    monEls.forEach((el) => { el.textContent = fmtUSD(mon, 4); });
    monChangeEls.forEach((el) => {
      el.textContent = fmtPct(change);
      el.classList.toggle('pos', change >= 0); el.classList.toggle('neg', change < 0);
    });
    const balance = balanceBase * (1 + (mon - 0.0233) / 0.0233 * 0.42);
    const delta = balance - 8072.28;
    balanceEls.forEach((el) => { el.textContent = fmtUSD(balance, 2); });
    balanceDeltaEls.forEach((el) => {
      const pct = delta / 8072.28 * 100;
      el.innerHTML = '<span>' + (delta >= 0 ? '+' : '−') + fmtUSD(Math.abs(delta), 2) + '</span><span class="ios-chip ' + (delta >= 0 ? 'pos' : 'neg') + '">' + fmtPct(pct) + '</span>';
      el.classList.toggle('pos', delta >= 0); el.classList.toggle('neg', delta < 0);
    });
  };
  const countdown = () => {
    if (document.hidden) return;
    refresh = refresh <= 1 ? 15 : refresh - 1;
    refreshEls.forEach((el) => { el.textContent = refresh + ' sec'; });
  };
  if (!reduceMotion.matches && monEls.length) { setInterval(tick, 2400); setInterval(countdown, 1000); }

  /* ---------- Hero stage: soft pointer parallax on fine pointers ---------- */
  const stage = $('[data-parallax]');
  if (stage && !reduceMotion.matches && window.matchMedia('(pointer: fine)').matches) {
    let raf = 0, tx = 0, ty = 0;
    const layers = $$('[data-depth]', stage);
    const render = () => {
      raf = 0;
      layers.forEach((l) => {
        const d = Number(l.dataset.depth) || 0;
        l.style.transform = 'translate3d(' + (tx * d).toFixed(1) + 'px,' + (ty * d).toFixed(1) + 'px,0)';
      });
    };
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 18;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 12;
      if (!raf) raf = requestAnimationFrame(render);
    });
    stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(render); });
  }

  /* ---------- Copy-to-clipboard for the support address ---------- */
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const was = btn.textContent; btn.textContent = 'Copied'; btn.classList.add('is-done');
      setTimeout(() => { btn.textContent = was; btn.classList.remove('is-done'); }, 1400);
    } catch {}
  }));

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
