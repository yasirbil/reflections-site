# Yasir Bilgin — Site Builder Instructions

These instructions apply to every article and page on this project.
Follow them for all new articles and when editing existing ones.

---

## 1. Global Navigation (nav.js)

**Every single page must include this script tag in the `<head>`, before any other scripts:**

```html
<script src="https://yasirbilgin.com/nav.js"></script>
```

This one line automatically injects a fixed top navigation bar that:
- Shows the site brand "Yasir Bilgin" on the left
- Populates nav items dynamically from the sitemap
- Shows a shimmer skeleton while loading
- On desktop: shows mega-dropdown menus on click
- On mobile: shows a hamburger button that opens a slide-in drawer

**Do not add any other top navigation or header bar.** The nav.js bar is the only site-wide header needed.

**Important — prevent CSS conflicts:** If your page has any of the following, adjust them so they do not interfere with the nav:

- Any `position: fixed` or `position: sticky` element with a `z-index` above 100 should be lowered. The nav sits at `z-index: 2147483646`.
- If your page has a `backdrop-filter` on a `display: none` element (e.g. a TOC overlay), move `backdrop-filter` to only apply when that element is visible (e.g. on its `.open` class), not on its default hidden state. This prevents browser stacking context bugs that hide the nav dropdown.
- Any `progress-bar` or scroll indicator should have `top: 62px` not `top: 0`, so it sits below the nav bar, not on top of it.

**Example of a correct `<head>` opening:**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Article Title | Yasir Bilgin</title>
  <script src="https://yasirbilgin.com/nav.js"></script>
  <!-- fonts and styles below -->
</head>
```

---

## 2. Article-Internal Table of Contents

Each article has its own "Contents" button and TOC panel that links to sections **within the same page**. All TOC links must use **anchor links** (starting with `#`), not external URLs.

**Correct — links to section on same page:**
```html
<a href="#s1">I. Defining the Discipline</a>
<a href="#s2">II. The Big Questions</a>
```

**Wrong — links to another page:**
```html
<a href="https://example.com/article#s1">...</a>
```

**How to set up section anchors:**

Every major section in the article body must have a matching `id` attribute:

```html
<section id="s1" class="major-section">
  <h2>Defining the Discipline</h2>
  ...
</section>

<section id="s2" class="major-section">
  <h2>The Big Questions</h2>
  ...
</section>
```

The TOC links then reference those ids:

```html
<ul class="toc-list">
  <li><a href="#s1" class="toc-main">I. Defining the Discipline</a></li>
  <li><a href="#s2" class="toc-main">II. The Big Questions</a></li>
  <li><a href="#s2-1">2.1 Subsection Title</a></li>
</ul>
```

**TOC overlay CSS rule — critical fix:**

The TOC overlay must NOT apply `backdrop-filter` in its default (hidden) state. Only apply it when the overlay is open. Use this pattern:

```css
/* CORRECT */
.toc-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(24,20,14,0.55);
  /* NO backdrop-filter here */
}
.toc-overlay.open {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  backdrop-filter: blur(4px); /* only when actually visible */
}

/* WRONG — causes nav dropdown to disappear */
.toc-overlay {
  display: none;
  backdrop-filter: blur(4px); /* ← never put this on a hidden element */
}
```

---

## 3. Article-Internal Sticky Navigation Bar

