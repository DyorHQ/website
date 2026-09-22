/* DyorHQ landing — motion (owned by the motion specialist; pairs with css/motion.css).
   Vanilla JS, one strict-mode IIFE, IntersectionObserver only (no scroll/wheel listeners).
   States it sets — the CSS keys off these:
     html.js                          JS is running; every hidden state in motion.css is scoped under it
     [data-anim].in / .done           reveal started (observer, or on load inside .hero) / finished (animationend)
     [data-anim="words"] .m-word      one span per word, --i = word index; children of lines/stagger get --i too
     [data-fly].in                    card fly-in started (Web Animations API on translate/rotate/scale/opacity,
                                      then an endless idle float) — site.css's placement transform is never touched
     [data-anim="morph"] --mw0        the wide pill's height in px: the circle it grows from
     [data-parallax] style.translate/rotate   mouse parallax on the deck CONTAINER (fine pointers only) */
(function () {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mq.matches;                                   /* JS guard; motion.css has the @media half */
  const token = (name, fallback) => getComputedStyle(root).getPropertyValue(name).trim() || fallback;
  const EASE_OUT = token('--ease-out', 'cubic-bezier(.16,1,.3,1)');
  const EASE_IO = token('--ease-in-out', 'cubic-bezier(.65,0,.35,1)');
  const hero = document.querySelector('.hero');
  const inHero = (el) => !!hero && hero.contains(el);

  /* ---- 2. Headline: wrap each word in a span, in place. Existing children keep their order:
          .star and .sr-only are glued into the word around them (so "✱" + sr-only "o" + "ne" stay one
          word and still read "one"), <br> ends a word, any other element (.lt, <b>) is walked into. ---- */
  function splitWords(el) {
    let i = 0;
    const walk = (parent) => {
      let word = null;
      const open = (before) => {                                        /* current word span, created on demand */
        if (!word) {
          word = document.createElement('span');
          word.className = 'm-word';
          word.style.setProperty('--i', i++);
          parent.insertBefore(word, before);
        }
        return word;
      };
      Array.from(parent.childNodes).forEach((node) => {
        if (node.nodeType === 3) {
          node.data.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/\s/.test(part)) { word = null; parent.insertBefore(document.createTextNode(part), node); }
            else open(node).append(part);
          });
          node.remove();
        } else if (node.nodeType !== 1) {
          return;
        } else if (node.matches('.star, .sr-only')) {
          open(node).append(node);
        } else if (node.tagName === 'BR') {
          word = null;
        } else {
          word = null;
          walk(node);
        }
      });
    };
    walk(el);
  }
  document.querySelectorAll('[data-anim="words"]').forEach(splitWords);
  document.querySelectorAll('[data-anim="lines"], [data-anim="stagger"]').forEach((el) => {
    Array.from(el.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  /* ---- 5. The wide pill starts as a circle: --mw0 = its own height (motion.css animates width from it). ---- */
  document.querySelectorAll('[data-anim="morph"]').forEach((pill) => {
    const size = () => { if (!pill.classList.contains('in')) pill.style.setProperty('--mw0', pill.offsetHeight + 'px'); };
    size();
    window.addEventListener('resize', size, { passive: true });
  });

  /* ---- 4. Glass cards: fly in, then drift. Delay = n × 120ms + 300ms, each deck counting from 1;
          card 5 (the deep one) comes last, from the lower right; the capture pair (6, 7) drops from above. ---- */
  function fly(card) {
    if (card.classList.contains('in')) return;
    card.classList.add('in');
    if (reduced() || !card.animate) return;
    const n = +card.dataset.fly || 1;
    const drop = n > 5;                                                 /* capture deck */
    const delay = 300 + (drop ? n - 5 : n) * 120 + (n === 5 ? 350 : 0);
    const from = n === 5 ? { translate: '34% 70%', rotate: '-12deg' }
      : drop ? { translate: '0 -90%', rotate: (n === 6 ? -10 : 8) + 'deg' }
        : { translate: '40% -50%', rotate: '18deg' };
    const coarse = window.matchMedia('(pointer: coarse)').matches;       /* phones: no blur keyframe, no endless float */
    card.animate([{ offset: 0, opacity: 0, scale: drop ? '1' : '1.08', ...(coarse ? {} : { filter: 'blur(6px)' }), ...from }],
      { delay, duration: 1100, easing: EASE_OUT, fill: 'backwards' });          /* `to` = the cascade, untouched */
    if (coarse) return;
    const amp = (n % 2 ? -1 : 1) * (6 + (n % 3));                       /* ±6–8px, alternating direction */
    const tilt = (n % 2 ? 1 : -1) * (0.6 + (n % 3) * 0.2);              /* ±0.6–1deg */
    card.animate([
      { translate: '0 0', rotate: '0deg', easing: EASE_IO },
      { translate: '0 ' + amp + 'px', rotate: tilt + 'deg', easing: EASE_IO },
      { translate: '0 0', rotate: '0deg' }
    ], { delay: delay + 1100, duration: 7000 + ((n * 1.3) % 4) * 1000, iterations: Infinity });   /* 8.1–10.9s, per card */
  }

  /* ---- 3. Reveal: add .in (motion.css animates from there), fly any cards inside; the morph pill also
          pulls its sibling fades (the form, the small pill) so they follow it by their CSS delay. ---- */
  function reveal(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    el.querySelectorAll('[data-fly]').forEach(fly);
    /* a dark scene reveals as one unit: its pinned phone/slab may never reach 20% on their own */
    if (el.matches('.scene')) el.querySelectorAll('[data-anim]').forEach((c) => { io.unobserve(c); reveal(c); });
    if (el.dataset.anim === 'morph') {
      Array.from(el.parentElement.children).forEach((s) => { if (s.dataset.anim === 'fade') { io.unobserve(s); reveal(s); } });
    }
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      /* 20% of the element, or 20% of the viewport for blocks taller than it (the bento on a phone) */
      if (en.intersectionRatio < 0.2 && en.intersectionRect.height < window.innerHeight * 0.2) return;
      io.unobserve(en.target);
      reveal(en.target);
    });
  }, { threshold: [0, 0.05, 0.1, 0.15, 0.2], rootMargin: '-8% 0px' });
  const targets = new Set();
  document.querySelectorAll('[data-anim]').forEach((el) => { if (!inHero(el)) targets.add(el); });
  document.querySelectorAll('[data-fly]').forEach((card) => { if (!inHero(card)) targets.add(card.parentElement); });
  document.querySelectorAll('.scene').forEach((s) => targets.add(s));
  targets.forEach((t) => io.observe(t));

  /* Hero: plays on load as one sequence (delays live in motion.css). Waits for the webfont, 250ms at most. */
  const startHero = () => {
    if (!hero) return;
    hero.querySelectorAll('[data-anim]').forEach(reveal);
    hero.querySelectorAll('[data-fly]').forEach(fly);
  };
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 250))]).then(startHero);

  /* One-shot CSS reveals hand `animation` back to the cascade when they finish (.done), so tiles,
     pills and slabs that animate themselves are never blocked by motion.css. */
  document.addEventListener('animationend', (e) => {
    if (/^m-(fade|rise|pop|tile|word|morph)$/.test(e.animationName)) e.target.classList.add('done');
  });

  /* ---- 6. Mouse parallax: the deck CONTAINER gets inline translate (±14px) and rotate (±1.2deg), eased
          with rAF (lerp .08); the cards' own transforms are never touched. Fine pointers only. ---- */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const zone = el.closest('section') || el;
      let tx = 0, ty = 0, tr = 0, x = 0, y = 0, r = 0, raf = 0;
      const tick = () => {
        x += (tx - x) * 0.08; y += (ty - y) * 0.08; r += (tr - r) * 0.08;
        el.style.translate = x.toFixed(2) + 'px ' + y.toFixed(2) + 'px';
        el.style.rotate = r.toFixed(3) + 'deg';
        raf = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(tr - r) > 0.02 ? requestAnimationFrame(tick) : 0;
      };
      const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
      zone.addEventListener('mousemove', (e) => {
        if (reduced()) return;
        const b = zone.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width) * 2 - 1));
        const ny = Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height) * 2 - 1));
        tx = nx * 14; ty = ny * 14; tr = nx * 1.2;
        go();
      }, { passive: true });
      zone.addEventListener('mouseleave', () => { tx = ty = tr = 0; go(); });
    });
  }

  /* ---- 8. Email capture: validate, open the visitor's mail client, say so. Nothing is sent anywhere else. ---- */
  const form = document.querySelector('[data-capture]');
  if (form) {
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('[type="submit"]');
    const label = btn.textContent;
    const live = document.createElement('p');                            /* screen-reader status line */
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    form.append(live);
    let timer = 0;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        input.setCustomValidity('Please enter a valid email address.');
        input.reportValidity();
        input.setCustomValidity('');
        return;
      }
      btn.style.minWidth = btn.offsetWidth + 'px';                       /* no layout jump while the label swaps */
      btn.textContent = 'Opening mail…';
      live.textContent = 'Opening your mail app with a message to team@dyorhq.fun.';
      const note = document.querySelector('[data-capture-note]');
      if (note) note.textContent = 'If nothing opened, email team@dyorhq.fun and we will add you.';
      clearTimeout(timer);
      timer = setTimeout(() => { btn.textContent = label; btn.style.minWidth = ''; }, 2000);
      window.location.href = 'mailto:team@dyorhq.fun?subject=DyorHQ%20updates&body=' + encodeURIComponent(email);
    });
  }

  /* ---- 9. Theme toggle: light ⇄ dark, persisted; the inline script in <head> re-applies it before paint. ---- */
  const toggle = document.querySelector('[data-theme-toggle]');
  const isDark = () => (root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
  const labelToggle = () => { if (toggle) toggle.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme'); };
  if (toggle) {
    labelToggle();
    toggle.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('dyorhq.theme', next); } catch (e) { /* storage unavailable */ }
      labelToggle();
    });
  }

  /* ---- 10. Nav colour follows what is under it: white over the dark scenes, dark ink over the light
          giant plate, otherwise the theme. Observes only the 76px band the nav occupies (no scroll listener). ---- */
  const nav = document.querySelector('.nav');
  const learn = document.querySelector('.scene--learn');
  const pinScene = document.querySelector('.pin__scene');
  const giant = document.querySelector('.pin__giant');
  if (nav && learn && pinScene && giant) {
    const under = new Map();
    let bandIO = null;
    const apply = () => {
      const g = under.get(giant), s = under.get(learn) || under.get(pinScene);
      nav.classList.toggle('nav--light', !!g);
      nav.classList.toggle('nav--dark', !g && !!s);
    };
    const watch = () => {
      if (bandIO) bandIO.disconnect();
      const band = Math.max(0, window.innerHeight - 76);
      bandIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => under.set(en.target, en.isIntersecting));
        apply();
      }, { rootMargin: '0px 0px -' + band + 'px 0px', threshold: 0 });
      [learn, pinScene, giant].forEach((el) => bandIO.observe(el));
    };
    watch();
    window.addEventListener('resize', watch, { passive: true });
  }
})();
