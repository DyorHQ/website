/* Shared inline SVG icons injected by id — keeps index.html readable and every glyph one source. */
(() => {
  'use strict';
  const P = 'http://www.w3.org/2000/svg';
  // 24x24, 1.7 stroke, round — the SF-Symbols-adjacent set the app uses.
  const D = {
    house:'M3 10.4 12 3l9 7.4M5 9.2V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.2',
    flame:'M12 3c.6 3.2 3.6 4.4 3.6 8.2A3.6 3.6 0 0 1 12 15a3.6 3.6 0 0 1-3.6-3.8C8.4 9 9.6 8.2 9.6 6.4 11 7 11.2 9 10.6 10.2 12.2 10 12.8 8 12 3Zm0 18a5 5 0 0 0 5-5c0-1.2-.3-2.2-.8-3.2C15.6 16 13.8 17 12 17s-3.6-1-4.2-4.2C7.3 13.8 7 14.8 7 16a5 5 0 0 0 5 5Z',
    swap:'M7 7h13m0 0-3.4-3.4M20 7l-3.4 3.4M17 17H4m0 0 3.4-3.4M4 17l3.4 3.4',
    aperture:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0 3.5-6M12 3l3.5 6M3.2 9h7M20.8 9h-7M6.5 18.5 10 12.5M3 12l7 .5m4-1 7-.5m-3.5 7.5L14 12',
    wand:'M15 4V2m0 20v-2M8.5 8.5 7 7m10 10-1.5-1.5M4 15H2m20 0h-2M6 3l1 1M3 6l1 1m5.5 4.5L4 17a2 2 0 0 0 3 3l5.5-5.5m0 0 5-5a2 2 0 0 0-3-3l-5 5 3 3Z',
    search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3',
    bell:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    menu:'M3 6h18M3 12h18M3 18h18',
    clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2',
    chevDown:'m6 9 6 6 6-6',
    chevRight:'m9 6 6 6-6 6',
    arrowRight:'M5 12h14m0 0-6-6m6 6-6 6',
    arrowUp:'M12 19V5m0 0-6 6m6-6 6 6',
    swapV:'M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3',
    cart:'M4 4h2l2.2 11.2a1 1 0 0 0 1 .8h7.6a1 1 0 0 0 1-.8L20 8H6M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
    card:'M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Zm0 3h20M6 15h4',
    scale:'M12 3v18M7 21h10M12 5l-7 2 3 6a3 3 0 0 0 6 0L5 7m14 0-7-2m7 2-3 6a3 3 0 0 1-6 0l9-2',
    people:'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 9v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    bars:'M4 20V10m5 10V4m5 16v-7m5 7V8',
    shield:'M12 3 5 6v5c0 4.4 3 8.2 7 10 4-1.8 7-5.6 7-10V6l-7-3Zm-2.5 8.5 2 2 4-4',
    key:'M15.5 3a5.5 5.5 0 0 0-5.3 7L3 17.2V21h3.8l1-1v-2h2v-2h2l1.2-1.2A5.5 5.5 0 1 0 15.5 3Zm1.5 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
    lock:'M6 10V8a6 6 0 1 1 12 0v2m-13 0h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm7 5.5a1.5 1.5 0 1 0-2 0V18h2v-2.5Z',
    check:'M4 12.5 9 17.5 20 6.5',
    checkCircle:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-5.5',
    doc:'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6m-6 4h6',
    globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.4 4 5.6 4 9s-1.5 7-4 9c-2.5-2-4-5.6-4-9s1.5-6.6 4-9Z',
    x:'M4 4l16 16M20 4 4 20',
    spark:'M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z',
    coins:'M8 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 0c0 2.8 3.1 5 7 5m-7-9c0 2.8 3.1 5 7 5m0-8.5c2.4.5 4 1.9 4 3.5 0 2.2-3.1 4-7 4M18 10.5V17c0 1.6-1.6 3-4 3.5',
    layers:'M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
    signal:'M4 20V13m5 7V8m5 12V4m5 16v-9',
    faceid:'M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9v1m6-1v1m-6 4s1 1.5 3 1.5S15 14 15 14M12 9v3l-.8.8',
    plus:'M12 5v14M5 12h14',
    apple:'M16 3c.1 1.2-.4 2.3-1.1 3.1-.8.9-2 1.5-3.1 1.4-.1-1.1.4-2.3 1.1-3C13.6 3.6 14.9 3 16 3Zm3.2 13.6c-.5 1.2-.8 1.7-1.5 2.7-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.6-4-3.1-2.8-4.1-3.1-9 -1.4-11.5 1.2-1.8 3.1-2.8 4.9-2.8 1.8 0 3 1 4.5 1 1.5 0 2.4-1 4.5-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.9.1 9Z',
  };
  document.querySelectorAll('svg[data-i]').forEach((svg) => {
    const d = D[svg.dataset.i];
    if (!d) return;
    svg.setAttribute('viewBox', '0 0 24 24');
    if (!svg.hasAttribute('fill')) svg.setAttribute('fill', 'none');
    const solid = ['flame','aperture','apple','spark','house','cart','card'].includes(svg.dataset.i) && svg.dataset.solid === '1';
    d.split('|').forEach((seg) => {
      const path = document.createElementNS(P, 'path');
      path.setAttribute('d', seg);
      if (solid) { path.setAttribute('fill', 'currentColor'); }
      else { path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', svg.dataset.w || '1.7'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round'); }
      svg.appendChild(path);
    });
  });
})();
