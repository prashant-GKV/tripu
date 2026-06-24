# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (hot-reload)
npm run build     # type-check with tsc, then bundle with Vite
npm run lint      # ESLint across the entire src tree
npm run preview   # preview the production build locally
```

```bash
npm run test        # run Vitest once (jsdom)
npm run test:watch  # Vitest watch mode
```

Vitest is configured in [vitest.config.ts](vitest.config.ts) with jsdom + Testing Library
(setup in [src/test/setup.ts](src/test/setup.ts)).

## Architecture

This is a **React 19 + TypeScript + Vite** app evolving from a marketing site into a hybrid
**AI trip-planner + travel-companion-matching** product. See root [DECISIONS.md](../DECISIONS.md)
and [ARCHITECTURE.md](../ARCHITECTURE.md) for the full plan.

### App shell, routing & providers

`App.tsx` is now the application root: it wires `QueryClientProvider` (TanStack Query, see
[src/app/queryClient.ts](src/app/queryClient.ts)) and `RouterProvider`
([src/app/router.tsx](src/app/router.tsx)). Routes:

| Path | Page | Theme |
|---|---|---|
| `/` | `pages/LandingPage` (marketing) | legacy light (`traw-*`) — migrating to Aurora Glass |
| `/plan` | `pages/PlanPage` (wizard, M1) | Aurora Glass |
| `/tripboards` | `pages/TripboardsPage` (browse, M3) | Aurora Glass |
| `/t/:slug` | `pages/TripboardPage` (M3) | Aurora Glass |

### Section composition (landing page)

`LandingPage` assembles eight ordered section components:

```
Navbar → Hero → Features → Destinations → TravelPartners → Testimonials → HowItWorks → Compatibility → Footer
```

Each section is a file in [src/components/sections/](src/components/sections/). In-page navigation is
anchor-based (`#hero`, `#features`, …) with `scrollIntoView`.

### Client state

- **Zustand** for local UI/wizard state.
- **TanStack Query** for server data fetching/caching.

### Styling system

Tailwind CSS with a custom design token palette defined in [tailwind.config.js](tailwind.config.js):

| Token | Value | Usage |
|---|---|---|
| `traw-bg` | `#F5F4F0` | Page background |
| `traw-surface` | `#FFFFFF` | Card surfaces |
| `traw-primary` | `#1A1A18` | Primary text / buttons |
| `traw-lime` | `#C8E63C` | Accent color (CTA highlights) |
| `traw-green` | `#1D3B2F` | Dark green brand color |

Typography: `font-display` → Playfair Display (headings), `font-sans` → Inter (body). Loaded from Google Fonts in [src/index.css](src/index.css).

Global component classes (`.btn-primary`, `.btn-lime`, `.btn-dark`, `.btn-outline`, `.section-heading`, `.card-glass`, `.polaroid-card`) are defined as Tailwind `@layer components` in [src/index.css](src/index.css). Use these rather than inlining repeated utility chains.

Use [src/lib/cn.ts](src/lib/cn.ts) (`cn()`) to merge conditional/conflicting Tailwind classes.

### Aurora Glass design system (new primary theme)

The product UI uses **Aurora Glass**: deep-twilight base (`aurora-deep`/`aurora-void`), drifting
aurora gradient blobs, frosted-glass surfaces, electric-cyan (`aurora-cyan`) + warm-coral
(`aurora-coral`) accents. Tokens live under the `aurora-*` namespace in
[tailwind.config.js](tailwind.config.js). Reusable classes: `.glass`, `.glass-sm`, `.text-aurora`,
`.btn-aurora`, `.btn-glass`. Primitives:
[AuroraBackground](src/components/ui/AuroraBackground.tsx) and
[GlassCard](src/components/ui/GlassCard.tsx). The legacy `traw-*` light tokens remain only for the
not-yet-migrated marketing sections. Motion respects `prefers-reduced-motion` (global rule in index.css).

### Animation pattern

All entrance animations use **Framer Motion**. The project-wide pattern is:

- `whileInView` + `viewport={{ once: true }}` for scroll-triggered reveals on section content
- `motion.div` with `initial`/`animate` for mount-time animations (Navbar, Hero)
- `useScrollAnimation` hook ([src/hooks/useScrollAnimation.ts](src/hooks/useScrollAnimation.ts)) provides a ref-based IntersectionObserver for cases that need imperative control outside Framer Motion
- `useNavScroll` from the same file detects scroll position to toggle the Navbar's frosted-glass style

### Shared UI primitives

Reusable presentational components live in [src/components/ui/](src/components/ui/):

- `FeatureCard` — icon + title + description card with optional stat block
- `StepCard` — numbered step for the HowItWorks flow
- `PhotoCard` — polaroid-style image card
- `SwooshLine` — decorative SVG swoosh used as a section divider in Hero

### Types

All shared TypeScript interfaces are centralized in [src/types/index.ts](src/types/index.ts): `NavLink`, `Feature`, `Step`, `Traveler`, `Testimonial`, `DestinationCard`, `NewsletterFormData`, `FooterColumn`.
