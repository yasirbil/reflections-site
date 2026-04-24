/*!
 * nav.js — Yasir Bilgin dynamic site navigation
 * Drop in any page:  <script src="/nav.js"></script>
 * No dependencies. Fetches sitemap.xml, builds mega-dropdown nav.
 */
(function () {
  'use strict';

  const SITE      = 'https://test.yasirbilgin.com';
  const SITEMAP   = SITE + '/sitemap.xml';
  const NAV_H     = 62; // px — keep in sync with CSS

  /* ─────────────────────────────────────────────
     1. STYLES  (scoped under .ynb- prefix)
  ───────────────────────────────────────────── */
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Lato:wght@700&family=Lora:wght@400;600&display=swap');

.ynb-nav *,
.ynb-nav *::before,
.ynb-nav *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ynb-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9999;
  height: ${NAV_H}px;
  background: rgba(247,243,236,0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #d5c9b5;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Brand */
.ynb-brand {
  font-family: 'Cinzel', serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #1c1812;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.2s;
}
.ynb-brand:hover { color: #8B4513; }

/* Divider */
.ynb-divider {
  width: 1px;
  height: 24px;
  background: #d5c9b5;
  margin: 0 1.4rem;
  flex-shrink: 0;
}

/* Nav list */
.ynb-list {
  display: flex;
  align-items: center;
  list-style: none;
  flex: 1;
  overflow: hidden;
}

/* Nav item */
.ynb-item {
  position: relative;
}

/* Trigger (button or plain link) */
.ynb-trigger {
  display: flex;
  align-items: center;
  gap: 0.28rem;
  padding: 0 0.85rem;
  height: ${NAV_H}px;
  font-family: 'Lato', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #38322a;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.18s;
  position: relative;
}
.ynb-trigger::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.85rem;
  right: 0.85rem;
  height: 2px;
  background: #8B4513;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}
.ynb-trigger:hover,
.ynb-item.ynb-open .ynb-trigger {
  color: #8B4513;
}
.ynb-trigger:hover::after,
.ynb-item.ynb-open .ynb-trigger::after {
  transform: scaleX(1);
}

/* Chevron icon */
.ynb-chevron {
  width: 10px;
  height: 10px;
  transition: transform 0.25s ease;
  opacity: 0.6;
  flex-shrink: 0;
}
.ynb-item.ynb-open .ynb-chevron {
  transform: rotate(180deg);
  opacity: 1;
}

/* ── Shimmer skeleton ── */
.ynb-skeleton {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}
.ynb-skel-pill {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #d5c9b5 25%,
    #efe8db 50%,
    #d5c9b5 75%
  );
  background-size: 200% 100%;
  animation: ynb-shimmer 1.4s infinite;
}
@keyframes ynb-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Mega dropdown ── */
.ynb-dropdown {
  position: absolute;
  top: calc(100% + 1px);
  left: 50%;
  transform: translateX(-50%) translateY(-6px);
  min-width: 480px;
  max-width: 720px;
  background: rgba(247,243,236,0.99);
  border: 1px solid #d5c9b5;
  border-top: 2px solid #8B4513;
  box-shadow: 0 12px 40px rgba(28,24,18,0.12), 0 2px 8px rgba(28,24,18,0.06);
  padding: 1.4rem 1.6rem 0;
  border-radius: 0 0 4px 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.ynb-item.ynb-open .ynb-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

/* Column grid — --ynb-cols set inline */
.ynb-cols {
  display: grid;
  grid-template-columns: repeat(var(--ynb-cols, 2), 1fr);
  gap: 0 2rem;
}

.ynb-col { padding-bottom: 1rem; }

/* Category label inside dropdown */
.ynb-cat-label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8B4513;
  margin-bottom: 0.5rem;
}

/* Sub-page links */
.ynb-col-links { display: flex; flex-direction: column; }

.ynb-link {
  display: block;
  font-family: 'Lora', Georgia, serif;
  font-size: 0.82rem;
  color: #38322a;
  text-decoration: none;
  padding: 0.28rem 0 0.28rem 0.5rem;
  margin-left: -0.5rem;
  line-height: 1.35;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.ynb-link:hover {
  color: #8B4513;
  border-left-color: #8B4513;
}

/* Footer "view all" strip */
.ynb-drop-footer {
  border-top: 1px solid #d5c9b5;
  margin: 0 -1.6rem;
  padding: 0.65rem 1.6rem;
  display: flex;
  justify-content: flex-end;
}
.ynb-drop-footer a {
  font-family: 'Lato', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #b5651d;
  text-decoration: none;
  transition: color 0.15s;
}
.ynb-drop-footer a:hover { color: #8B4513; }

/* ── Responsive ── */
@media (max-width: 720px) {
  .ynb-nav { padding: 0 1rem; }
  .ynb-dropdown {
    min-width: 90vw;
    left: 0;
    transform: translateX(0) translateY(-6px);
  }
  .ynb-item.ynb-open .ynb-dropdown {
    transform: translateX(0) translateY(0);
  }
}
`;

  /* ─────────────────────────────────────────────
     2. HELPERS
  ───────────────────────────────────────────── */
  function decodeXml(str) {
    return str
      .replace(/&amp;/g,  '&')
      .replace(/&lt;/g,   '<')
      .replace(/&gt;/g,   '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }

  function toTitleCase(slug) {
    return slug
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') node.className = v;
      else if (k === 'textContent') node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (children) children.forEach(c => c && node.appendChild(c));
    return node;
  }

  /* ─────────────────────────────────────────────
     3. SITEMAP FETCH — three attempts
  ───────────────────────────────────────────── */
  async function fetchSitemap() {
    // 1. Direct (works same-origin or open CORS)
    try {
      const r = await fetch(SITEMAP, { cache: 'no-cache' });
      if (r.ok) return await r.text();
    } catch (_) {}

    // 2. allorigins.win  →  { contents: "..." }
    try {
      const r = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(SITEMAP)}`,
        { cache: 'no-cache' }
      );
      if (r.ok) { const j = await r.json(); if (j?.contents) return j.contents; }
    } catch (_) {}

    // 3. corsproxy.io  →  plain text
    try {
      const r = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(SITEMAP)}`,
        { cache: 'no-cache' }
      );
      if (r.ok) return await r.text();
    } catch (_) {}

    return null; // all failed
  }

  /* ─────────────────────────────────────────────
     4. SITEMAP PARSE
  ───────────────────────────────────────────── */
  function parseSitemap(xml) {
    // Map: categorySlug → Array<{ slug, url }>
    const cats = new Map();
    const re = /<loc>([\s\S]*?)<\/loc>/g;
    let m;

    while ((m = re.exec(xml)) !== null) {
      const url  = decodeXml(m[1].trim());
      if (!url.startsWith(SITE + '/')) continue;

      const path  = url.slice(SITE.length + 1);
      const parts = path.split('/').filter(Boolean);
      if (!parts.length) continue;

      const cat = parts[0];
      if (cat === 'home') continue; // brand already links home

      if (!cats.has(cat)) cats.set(cat, []);
      if (parts.length > 1) {
        cats.get(cat).push({ slug: parts.slice(1).join('/'), url });
      }
    }

    return cats;
  }

  /* ─────────────────────────────────────────────
     5. BUILD NAV DOM
  ───────────────────────────────────────────── */
  function buildNavItems(list, cats) {
    let openItem = null;

    function closeAll() {
      if (openItem) {
        openItem.classList.remove('ynb-open');
        const btn = openItem.querySelector('.ynb-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        openItem = null;
      }
    }

    cats.forEach((subs, cat) => {
      const label  = toTitleCase(cat);
      const catUrl = `${SITE}/${cat}`;
      const li     = el('li', { className: 'ynb-item', role: 'none' });

      if (subs.length === 0) {
        // ── Plain link ──
        li.appendChild(el('a', {
          className: 'ynb-trigger',
          href: catUrl,
          textContent: label,
          role: 'menuitem',
        }));
      } else {
        // ── Button + mega dropdown ──
        const btn = el('button', {
          className: 'ynb-trigger',
          'aria-haspopup': 'true',
          'aria-expanded': 'false',
          role: 'menuitem',
        });
        btn.innerHTML =
          `${label}<svg class="ynb-chevron" viewBox="0 0 10 6" fill="none"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;

        // Column layout: up to 3 columns, ≥4 items each
        const colCount = Math.min(3, Math.max(1, Math.ceil(subs.length / 4)));
        const perCol   = Math.ceil(subs.length / colCount);

        const colsDiv = el('div', { className: 'ynb-cols' });
        colsDiv.style.setProperty('--ynb-cols', colCount);

        for (let c = 0; c < colCount; c++) {
          const chunk = subs.slice(c * perCol, (c + 1) * perCol);
          if (!chunk.length) break;

          const linksDiv = el('div', { className: 'ynb-col-links' });
          chunk.forEach(sub => {
            linksDiv.appendChild(el('a', {
              className: 'ynb-link',
              href: sub.url,
              textContent: toTitleCase(sub.slug.split('/').pop()),
            }));
          });

          colsDiv.appendChild(el('div', { className: 'ynb-col' }, [
            el('span', { className: 'ynb-cat-label', textContent: label }),
            linksDiv,
          ]));
        }

        const footerDiv = el('div', { className: 'ynb-drop-footer' });
        footerDiv.appendChild(
          el('a', { href: catUrl, textContent: `View all in ${label} →` })
        );

        const drop = el('div', { className: 'ynb-dropdown', role: 'region' }, [
          colsDiv,
          footerDiv,
        ]);

        li.appendChild(btn);
        li.appendChild(drop);

        btn.addEventListener('click', e => {
          e.stopPropagation();
          const isOpen = li.classList.contains('ynb-open');
          closeAll();
          if (!isOpen) {
            li.classList.add('ynb-open');
            btn.setAttribute('aria-expanded', 'true');
            openItem = li;
          }
        });
      }

      list.appendChild(li);
    });

    document.addEventListener('click',   closeAll);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  }

  /* ─────────────────────────────────────────────
     6. INJECT NAV INTO PAGE
  ───────────────────────────────────────────── */
  function injectNav() {
    // Styles
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Nav element
    const nav = document.createElement('nav');
    nav.className = 'ynb-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Site navigation');

    // Brand
    nav.appendChild(el('a', {
      className: 'ynb-brand',
      href: SITE,
      textContent: 'Yasir Bilgin',
    }));

    // Divider
    nav.appendChild(el('span', { className: 'ynb-divider', 'aria-hidden': 'true' }));

    // Nav list (starts with shimmer)
    const list = el('ul', { className: 'ynb-list', role: 'menubar' });

    const skeleton = el('li', { className: 'ynb-skeleton', 'aria-hidden': 'true' });
    [72, 60, 88, 56].forEach(w => {
      const pill = el('div', { className: 'ynb-skel-pill' });
      pill.style.width = w + 'px';
      skeleton.appendChild(pill);
    });
    list.appendChild(skeleton);
    nav.appendChild(list);

    // Insert nav as first child of body
    document.body.insertBefore(nav, document.body.firstChild);

    // Push page content down so nav doesn't overlap it
    document.body.style.paddingTop =
      (parseInt(document.body.style.paddingTop, 10) || 0) + NAV_H + 'px';

    return list;
  }

  /* ─────────────────────────────────────────────
     7. INIT
  ───────────────────────────────────────────── */
  async function init() {
    const list = injectNav();

    const xml = await fetchSitemap();

    // Remove shimmer
    const skel = list.querySelector('.ynb-skeleton');
    if (skel) skel.remove();

    if (!xml) return; // all fetches failed — brand-only nav is fine

    const cats = parseSitemap(xml);
    buildNavItems(list, cats);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();