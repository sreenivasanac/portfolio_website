# Sreenivasan AC - Portfolio Website

A modern, interactive portfolio website showcasing my professional experience as an AI Software Engineer.

## Features

- 🎨 Modern terminal-inspired design with dark theme
- 📱 Fully responsive layout for all devices
- 🏢 Company logos for each organization
- 📖 Modal system with detailed company information
- 🎯 Smooth scrolling navigation
- ⚡ Fast loading with minimal dependencies

## Quick Start

### View locally with Python (recommended):
```bash
# Navigate to project directory
cd portfolio_website

# Start local server (Python 3)
python3 -m http.server 8080

# Or with Python 2
python -m SimpleHTTPServer 8080
```

Then open http://localhost:8080 in your browser.

### View with Node.js:
```bash
# Install http-server globally (one time)
npm install -g http-server

# Start server
http-server -p 8080
```

## Structure

```
portfolio_website/
├── index.html          # Main HTML file
├── assets/
│   ├── styles.css     # All styling
│   ├── script.js      # JavaScript functionality
│   ├── me.png         # Profile photo
│   └── logos/         # Company and college logos
│       ├── google-logo.png
│       ├── apple-logo.png
│       ├── groupon-logo.png
│       ├── gatech-logo.png
│       ├── nit-logo.png
│       └── logo-placeholder.svg
└── devsanket/
    └── assets/        # Resume and about me files
```

## Key Updates

### Experience Section
- Added individual sections for each company (Brahmasumm AI, Google, Apple, Groupon, Fathom Health, Invento Robotics)
- Each company has a logo and "See More Details" button
- Updated with detailed information from resume

### Education Section
- Added logos for Georgia Tech and NIT Trichy
- Included additional details like Teaching Assistant role and ACM ICPC achievement

### Modal System
- Click "See More Details" to view comprehensive information about each role
- Includes project details, technologies used, and impact made
- Modal can be closed with ESC key, X button, or clicking outside

### Visual Enhancements
- Company logos with consistent styling
- Improved spacing and readability
- Responsive design for mobile devices

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- Vanilla JavaScript (no frameworks required)
- JetBrains Mono font for terminal aesthetic

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Customization

To update content:
1. Edit experience details in `index.html`
2. Update modal content in `assets/script.js` (companyDetails object)
3. Replace logos in `assets/logos/` directory
4. Modify styles in `assets/styles.css`

## Contact

- Email: sreenivasan.nitt@gmail.com
- LinkedIn: [linkedin.com/in/sreenivasan-ac](https://www.linkedin.com/in/sreenivasan-ac/)
- GitHub: [github.com/sreenivasanac](https://github.com/sreenivasanac)
