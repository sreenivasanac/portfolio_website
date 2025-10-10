# Sreenivasan AC - Portfolio Website

A modern, terminal-inspired portfolio website showcasing professional experience as an AI Software Engineer with 9+ years across FAANG companies and AI startups.

**Live Site:** [View Portfolio](https://sreenivasanac.github.io/portfolio_website/) *(update with your actual URL)*

---

## Overview

This portfolio website features a unique terminal-inspired design with a clean, developer-focused aesthetic. Built with vanilla HTML, CSS, and JavaScript - no frameworks required for maximum performance and simplicity.

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

### Option 1: Python HTTP Server (Recommended)

```bash
# Navigate to project directory
cd portfolio_website

# Python 3
python3 -m http.server 8080

# Or Python 2
python -m SimpleHTTPServer 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Node.js HTTP Server

```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Start server
http-server -p 8080
```

### Option 3: Open Directly

Simply double-click [index.html](index.html) to open in your default browser (some features may require a local server).

---

## Project Structure

```
portfolio_website/
├── index.html              # Main HTML structure
├── README.md               # This file
├── .gitignore             # Git ignore rules
│
├── assets/
│   ├── styles.css         # Complete styling and theme variables
│   ├── script.js          # Navigation, modals, and interactivity
│   ├── favicon.ico        # Site favicon
│   │
│   ├── logos/             # Company and college logos
│   │
│   └── projects/          # Project screenshots/assets
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

### Core
- **HTML5** - Semantic markup with ARIA accessibility
- **CSS3** - Modern features including:
  - CSS Variables for theming
  - Flexbox and Grid layouts
  - Custom animations and transitions
  - Media queries for responsiveness
- **Vanilla JavaScript** - No frameworks, pure ES6+:
  - Intersection Observer API (for scroll detection)
  - RequestAnimationFrame (for smooth performance)
  - Clipboard API (for email copying)
  - Event delegation and DOM manipulation

### Fonts & Icons
- **JetBrains Mono** - Monospace font for terminal aesthetic
- **Inline SVG Icons** - Custom-styled vector icons

### Design System
- Dark theme with custom CSS variables
- Consistent spacing and typography scale
- Reusable component patterns
- Gradient overlays and glassmorphism effects

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

1. Push code to GitHub repository
2. Go to **Settings** → **Pages**
3. Select branch (usually `main`) and root directory
4. Click **Save**
5. Your site will be live at `https://username.github.io/repository-name/`

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Or drag and drop the folder on [netlify.com/drop](https://netlify.com/drop)

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Custom Domain

1. Deploy to any static hosting service
2. Add custom domain in hosting settings
3. Update DNS records with your domain provider
4. Enable HTTPS (usually automatic)

---

## Performance Optimizations

- **No external dependencies** - Eliminates network requests for libraries
- **Inline critical CSS** - Fast first paint (optional optimization)
- **Lazy loading** - Images load only when visible
- **Minimal JavaScript** - Fast parsing and execution
- **Optimized images** - Compressed logos and photos
- **CSS containment** - Better rendering performance

---

## Accessibility Features

- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- ARIA labels and roles for screen readers
- Keyboard navigation support
- Focus indicators on interactive elements
- Sufficient color contrast ratios
- Alt text for all images
- Skip to content functionality (can be added)

---

## Development Workflow

### Making Changes

1. Edit files in your code editor
2. Refresh browser to see changes (no build step required!)
3. Test responsive design using browser DevTools
4. Commit changes with Git

### Version Control

```bash
# Track changes
git add .
git commit -m "Update experience section with new role"
git push origin main
```

### Testing Locally

Use browser DevTools to:
- Test responsive design (toggle device toolbar)
- Debug JavaScript (Console tab)
- Inspect CSS (Elements tab)
- Check performance (Lighthouse)
- Test accessibility (Accessibility tab)

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
