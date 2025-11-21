# Sreenivasan AC - Portfolio Website

A modern, terminal-inspired portfolio website showcasing professional experience as an AI Software Engineer with 9+ years across FAANG companies and AI startups.

**Live Site:** [View Portfolio](https://sreenivasanac.github.io/portfolio_website/) *(update with your actual URL)*

> **🚀 Recently Refactored**: This project now uses Vite for development and building, with modular HTML/CSS architecture for better maintainability. The production build is optimized and works without a web server (file:// protocol compatible).

---

## Overview

This portfolio website features a unique terminal-inspired, cyberpunk/hacker aesthetic with interactive elements. Built with vanilla HTML, CSS, and JavaScript using modern build tools for optimal performance and developer experience.

### Key Features

- **Terminal-Inspired Design** - Dark theme with JetBrains Mono font and command-line aesthetics
- **Interactive Navigation** - Dynamic path updates mimicking terminal directory navigation
- **Detailed Experience Modals** - Expandable sections for each work experience with comprehensive project details
- **Smooth Scrolling** - Intelligent scroll detection with active section highlighting
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Company Branding** - Professional logos for Google, Apple, Groupon, and other companies
- **Performance First** - Minimal dependencies, fast loading times
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation support

---

## Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **pnpm** package manager

Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

### Installation

```bash
# Navigate to project directory
cd portfolio_website

# Install dependencies
pnpm install
```

### Development

Start the development server with hot-reloading:

```bash
pnpm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Build the static site for deployment:

```bash
pnpm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
pnpm run preview
```

### Open Without Server

The built site (`dist/index.html`) can be opened directly in your browser by double-clicking the file - no server required! This works thanks to the serverless-compatible build configuration.

---

## Project Structure

```
portfolio_website/
├── index.html              # Main HTML entry point
├── README.md               # This file
├── package.json            # Node.js dependencies and scripts
├── pnpm-lock.yaml          # pnpm lock file
├── vite.config.js          # Vite build configuration
├── vite-plugin-no-module.js # Custom plugin for file:// compatibility
│
├── src/
│   ├── main.js             # JavaScript entry point
│   ├── html/               # HTML partials for modular structure
│   │   ├── navbar.html
...
│   └── css/
│       ├── main.css        # CSS entry point (imports modules)
│       ├── cursor_animation.css
│       └── modules/        # Modular CSS files
│           ├── variables.css
│           ├── base.css
...
│
├── public/                 # Static assets (copied to dist/)
│   ├── assets/
│   │   ├── favicon.ico
│   │   ├── logos/          # Company and college logos
│   │   ├── images/         # Profile images and project screenshots
│   │   └── sounds/         # Sound effects
│   └── js/                 # JavaScript modules
│
└── dist/                   # Production build output (generated)
    ├── index.html
    ├── assets/
    │   ├── style-[hash].css
    │   └── main-[hash].js
    └── [copied from public/]
```

---

## Sections

### 1. About (Hero Section)
- Profile photo with animated styling
- Professional summary and role
- Quick links to GitHub, LinkedIn, Email, X/Twitter, and Resume
- Email copy-to-clipboard functionality

### 2. Work Experience
- 6 detailed work experiences with company logos:
  - **Brahmasumm AI** - Founding Engineer (Enterprise AI)
  - **Google** - Senior SDE (Google Cloud Platform)
  - **Apple** - Senior SDE (Cloud Technologies)
  - **Fathom Health** - SDE (Healthcare AI)
  - **Invento Robotics** - AI Engineer (Humanoid Robots)
  - **Groupon** - SDE (Full Stack)
- Each experience includes:
  - Company logo and link
  - Role and location
  - Date range
  - Technology tags
  - Key accomplishments
  - Expandable "See More" modals with comprehensive details

### 3. Education
- Master's in Computer Science (AI/ML) - Georgia Institute of Technology
- Bachelor's in Computer Science - NIT Trichy
- Academic achievements and teaching roles

### 4. Featured Projects
- **Namesmith Agents** - Multi-agent domain discovery system (LangGraph)
- **Brahmasumm Enterprise AI** - Production RAG platform
- **Quora Activity Analytics** - Web scraping pipeline with anti-bot detection
- **Personalized AI Health Coach** - Hackathon-winning RAG assistant (FAISS)

### 5. Technical Skills
Organized by category:
- Languages (Python, TypeScript/JavaScript, SQL)
- Full Stack (FastAPI, React, Next.js)
- AI/ML Concepts (RAG, Prompt Engineering, Multi-agent Systems)
- AI/ML Frameworks (LangChain, LangGraph, Vector DBs)
- Web Technologies (Selenium, OAuth2, REST APIs)
- Cloud & DevOps (AWS, Azure, Kubernetes)
- Database & Pipeline (PostgreSQL, MongoDB, Apache Airflow)
- Soft Skills (Writing, Structured Thinking, Problem-Solving)

### 6. Spotlight & Achievements
- ACM ICPC Regional Finalist
- Top 0.2% National Rank in IIT-JEE
- AI Newsletter & Blog author

### 7. Contact
- Email with mailto link
- Phone number
- Social media links
- Google Calendar booking integration
- Terminal-style contact prompt

---

## Technologies Used

### Build System
- **Vite** - Fast build tool and dev server with hot module replacement
- **PostCSS** - CSS processing with import plugin for modular styles
- **pnpm** - Fast, disk space efficient package manager
- **Custom Plugins** - file:// protocol compatibility plugin

### Core
- **HTML5** - Semantic markup with ARIA accessibility, modularized with partials
- **CSS3** - Modern features including:
  - CSS Variables for theming
  - Modular CSS architecture (variables, base, animations, layout, components, sections, utilities)
  - Flexbox and Grid layouts
  - Custom animations and transitions
  - Media queries for responsiveness
- **Vanilla JavaScript** - No frameworks, pure ES6+:
  - Intersection Observer API (for scroll detection)
  - RequestAnimationFrame (for smooth performance)
  - Clipboard API (for email copying)
  - Event delegation and DOM manipulation
  - Particle system and interactive effects

### Fonts & Icons
- **JetBrains Mono** - Monospace font for terminal aesthetic
- **Rajdhani & Orbitron** - UI fonts for headings and accents
- **Inline SVG Icons** - Custom-styled vector icons

### Design System
- Dark cyberpunk/hacker theme with custom CSS variables
- Consistent spacing and typography scale
- Reusable component patterns
- Gradient overlays, glassmorphism, and neon effects
- CRT scanline animations and interactive particles

---


## Customization Guide

### Update Personal Information

1. **Profile & Contact Info** - Edit in [index.html](index.html):
   - Name, title, bio (line 141-147)
   - Email, phone, social links (line 152-236)
   - Contact section (line 839-982)

2. **Work Experience** - Edit in [index.html](index.html):
   - Add/remove experience items (line 262-470)
   - Update company details in modal data in [assets/script.js](assets/script.js) (line 132-309)

3. **Projects** - Edit project cards in [index.html](index.html) (line 567-632)

4. **Skills** - Update skill categories in [index.html](index.html) (line 708-836)

### Update Styling

Edit [assets/styles.css](assets/styles.css):
- **Theme Colors** - Modify CSS variables in `:root` (line 4-32)
- **Typography** - Change font family, sizes, weights
- **Spacing** - Adjust padding, margins, gaps
- **Animations** - Customize transition speeds and effects

### Add Company Logos

1. Add logo image to `assets/logos/` directory
2. Update image `src` in [index.html](index.html)
3. Recommended: Use PNG or SVG format, optimize for web

### Modify Navigation

Edit navigation links in [index.html](index.html) (line 30-105):
- Add/remove sections
- Update section IDs
- Change icons (using inline SVG)

---

## Deployment Options

### GitHub Pages

1. Build the production version:
   ```bash
   pnpm run build
   ```

2. Push the `dist/` directory to GitHub:
   ```bash
   git add dist/
   git commit -m "Deploy production build"
   git push origin main
   ```

3. Configure GitHub Pages:
   - Go to **Settings** → **Pages**
   - Select branch (usually `main`) and `/dist` directory
   - Click **Save**
   - Your site will be live at `https://username.github.io/repository-name/`

### Netlify

```bash
# Build first
pnpm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy dist folder
netlify deploy --prod --dir=dist
```

Or drag and drop the `dist/` folder on [netlify.com/drop](https://netlify.com/drop)

**Netlify Configuration**: Create `netlify.toml` in root:
```toml
[build]
  command = "pnpm run build"
  publish = "dist"
```

### Vercel

```bash
# Build first
pnpm run build

# Install Vercel CLI
npm install -g vercel

# Deploy dist folder
vercel --prod dist
```

**Vercel Configuration**: Create `vercel.json` in root:
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist"
}
```

### Custom Domain

1. Deploy to any static hosting service
2. Add custom domain in hosting settings
3. Update DNS records with your domain provider
4. Enable HTTPS (usually automatic)

### Important Notes

- Always build before deploying: `pnpm run build`
- Deploy the `dist/` directory, not the source files
- The build is optimized and works without a server (file:// compatible)

---

## Performance Optimizations

- **Modular Architecture** - HTML and CSS split into focused, maintainable modules
- **Separate CSS Loading** - CSS loads synchronously via `<link>` tag (no FOUC)
- **Optimized Build** - Vite bundles and minifies for production
- **Minimal JavaScript Bundle** - Core JS is only 0.03 KB
- **IIFE Format** - JavaScript uses Immediately Invoked Function Expression (no module overhead)
- **File:// Compatible** - Works without a web server (no CORS issues)
- **Asset Optimization** - Compressed images and optimized file sizes
- **Lazy Loading** - Images load only when visible (via Intersection Observer)
- **CSS Code Splitting** - Single CSS bundle to minimize requests

---

## Development Workflow

### Making Changes

1. Start the dev server: `pnpm run dev`
2. Edit source files in `src/`, `public/`, or root `index.html`
3. Browser automatically reloads on file changes (hot module replacement)
4. Test responsive design using browser DevTools
5. Build for production: `pnpm run build`
6. Test the production build: Open `dist/index.html` or run `pnpm run preview`
7. Commit changes with Git

### Source File Locations

- **HTML Content**: Edit partials in `src/html/` directory
- **Styles**: Edit CSS modules in `src/css/modules/`
- **JavaScript**: Edit JS files in `public/js/`
- **Assets**: Add images/logos/sounds to `public/assets/`
- **Main Entry**: Edit `index.html` for overall structure

### Version Control

```bash
# Track changes (exclude dist/ if not deploying via git)
git add src/ public/ index.html package.json

# Or add everything including dist/
git add .

# Commit
git commit -m "Update experience section with new role"

# Push
git push origin main
```

### Testing Locally

**Development Server** (`pnpm run dev`):
- Hot module replacement for instant updates
- Source maps for easier debugging
- Fast refresh on file changes

**Production Build** (`pnpm run build`):
- Minified and optimized output
- Test with `dist/index.html` or `pnpm run preview`
- Verify file:// compatibility by double-clicking `dist/index.html`

Use browser DevTools to:
- Test responsive design (toggle device toolbar)
- Debug JavaScript (Console tab)
- Inspect CSS (Elements tab)
- Check performance (Lighthouse)
- Test accessibility (Accessibility tab)
- Monitor network requests (Network tab)

---

## Future Enhancements

Potential additions:
- [ ] Blog section with article previews
- [ ] Dark/Light theme toggle
- [ ] Animated text transitions
- [ ] More project case studies
- [ ] Testimonials section
- [ ] Analytics integration (Google Analytics, Plausible)
- [ ] SEO meta tags and Open Graph tags
- [ ] Progressive Web App (PWA) features
- [ ] Contact form with backend integration

---

## License

This is a personal portfolio project. Feel free to use the code structure and design as inspiration for your own portfolio, but please don't copy content verbatim.

---

## Contact & Connect

- **Email:** [sreenivasan.nitt@gmail.com](mailto:sreenivasan.nitt@gmail.com)
- **LinkedIn:** [linkedin.com/in/sreenivasan-ac](https://www.linkedin.com/in/sreenivasan-ac/)
- **GitHub:** [github.com/sreenivasanac](https://github.com/sreenivasanac)
- **X/Twitter:** [@sreenivasan_ac](https://x.com/sreenivasan_ac)
- **Resume:** [View Resume](https://drive.google.com/file/d/1dQNSDMnKY2ZJGlvO_liYfB3oQCCnbAiz/view?usp=sharing)

---

## Acknowledgments

- **Fonts:** [JetBrains Mono](https://www.jetbrains.com/lp/mono/) by JetBrains
- **Icons:** Custom inline SVG icons
- **Design Inspiration:** Terminal interfaces and developer tools

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
