# Cico Jazz Orchester Website

The official website for the Cico Jazz Orchester, a 20-piece jazz ensemble from Munich.
Visit the live site at [cicojazz.de](https://cicojazz.de).

## Architecture

This project is a static website built for performance and maintainability.

- **Static Site**: Deployed to Cloudflare Pages.
- **Build Tool**: [Vite](https://vitejs.dev/) for fast development and optimized production builds.
- **Languages**:
  - **TypeScript**: For type-safe logic (modularized in `src/scripts/`).
  - **SCSS**: Modular styling (in `src/styles/`).
  - **HTML5**: Semantic structure.
- **Assets**: Images are delivered via Cloudinary for responsive optimization.
- **Smooth Scrolling**: Implemented with [Lenis](https://github.com/studio-freight/lenis).

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```
