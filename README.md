# Dev Stream Labs Landing Page

Performance-focused, unofficial frontend recreation of the Dev Stream Labs marketing site. Built to preserve a polished, interactive experience while keeping client-side overhead low.

**Live demo:** [dsl-landing-ten.vercel.app](https://dsl-landing-ten.vercel.app/)

> [!IMPORTANT]
> This is an independent educational project. I am not employed by, affiliated with, endorsed by, or commissioned by Dev Stream Labs. The Dev Stream Labs name, logo, brand assets, product copy, certifications, and product claims belong to their respective owners and are reproduced here only for study and demonstration.

## Project Goal

The goal was to recreate a content-rich marketing page with strong visual fidelity without relying on a large client-side runtime. Performance guided the architecture, asset strategy, component boundaries, and interaction design.

I also used the project to deepen my understanding of performance-oriented frontend architecture: static rendering, browser runtime cost, responsive asset delivery, caching, and progressive enhancement. Astro supported those goals through its static-first rendering model, but the primary focus remained the resulting user experience and delivery performance.

## Performance Approach

- Ships static HTML by default without a client-side framework runtime
- Uses small Astro-native scripts only for navigation, tabs, reveal effects, parallax, the integration flow, and form feedback
- Generates responsive WebP image variants with explicit dimensions through Astro's image pipeline
- Prioritizes the hero image while lazy-loading below-the-fold media
- Self-hosts WOFF2 fonts, preloads critical families, and uses `font-display: swap`
- Serves hashed Astro assets with long-lived immutable caching on Vercel
- Respects reduced-motion preferences for animation-heavy elements
- Keeps dependencies and component responsibilities focused

## Features

- Responsive desktop and mobile layouts
- Animated integration-flow visualization
- Interactive feature tabs
- Scroll-based reveal and hero effects
- Accessible mobile navigation
- Demo-form feedback state
- Reusable Astro components
- Custom metadata, favicon, and 404 page
- Long-lived caching for generated Astro assets

## Tech Stack

- [Astro](https://astro.build/)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- JavaScript
- [Lucide](https://lucide.dev/)
- [Vercel](https://vercel.com/)

## Running Locally

```sh
git clone https://github.com/GabrielMSaraiva/dsl-landing.git
cd dsl-landing
npm ci
npm run dev
```

Open `http://localhost:4321`.

## Quality Checks

```sh
npm run lint
npm run check
npm run build
```

## Attribution

- Original product and website: [Dev Stream Labs](https://devstreamlabs.com/)
- Repository work: independent Astro implementation and frontend behavior by Gabriel Saraiva

No license is granted for third-party trademarks or brand assets included in this educational recreation.
