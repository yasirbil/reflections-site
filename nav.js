/*!
 * nav.js — Yasir Bilgin dynamic site navigation
 * Drop in any page:  <script src="/nav.js"></script>
 * No dependencies. Desktop: mega-dropdown. Mobile: slide-in drawer.
 */
(function () {
    'use strict';

    const SITE = 'https://test.yasirbilgin.com';
    const SITEMAP = SITE + '/sitemap.xml';
    const NAV_H = 62;
    const MOBILE_BP = 768;

    /* ─────────────────────────────────────────────
       1. STYLES
    ───────────────────────────────────────────── */
    const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Lato:wght@400;700&family=Lora:wght@400;600&display=swap');

.ynb-nav *,
.ynb-nav *::before,
.ynb-nav *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── NAV BAR ── */
.ynb-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 2147483646;
  height: ${NAV_H}px;
  background: #f7f3ec;
  border-bottom: 1px solid #d5c9b5;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── BRAND ── */
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

.ynb-divider {
  width: 1px;
  height: 24px;
  background: #d5c9b5;
  margin: 0 1.4rem;
  flex-shrink: 0;
}

/* ── DESKTOP LIST ── */
.ynb-list {
  display: flex;
  align-items: center;
  list-style: none;
  flex: 1;
}
.ynb-item { position: relative; }

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
  bottom: 0; left: 0.85rem; right: 0.85rem;
  height: 2px;
  background: #8B4513;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}
.ynb-trigger:hover,
.ynb-item.ynb-open .ynb-trigger { color: #8B4513; }
.ynb-trigger:hover::after,
.ynb-item.ynb-open .ynb-trigger::after { transform: scaleX(1); }

.ynb-chevron {
  width: 10px; height: 10px;
  transition: transform 0.25s ease;
  opacity: 0.6; flex-shrink: 0;
}
.ynb-item.ynb-open .ynb-chevron { transform: rotate(180deg); opacity: 1; }

/* ── HAMBURGER ── */
.ynb-hamburger {
  display: none;
  margin-left: auto;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px; height: 40px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
  transition: background 0.15s;
}
.ynb-hamburger:hover { background: rgba(139,69,19,0.08); }
.ynb-hamburger span {
  display: block;
  height: 2px;
  background: #38322a;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.2s ease;
  transform-origin: center;
}
.ynb-hamburger.ynb-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.ynb-hamburger.ynb-active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.ynb-hamburger.ynb-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── SHIMMER ── */
.ynb-skeleton { display: flex; align-items: center; gap: 1rem; flex: 1; }
.ynb-skel-pill {
  height: 12px; border-radius: 6px;
  background: linear-gradient(90deg, #d5c9b5 25%, #efe8db 50%, #d5c9b5 75%);
  background-size: 200% 100%;
  animation: ynb-shimmer 1.4s infinite;
}
@keyframes ynb-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── DESKTOP DROPDOWN ── */
.ynb-dropdown {
  display: none;
  position: fixed;
  min-width: 360px;
  max-width: 720px;
  background: #f7f3ec;
  border: 1px solid #d5c9b5;
  border-top: 3px solid #8B4513;
  box-shadow: 0 8px 32px rgba(28,24,18,0.18);
  padding: 1.4rem 1.6rem 0;
  border-radius: 0 0 6px 6px;
  z-index: 2147483647;
}
.ynb-dropdown.ynb-visible { display: block; }

.ynb-cols {
  display: grid;
  grid-template-columns: repeat(var(--ynb-cols,2), 1fr);
  gap: 0 2rem;
}
.ynb-col { padding-bottom: 1rem; }

.ynb-cat-label {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 0.6rem; font-weight: 600;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: #8B4513; margin-bottom: 0.5rem;
}
.ynb-col-links { display: flex; flex-direction: column; }

.ynb-link {
  display: block;
  font-family: 'Lora', Georgia, serif;
  font-size: 0.84rem; color: #38322a;
  text-decoration: none;
  padding: 0.3rem 0 0.3rem 0.5rem;
  margin-left: -0.5rem;
  line-height: 1.4;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.ynb-link:hover { color: #8B4513; border-left-color: #8B4513; }

.ynb-drop-footer {
  border-top: 1px solid #d5c9b5;
  margin: 0 -1.6rem;
  padding: 0.65rem 1.6rem;
  display: flex; justify-content: flex-end;
}
.ynb-drop-footer a {
  font-family: 'Lato', sans-serif;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #b5651d; text-decoration: none;
  transition: color 0.15s;
}
.ynb-drop-footer a:hover { color: #8B4513; }

/* ── MOBILE DRAWER ── */
.ynb-drawer {
  position: fixed;
  top: ${NAV_H}px; left: 0; right: 0; bottom: 0;
  z-index: 2147483645;
  background: #f7f3ec;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transform: translateX(-100%);
  transition: transform 0.28s ease;
  border-top: 1px solid #d5c9b5;
  /* hidden on desktop via media query */
}
.ynb-drawer.ynb-drawer-open { transform: translateX(0); }

.ynb-drawer-inner { padding: 0.5rem 0 4rem; }

.ynb-drawer-item { border-bottom: 1px solid #ece7df; }

.ynb-drawer-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: #1c1812;
  text-decoration: none;
  background: none; border: none;
  cursor: pointer; text-align: left;
  transition: color 0.15s, background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.ynb-drawer-trigger:hover,
.ynb-drawer-item.ynb-drawer-open .ynb-drawer-trigger {
  color: #8B4513;
  background: rgba(139,69,19,0.04);
}

.ynb-drawer-chevron {
  width: 12px; height: 12px;
  flex-shrink: 0;
  transition: transform 0.25s ease;
  opacity: 0.45;
}
.ynb-drawer-item.ynb-drawer-open .ynb-drawer-chevron {
  transform: rotate(180deg);
  opacity: 1;
}

.ynb-drawer-sub {
  display: none;
  padding: 0.2rem 1.5rem 1rem 2.2rem;
  background: rgba(139,69,19,0.025);
}
.ynb-drawer-item.ynb-drawer-open .ynb-drawer-sub { display: block; }

.ynb-drawer-sub-link {
  display: block;
  font-family: 'Lora', Georgia, serif;
  font-size: 0.9rem; color: #5c4e3a;
  text-decoration: none;
  padding: 0.5rem 0 0.5rem 0.8rem;
  border-left: 2px solid #d5c9b5;
  margin-bottom: 0.1rem;
  transition: color 0.15s, border-color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.ynb-drawer-sub-link:hover,
.ynb-drawer-sub-link:active {
  color: #8B4513;
  border-left-color: #8B4513;
}

.ynb-drawer-view-all {
  display: inline-block;
  margin-top: 0.8rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #b5651d; text-decoration: none;
}
.ynb-drawer-view-all:hover { color: #8B4513; }

/* ── SCRIM ── */
.ynb-scrim {
  display: none;
  position: fixed;
  inset: 0; top: ${NAV_H}px;
  z-index: 2147483644;
  background: rgba(28,24,18,0.35);
}
.ynb-scrim.ynb-scrim-visible { display: block; }

/* ── RESPONSIVE ── */
@media (max-width: ${MOBILE_BP}px) {
  .ynb-divider  { display: none; }
  .ynb-list     { display: none; }
  .ynb-hamburger { display: flex; }
}
@media (min-width: ${MOBILE_BP + 1}px) {
  .ynb-drawer { display: none !important; }
  .ynb-scrim  { display: none !important; }
}
`;

    /* ─────────────────────────────────────────────
       2. HELPERS
    ───────────────────────────────────────────── */
    function decodeXml(str) {
        return str
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>').replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
    }
    function toTitleCase(slug) {
        return slug.replace(/\.html?$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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
    function chevronSVG(cls) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 10 6');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('class', cls);
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', 'M1 1l4 4 4-4');
        p.setAttribute('stroke', 'currentColor');
        p.setAttribute('stroke-width', '1.5');
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(p);
        return svg;
    }

    /* ─────────────────────────────────────────────
       3. FETCH
    ───────────────────────────────────────────── */
    async function fetchSitemap() {
        try {
            const r = await fetch(SITEMAP, { cache: 'no-cache' });
            if (r.ok) return await r.text();
        } catch (_) { }
        try {
            const r = await fetch(
                `https://api.allorigins.win/get?url=${encodeURIComponent(SITEMAP)}`,
                { cache: 'no-cache' }
            );
            if (r.ok) { const j = await r.json(); if (j?.contents) return j.contents; }
        } catch (_) { }
        try {
            const r = await fetch(
                `https://corsproxy.io/?${encodeURIComponent(SITEMAP)}`,
                { cache: 'no-cache' }
            );
            if (r.ok) return await r.text();
        } catch (_) { }
        return null;
    }

    /* ─────────────────────────────────────────────
       4. PARSE (UPDATED — supports subcategories)
    ───────────────────────────────────────────── */
    function parseSitemap(xml) {
        const cats = new Map();
        const re = /<loc>([\s\S]*?)<\/loc>/g;
        let m;

        while ((m = re.exec(xml)) !== null) {
            const url = decodeXml(m[1].trim());
            if (!url.startsWith(SITE + '/')) continue;

            const parts = url.slice(SITE.length + 1).split('/').filter(Boolean);
            if (!parts.length) continue;

            const cat = parts[0];
            if (cat === 'home') continue;

            // ensure category map exists
            if (!cats.has(cat)) cats.set(cat, new Map());

            // only category (no children)
            if (parts.length === 1) continue;

            const sub = parts[1];

            // ensure subcategory array exists
            if (!cats.get(cat).has(sub)) {
                cats.get(cat).set(sub, []);
            }

            // page under subcategory
            const pageSlug = parts.slice(2).join('/');
            const title = toTitleCase(
                pageSlug ? pageSlug.split('/').pop() : sub
            );

            cats.get(cat).get(sub).push({
                title,
                url
            });
        }

        return cats;
    }

    /* ─────────────────────────────────────────────
       5. DESKTOP ITEMS
    ───────────────────────────────────────────── */
    function buildDesktopItems(list, cats) {
        let openDrop = null, openLi = null;

        function closeAll() {
            if (openDrop) { openDrop.classList.remove('ynb-visible'); openDrop = null; }
            if (openLi) {
                openLi.classList.remove('ynb-open');
                openLi.querySelector('.ynb-trigger')?.setAttribute('aria-expanded', 'false');
                openLi = null;
            }
        }

        cats.forEach((subs, cat) => {
            const label = toTitleCase(cat);
            const catUrl = `${SITE}/${cat}`;
            const li = el('li', { className: 'ynb-item', role: 'none' });

            if (subs.length === 0) {
                li.appendChild(el('a', { className: 'ynb-trigger', href: catUrl, textContent: label, role: 'menuitem' }));
            } else {
                const btn = el('button', { className: 'ynb-trigger', 'aria-haspopup': 'true', 'aria-expanded': 'false', role: 'menuitem' });
                btn.appendChild(document.createTextNode(label));
                btn.appendChild(chevronSVG('ynb-chevron'));

                // subs is now a Map (subcategory → pages[])
                const subEntries = Array.from(subs.entries());

                // column logic based on subcategories
                const colCount = Math.min(3, Math.max(1, subEntries.length));
                const perCol = Math.ceil(subEntries.length / colCount);

                for (let c = 0; c < colCount; c++) {
                    const chunk = subEntries.slice(c * perCol, (c + 1) * perCol);
                    if (!chunk.length) break;

                    const col = el('div', { className: 'ynb-col' });

                    chunk.forEach(([sub, pages]) => {
                        // subcategory label (JAPAN)
                        col.appendChild(el('span', {
                            className: 'ynb-cat-label',
                            textContent: toTitleCase(sub)
                        }));

                        const linksDiv = el('div', { className: 'ynb-col-links' });

                        // pages under subcategory
                        pages.forEach(p => {
                            linksDiv.appendChild(el('a', {
                                className: 'ynb-link',
                                href: p.url,
                                textContent: p.title
                            }));
                        });

                        col.appendChild(linksDiv);
                    });

                    colsDiv.appendChild(col);
                }

                const footerDiv = el('div', { className: 'ynb-drop-footer' });
                footerDiv.appendChild(el('a', { href: catUrl, textContent: `View all in ${label} →` }));

                const drop = el('div', { className: 'ynb-dropdown', role: 'region' }, [colsDiv, footerDiv]);
                document.documentElement.appendChild(drop);
                li.appendChild(btn);

                btn.addEventListener('click', e => {
                    e.stopPropagation();
                    const isOpen = li.classList.contains('ynb-open');
                    closeAll();
                    if (!isOpen) {
                        const r = btn.getBoundingClientRect();
                        const dropW = Math.min(720, Math.max(360, window.innerWidth * 0.5));
                        let left = r.left + r.width / 2 - dropW / 2;
                        left = Math.max(8, Math.min(left, window.innerWidth - dropW - 8));
                        drop.style.top = NAV_H + 'px';
                        drop.style.left = left + 'px';
                        drop.style.width = dropW + 'px';
                        drop.classList.add('ynb-visible');
                        li.classList.add('ynb-open');
                        btn.setAttribute('aria-expanded', 'true');
                        openDrop = drop; openLi = li;
                    }
                });
            }
            list.appendChild(li);
        });

        document.addEventListener('click', closeAll);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
    }

    /* ─────────────────────────────────────────────
     6. MOBILE DRAWER (UPDATED — nested support)
  ───────────────────────────────────────────── */
    function buildDrawerContent(drawer, cats) {
        const inner = el('div', { className: 'ynb-drawer-inner' });

        cats.forEach((subs, cat) => {
            const label = toTitleCase(cat);
            const catUrl = `${SITE}/${cat}`;
            const item = el('div', { className: 'ynb-drawer-item' });

            // if no subcategories
            if (!(subs instanceof Map) || subs.size === 0) {
                item.appendChild(
                    el('a', {
                        className: 'ynb-drawer-trigger',
                        href: catUrl,
                        textContent: label
                    })
                );
            } else {
                const trig = el('button', {
                    className: 'ynb-drawer-trigger',
                    'aria-expanded': 'false'
                });

                trig.appendChild(document.createTextNode(label));
                trig.appendChild(chevronSVG('ynb-drawer-chevron'));

                const subWrap = el('div', { className: 'ynb-drawer-sub' });

                // loop subcategories
                subs.forEach((pages, sub) => {
                    // subcategory label
                    subWrap.appendChild(
                        el('div', {
                            className: 'ynb-drawer-sub-label',
                            textContent: toTitleCase(sub)
                        })
                    );

                    // pages under subcategory
                    pages.forEach(p => {
                        subWrap.appendChild(
                            el('a', {
                                className: 'ynb-drawer-sub-link',
                                href: p.url,
                                textContent: p.title
                            })
                        );
                    });
                });

                // view all link
                subWrap.appendChild(
                    el('a', {
                        className: 'ynb-drawer-view-all',
                        href: catUrl,
                        textContent: `View all in ${label} →`
                    })
                );

                // toggle behavior
                trig.addEventListener('click', () => {
                    const isOpen = item.classList.contains('ynb-drawer-open');

                    inner.querySelectorAll('.ynb-drawer-item.ynb-drawer-open')
                        .forEach(i => {
                            i.classList.remove('ynb-drawer-open');
                            i.querySelector('button')?.setAttribute('aria-expanded', 'false');
                        });

                    if (!isOpen) {
                        item.classList.add('ynb-drawer-open');
                        trig.setAttribute('aria-expanded', 'true');
                    }
                });

                item.appendChild(trig);
                item.appendChild(subWrap);
            }

            inner.appendChild(item);
        });

        drawer.innerHTML = '';
        drawer.appendChild(inner);
    }

    /* ─────────────────────────────────────────────
       7. INJECT
    ───────────────────────────────────────────── */
    function injectNav() {
        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        const nav = document.createElement('nav');
        nav.className = 'ynb-nav';
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Site navigation');

        nav.appendChild(el('a', { className: 'ynb-brand', href: SITE, textContent: 'Yasir Bilgin' }));
        nav.appendChild(el('span', { className: 'ynb-divider', 'aria-hidden': 'true' }));

        const list = el('ul', { className: 'ynb-list', role: 'menubar' });
        const skel = el('li', { className: 'ynb-skeleton', 'aria-hidden': 'true' });
        [72, 60, 88, 56].forEach(w => {
            const pill = el('div', { className: 'ynb-skel-pill' });
            pill.style.width = w + 'px';
            skel.appendChild(pill);
        });
        list.appendChild(skel);
        nav.appendChild(list);

        const ham = el('button', {
            className: 'ynb-hamburger',
            'aria-label': 'Open navigation menu',
            'aria-expanded': 'false',
        });
        ham.innerHTML = '<span></span><span></span><span></span>';
        nav.appendChild(ham);

        const drawer = el('div', { className: 'ynb-drawer' });
        const scrim = el('div', { className: 'ynb-scrim' });

        document.body.insertBefore(nav, document.body.firstChild);
        document.documentElement.appendChild(drawer);
        document.documentElement.appendChild(scrim);

        document.body.style.paddingTop =
            (parseInt(document.body.style.paddingTop, 10) || 0) + NAV_H + 'px';

        function openDrawer() {
            drawer.classList.add('ynb-drawer-open');
            scrim.classList.add('ynb-scrim-visible');
            ham.classList.add('ynb-active');
            ham.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        function closeDrawer() {
            drawer.classList.remove('ynb-drawer-open');
            scrim.classList.remove('ynb-scrim-visible');
            ham.classList.remove('ynb-active');
            ham.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        ham.addEventListener('click', e => {
            e.stopPropagation();
            drawer.classList.contains('ynb-drawer-open') ? closeDrawer() : openDrawer();
        });
        scrim.addEventListener('click', closeDrawer);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

        return { list, drawer, skel };
    }

    /* ─────────────────────────────────────────────
       8. INIT
    ───────────────────────────────────────────── */
    async function init() {
        const { list, drawer, skel } = injectNav();
        const xml = await fetchSitemap();
        skel.remove();
        if (!xml) return;
        const cats = parseSitemap(xml);
        buildDesktopItems(list, cats);
        buildDrawerContent(drawer, cats);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();