Some articles have their own internal navigation bar — a horizontal strip of links that jump to sections within the same page (like the Chaplaincy Guide's emerald green bar with "Foundations · Theories · Practices…"). **This is allowed and should be preserved exactly as designed.**

### Rules for article-internal nav bars

**Keep the design intact.** If an article has its own styled internal nav (colour, font, layout), do not change or remove it. It is part of that article's identity.

**It must sit below the global nav.js bar.** The global nav is fixed at the top and 62px tall. The article's internal nav must be `position: sticky` with `top: 62px` so it sticks directly below the global nav, not on top of it:

```css
/* CORRECT */
nav.article-nav {
  position: sticky;
  top: 62px;       /* ← sits flush below the global nav */
  z-index: 50;     /* ← well below global nav's z-index */
}

/* WRONG */
nav.article-nav {
  position: sticky;
  top: 0;          /* ← hides behind or overlaps the global nav */
}
```

**All links must be internal anchor links.** Every link in the article's internal nav must point to a section `id` on the same page using `href="#section-id"`. Never link to external URLs or other pages.

**Scroll offset script is required.** Because two sticky bars are now stacked (global nav at 62px + article nav height), clicking an internal nav link must scroll to the correct position accounting for both bars. Use this script:

```javascript
// Accounts for global nav (62px) + article's own sticky nav height
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.getElementById(this.getAttribute('href').slice(1));
    if (!target) return;
    const globalNavH  = 62;
    const articleNavH = document.querySelector('nav').offsetHeight;
    const offset = globalNavH + articleNavH + 8; // 8px breathing room
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
```

**Mobile: wrap or scroll the internal nav.** On narrow screens the internal nav links must not overflow horizontally. Use `flex-wrap: wrap` or `overflow-x: auto` on the nav list:

```css
nav ul {
  display: flex;
  flex-wrap: wrap;   /* items wrap to next line if needed */
  list-style: none;
}
```

**Reduce link padding on small screens:**

```css
@media (max-width: 680px) {
  nav ul li a {
    padding: 0.7rem 0.6rem;
    font-size: 0.6rem;
  }
}
```

### Section anchors must account for the stacked offset

When the page has both a global nav and an article-internal nav, use `scroll-margin-top` on each section so browser-native anchor scrolling also lands correctly:

```css
section[id] {
  scroll-margin-top: 130px; /* 62px global nav + ~60px article nav + 8px gap */
}
```

### Example — correct internal nav structure

```html
<!-- Article-internal sticky nav — sits below the global nav.js bar -->
<nav style="position:sticky; top:62px; z-index:50; background:#2d5a4a;">
  <ul style="display:flex; flex-wrap:wrap; list-style:none; max-width:1100px; margin:0 auto; padding:0 1rem;">
    <li><a href="#foundations">Foundations</a></li>
    <li><a href="#theories">Theories</a></li>
    <li><a href="#practices">Practices</a></li>
    <li><a href="#resources">Resources</a></li>
  </ul>
</nav>

<!-- Each target section has a matching id -->
<section id="foundations">...</section>
<section id="theories">...</section>
```

---

## 4. Mobile Friendliness

Every article must be fully readable and usable on screens as narrow as 375px.

### Viewport meta tag
Always present in `<head>`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Body padding
Because the nav bar is `position: fixed` and 62px tall, the page body needs top padding so content is not hidden behind it. nav.js adds this automatically — do not set `padding-top: 0` on `body` as it will override the nav's spacing.

### Font sizes
Use `clamp()` for headings so they scale down gracefully on small screens:
```css
h1 { font-size: clamp(2rem, 6vw, 4.4rem); }
h2 { font-size: clamp(1.6rem, 4vw, 2.6rem); }
```

### Horizontal scrolling — prevent it
Wrap any wide element (tables, code blocks, wide grids) in a scroll container:
```css
.table-wrap { overflow-x: auto; }
.code-wrap  { overflow-x: auto; }
```

### Grid and card layouts
Use `auto-fill` with a minimum column width so grids collapse gracefully:
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
```

For two-column panels, collapse to single column below 560px:
```css
.duo-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }
@media (max-width: 560px) { .duo-panel { grid-template-columns: 1fr; } }
```

### Pull quotes
Pull quotes that extend into the left margin on desktop must reset to no negative margin on mobile:
```css
.pull-quote { margin: 3rem 0 3rem -2rem; padding-left: 2rem; }
@media (max-width: 640px) { .pull-quote { margin-left: 0; } }
```

### Article padding
Reduce horizontal padding on small screens:
```css
.article-body { padding: 4rem 2.5rem 8rem; }
@media (max-width: 720px) { .article-body { padding: 3rem 1.4rem 5rem; } }
```

### Touch targets
All clickable elements (buttons, links, TOC items) must be at least 44px tall for comfortable tapping. The TOC links and nav items already meet this, but any custom buttons should follow:
```css
.my-button { min-height: 44px; padding: 0.6rem 1.2rem; }
```

---

## 5. Page Structure Template

Use this as the starting skeleton for every new article:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Article Title | Yasir Bilgin</title>

  <!-- ① Global nav — always first -->
  <script src="https://yasirbilgin.com/nav.js"></script>

  <!-- ② Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">

  <style>
    /* ③ Progress bar — must be below the nav (top: 62px) */
    .progress-bar {
      position: fixed;
      top: 62px;        /* ← not top: 0 */
      left: 0;
      height: 3px;
      background: var(--accent);
      width: 0%;
      z-index: 100;     /* ← well below nav's z-index */
    }

    /* ④ TOC overlay — backdrop-filter only on .open, never on default state */
    .toc-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9000;
      background: rgba(24,20,14,0.55);
    }
    .toc-overlay.open {
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      backdrop-filter: blur(4px);
    }

    /* ⑤ Article header (read-time + TOC button) — sticky below the nav */
    .article-header {
      position: sticky;
      top: 62px;        /* ← exactly the nav height */
      z-index: 50;
      /* ... rest of styles */
    }

    /* ⑥ Responsive base */
    @media (max-width: 720px) {
      body { font-size: 17px; }
      .article-body { padding: 3rem 1.4rem 5rem; }
    }
  </style>
</head>
<body>

  <!-- TOC overlay -->
  <div class="toc-overlay" id="tocOverlay"
       onclick="if(event.target===this)this.classList.remove('open')">
    <div class="toc-panel">
      <button onclick="document.getElementById('tocOverlay').classList.remove('open')">✕</button>
      <h3>Table of Contents</h3>
      <ul class="toc-list">
        <!-- All hrefs must be #anchor, never external URLs -->
        <li><a href="#s1" class="toc-main">I. First Section</a></li>
        <li><a href="#s2" class="toc-main">II. Second Section</a></li>
        <li><a href="#s2-1">2.1 Subsection</a></li>
      </ul>
    </div>
  </div>

  <!-- Article sub-header (read time + TOC button) -->
  <header class="article-header">
    <a class="site-name" href="#">Yasir Bilgin</a>
    <div class="header-right">
      <span class="read-time">XX min read</span>
      <button class="toc-btn"
              onclick="document.getElementById('tocOverlay').classList.add('open')">
        Contents
      </button>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <h1>Article <em>Title</em></h1>
    <p class="hero-sub">Subtitle or description.</p>
    <div class="byline-row">
      <div class="avatar">YB</div>
      <div class="byline-text">
        <span class="byline-name">Yasir Bilgin</span>
        <span class="byline-meta">Yasir Bilgin · Date</span>
      </div>
    </div>
  </section>
  <hr class="hero-rule">

  <!-- Article body -->
  <article class="article-body">

    <section id="s1" class="major-section">
      <span class="section-label">Section I</span>
      <h2>First <em>Section</em></h2>
      <p>Content...</p>
    </section>

    <section id="s2" class="major-section">
      <span class="section-label">Section II</span>
      <h2>Second <em>Section</em></h2>

      <h3 id="s2-1" class="sub-heading">
        <span class="sh-num">2.1</span>Subsection Title
      </h3>
      <p>Content...</p>
    </section>

  </article>

  <footer>
    <span class="footer-logo">Yasir Bilgin</span>
    <span class="footer-copy">© 2026 Yasir Bilgin Editorial.</span>
  </footer>

  <script>
    // Progress bar
    const bar = document.getElementById('progressBar');
    if (bar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (scrollTop / docH * 100) + '%';
      }, { passive: true });
    }
  </script>
</body>
</html>
```

---

## 6. Checklist for Every Article

Before publishing any article, confirm:

- [ ] `<script src="https://yasirbilgin.com/nav.js"></script>` is the first script in `<head>`
- [ ] No separate `<header>` or top nav bar in the page body (nav.js provides it)
- [ ] Progress bar uses `top: 62px` and `z-index: 100` or lower
- [ ] TOC overlay has `backdrop-filter` only on `.open`, not on the default hidden state
- [ ] Article sub-header uses `top: 62px` for its sticky position
- [ ] All TOC links use `href="#section-id"` (anchor links), not external URLs
- [ ] All section headings referenced in the TOC have matching `id` attributes
- [ ] `clamp()` used on `h1` and `h2` font sizes
- [ ] Wide tables and grids are wrapped in `overflow-x: auto` containers
- [ ] Multi-column layouts collapse to single column below 560px
- [ ] Pull quotes reset `margin-left: 0` below 640px
- [ ] Viewport meta tag is present
- [ ] Tested on a narrow screen (375px) — no horizontal scroll, text is readable
