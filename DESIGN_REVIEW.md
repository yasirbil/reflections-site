# Homepage design review (critical)

## Strengths
- Strong visual hierarchy with clear card grouping and ample whitespace.
- Cohesive muted palette and thoughtful dark-mode token mapping.
- Responsive grid breakpoints are practical and straightforward.

## Improvement ideas

### 1) Typography consistency
- The page loads **Playfair Display** but does not use it in visible UI. Either remove it to reduce requests, or apply it intentionally (e.g., only for hero heading) and keep all body/UI on DM Sans.
- Introduce a clear type scale token system (`--fs-12`, `--fs-14`, etc.) to avoid near-random point sizes (11, 11.5, 12, 12.5, 13.5, 14.5, 15, 17).
- Increase minimum body/UI text to at least 14px equivalent for readability on high-DPI mobile displays.

### 2) Color and contrast consistency
- Several muted text uses (`--text-faint`) appear low contrast on both themes for small text (paths/footer labels). Raise contrast slightly.
- Border thickness at `0.5px` can render inconsistently across devices. Prefer `1px` with adjusted alpha for stable appearance.
- Accent color is semantically overloaded (eyebrow, focus, hover, dot, button). Define secondary accent/interactive states to avoid visual monotony.

### 3) Information architecture and hierarchy
- Hero area has no primary heading (`<h1>`). Add a concise value proposition heading for identity and SEO.
- “Browse all sections” and “References & Tools” are visually similar despite different priority. Increase distinction via spacing or heading weight.
- Card descriptions vary in abstraction depth; normalize copy length/tone for easier scanning.

### 4) Interaction design
- Search dropdown lacks explicit keyboard selection state (up/down navigation and active item highlighting).
- Clicking outside hides dropdown but does not clear results; consider preserving state only when intentional.
- Hover lift effect is subtle; consider adding stronger focus-visible states for keyboard users.

### 5) Accessibility
- Add landmark structure (`<main>`, consistent heading levels).
- Ensure all interactive elements have robust `:focus-visible` styling.
- External links opened in new tabs should include `rel="noopener noreferrer"` for security and performance.
- Consider reduced motion support (`@media (prefers-reduced-motion: reduce)`) to disable fade animations.

### 6) Performance and maintainability
- Inline CSS/JS in one file makes long-term maintenance harder; split into modular files.
- Consider caching sitemap search index (or embedding a compact JSON index) to avoid XML parse latency.
- Use design tokens for spacing and radius as consistently as colors to improve system coherence.

### 7) Suggested quick wins (highest ROI)
1. Add `<h1>` + improve heading hierarchy.
2. Normalize typography scale and remove unused font or apply it intentionally.
3. Raise faint-text contrast and replace `0.5px` borders with `1px` alpha borders.
4. Add `:focus-visible`, keyboard navigation in search, and reduced-motion fallback.
5. Add `rel="noopener noreferrer"` on external links.
