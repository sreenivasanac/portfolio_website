/**
 * Portfolio Enhancements
 * - Boot Sequence Animation (Experience section only)
 * - Floating Code Snippets (static background)
 * - Data Stream Border (applied via class)
 * - Status Bar Updates
 */

document.addEventListener("DOMContentLoaded", () => {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  
  // Check if animations should be disabled
  const shouldDisableAnimations = () => {
    return motionPreference.matches || 
           (window.SettingsManager && !window.SettingsManager.state.animationEnabled) ||
           document.body.classList.contains('disable-animation');
  };

  // =========================================
  // Boot Sequence Animation (Experience Only)
  // =========================================
  const initBootSequence = () => {
    const experienceSection = document.getElementById('experience');
    if (!experienceSection || shouldDisableAnimations()) {
      return;
    }

    // Create boot overlay
    const overlay = document.createElement('div');
    overlay.className = 'boot-sequence-overlay';
    
    const bootMessages = [
      { text: '> INITIALIZING CAREER_DATABASE...', delay: 0 },
      { text: '> LOADING EXPERIENCE_MODULES...', delay: 600 },
      { text: '> SCANNING CREDENTIALS... [VERIFIED]', delay: 1200, class: 'success' },
      { text: '> AUTHENTICATING PROFILE... [AUTHORIZED]', delay: 1800, class: 'success' },
      { text: '> DECRYPTING WORK_HISTORY...', delay: 2400 },
      { text: '> ACCESS GRANTED', delay: 3000, class: 'success' },
    ];

    // Build boot lines
    bootMessages.forEach((msg, index) => {
      const line = document.createElement('div');
      line.className = 'boot-line' + (msg.class ? ` ${msg.class}` : '');
      line.textContent = msg.text;
      if (index === bootMessages.length - 1) {
        const cursor = document.createElement('span');
        cursor.className = 'boot-cursor';
        line.appendChild(cursor);
      }
      overlay.appendChild(line);
    });

    // Add progress bar
    const progress = document.createElement('div');
    progress.className = 'boot-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'boot-progress-bar';
    progress.appendChild(progressBar);
    overlay.appendChild(progress);

    // Insert overlay into experience section
    experienceSection.style.position = 'relative';
    experienceSection.appendChild(overlay);

    // Animate boot sequence
    const lines = overlay.querySelectorAll('.boot-line');
    let currentProgress = 0;

    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        lines[index].classList.add('visible');
        currentProgress = ((index + 1) / bootMessages.length) * 100;
        progressBar.style.width = currentProgress + '%';
        
        if (index === 0) {
          progress.classList.add('visible');
        }

        // Play sound if available
        if (window.soundManager && !window.soundManager.isMuted && index < 3) {
          window.soundManager.playTypingSound();
        }
      }, msg.delay);
    });

    // Complete boot sequence
    setTimeout(() => {
      overlay.classList.add('boot-complete');
      
      // Remove overlay after animation
      setTimeout(() => {
        overlay.remove();
      }, 500);
    }, 4000);
  };

  // =========================================
  // Floating Code Snippets (Static)
  // =========================================
  const initFloatingCodeSnippets = () => {
    if (shouldDisableAnimations()) {
      return;
    }

    const container = document.createElement('div');
    container.className = 'floating-code-container';

    const codeSnippets = [
      `async function fetchData() {
  const response = await api.get();
  return response.data;
}`,
      `class NeuralNetwork {
  constructor(layers) {
    this.layers = layers;
  }
}`,
      `def train_model(X, y):
    model.fit(X, y)
    return model.predict(X)`,
      `SELECT * FROM experience
WHERE years > 5
ORDER BY impact DESC;`,
      `kubectl apply -f deploy.yaml
# Deploying to cluster...`,
      `git commit -m "feat: AI"
git push origin main`,
    ];

    // Positions for snippets (spread across viewport)
    const positions = [
      { top: '10%', left: '3%' },
      { top: '20%', right: '4%' },
      { top: '45%', left: '2%' },
      { top: '55%', right: '3%' },
      { top: '75%', left: '4%' },
      { top: '85%', right: '3%' },
    ];

    codeSnippets.forEach((code, index) => {
      const snippet = document.createElement('div');
      snippet.className = 'floating-code-snippet';
      snippet.textContent = code;
      
      const pos = positions[index % positions.length];
      if (pos.top) snippet.style.top = pos.top;
      if (pos.left) snippet.style.left = pos.left;
      if (pos.right) snippet.style.right = pos.right;
      if (pos.bottom) snippet.style.bottom = pos.bottom;

      container.appendChild(snippet);
    });

    document.body.appendChild(container);
  };

  // =========================================
  // Apply Data Stream Border to Cards
  // =========================================
  const initDataStreamBorders = () => {
    // Apply to main section cards
    const cards = document.querySelectorAll('.experience-card, .skills-card, .achievements-card, .contact-card');
    cards.forEach(card => {
      card.classList.add('data-stream-border');
    });
  };

  // =========================================
  // Status Bar Updates
  // =========================================
  const initStatusBar = () => {
    const uptimeElement = document.getElementById('status-uptime');
    const pingElement = document.getElementById('status-ping');
    
    if (!uptimeElement || !pingElement) return;

    // Update uptime every second
    let startTime = Date.now();
    
    const formatUptime = (ms) => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
      }
      return `${seconds}s`;
    };

    const updateStatus = () => {
      const uptime = Date.now() - startTime;
      uptimeElement.textContent = formatUptime(uptime);
      
      // Simulate ping (random between 1-15ms)
      const ping = Math.floor(Math.random() * 14) + 1;
      pingElement.textContent = `${ping}ms`;
    };

    updateStatus();
    setInterval(updateStatus, 1000);
  };

  // =========================================
  // Initialize All Enhancements
  // =========================================
  
  // Run immediately
  initDataStreamBorders();
  initFloatingCodeSnippets();
  initStatusBar();
  
  // Boot sequence with slight delay to ensure section is rendered
  setTimeout(initBootSequence, 100);

  // Listen for settings changes
  window.addEventListener('settingsChanged', (e) => {
    const container = document.querySelector('.floating-code-container');
    if (container) {
      container.style.display = e.detail.animationEnabled ? 'block' : 'none';
    }
  });
});
