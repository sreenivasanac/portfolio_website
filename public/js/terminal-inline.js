/**
 * Inline Terminal for Hero Section
 * Interactive CLI experience within the portfolio hero card
 */

(function() {
  'use strict';

  // State
  const state = {
    history: [],
    historyIndex: -1,
    isActive: false, // Whether terminal has output displayed
  };

  // Commands registry
  const commands = {
    help: {
      desc: "show available commands",
      fn: () => {
        return `
<span class="bold white">Available Commands</span>

<span class="muted">--- navigation ---</span>
<span class="cmd">about</span>         scroll to about section
<span class="cmd">experience</span>    scroll to experience
<span class="cmd">education</span>     scroll to education
<span class="cmd">projects</span>      scroll to projects
<span class="cmd">skills</span>        scroll to skills
<span class="cmd">contact</span>       scroll to contact

<span class="muted">--- info ---</span>
<span class="cmd">whoami</span>        who is sreenivasan
<span class="cmd">resume</span>        open resume
<span class="cmd">social</span>        find me online
<span class="cmd">email</span>         copy email

<span class="muted">--- terminal ---</span>
<span class="cmd">clear</span>         close & show profile
`;
      },
    },

    whoami: {
      desc: "who is sreenivasan",
      fn: () => {
        return `
<span class="bold white">Sreenivasan AC</span> <span class="muted">[2025]</span>
┌──────────────────────────────────────────────────┐
│  AI Software Engineer                            │
│  9+ years building production systems            │
│  FAANG (Google, Apple) & high-growth startups    │
└──────────────────────────────────────────────────┘

I specialize in:
• Agentic AI systems & multi-agent automation
• Production-scale RAG pipelines (50GB+ datasets)
• On-premises LLM deployments for Fortune 500
• Enterprise AI enablement

type <span class="cmd">experience</span> to see work history.
`;
      },
    },

    about: {
      desc: "scroll to about",
      fn: () => {
        navigateToSection('about');
        return '<span class="success">→ scrolling to about...</span>';
      },
    },

    experience: {
      desc: "scroll to experience",
      fn: () => {
        navigateToSection('experience');
        return '<span class="success">→ scrolling to experience...</span>';
      },
    },

    education: {
      desc: "scroll to education",
      fn: () => {
        navigateToSection('education');
        return '<span class="success">→ scrolling to education...</span>';
      },
    },

    projects: {
      desc: "scroll to projects",
      fn: () => {
        navigateToSection('projects');
        return '<span class="success">→ scrolling to projects...</span>';
      },
    },

    skills: {
      desc: "scroll to skills",
      fn: () => {
        navigateToSection('skills');
        return '<span class="success">→ scrolling to skills...</span>';
      },
    },

    contact: {
      desc: "scroll to contact",
      fn: () => {
        navigateToSection('contact');
        return '<span class="success">→ scrolling to contact...</span>';
      },
    },

    resume: {
      desc: "open resume",
      fn: () => {
        window.open('https://drive.google.com/file/d/1dQNSDMnKY2ZJGlvO_liYfB3oQCCnbAiz/view?usp=sharing', '_blank');
        return '<span class="success">→ opening resume...</span>';
      },
    },

    social: {
      desc: "find me online",
      fn: () => {
        return `
<span class="bold white">Connect with me:</span>

• <a href="https://github.com/sreenivasanac" target="_blank">GitHub</a>
• <a href="https://www.linkedin.com/in/sreenivasan-ac/" target="_blank">LinkedIn</a>
• <a href="https://x.com/sreenivasan_ac" target="_blank">X / Twitter</a>
• <a href="mailto:sreenivasan.nitt@gmail.com">Email</a>
`;
      },
    },

    email: {
      desc: "copy email",
      fn: async () => {
        try {
          await navigator.clipboard.writeText('sreenivasan.nitt@gmail.com');
          return '<span class="success">✓ copied sreenivasan.nitt@gmail.com</span>';
        } catch (e) {
          return '<span class="error">✗ failed to copy email</span>';
        }
      },
    },

    clear: {
      desc: "close terminal & show profile",
      fn: () => {
        clearOutput();
        expandHero();
        return null; // No output
      },
    },

    // Easter eggs
    ls: {
      desc: "list files",
      fn: () => 'about.md  experience.md  projects/  skills.json\n\n<span class="muted">try: whoami, experience, projects</span>',
    },

    pwd: {
      desc: "current directory",
      fn: () => '/home/sreenivasanac',
    },

    cd: {
      desc: "change directory",
      fn: (args) => {
        if (!args || args.length === 0) return '<span class="muted">~</span>';
        const section = args[0].replace(/[./]/g, '');
        if (commands[section]) return commands[section].fn();
        return `<span class="error">cd: ${args[0]}: no such directory</span>`;
      },
    },

    sudo: {
      desc: "nice try",
      fn: () => '<span class="error">nice try, but you don\'t have sudo access here.</span>',
    },

    neofetch: {
      desc: "system info",
      fn: () => `<span class="accent">     _</span>          sreeni@portfolio
<span class="accent">    (_)</span>         ----------------
<span class="accent"> ___ _  ___</span>     OS: Human 1.0
<span class="accent">/ __| |/ _ \\</span>    Host: Earth
<span class="accent">\\__ \\ |  __/</span>    Kernel: Coffee
<span class="accent">|___/_|\\___|</span>    Uptime: 9+ years
                  Shell: bash`,
    },
  };

  // Navigate to section
  function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // Collapse hero content, show summary
  function collapseHero() {
    const heroControls = document.getElementById('hero-controls');
    const heroCollapsed = document.getElementById('hero-collapsed');
    const terminalOutput = document.getElementById('terminal-output');
    const closeBtn = document.getElementById('terminal-close-btn');
    
    if (heroControls && heroCollapsed && terminalOutput) {
      heroControls.classList.add('collapsed');
      heroCollapsed.style.display = 'flex';
      terminalOutput.style.display = 'block';
      if (closeBtn) closeBtn.classList.add('visible');
      state.isActive = true;
    }
  }

  // Expand hero content back (and clear terminal)
  function expandHero() {
    const heroControls = document.getElementById('hero-controls');
    const heroCollapsed = document.getElementById('hero-collapsed');
    const terminalOutput = document.getElementById('terminal-output');
    const closeBtn = document.getElementById('terminal-close-btn');
    
    if (heroControls && heroCollapsed) {
      heroControls.classList.remove('collapsed');
      heroCollapsed.style.display = 'none';
      // Also clear and hide terminal output
      if (terminalOutput) {
        terminalOutput.innerHTML = '';
        terminalOutput.style.display = 'none';
      }
      // Hide close button
      if (closeBtn) closeBtn.classList.remove('visible');
      state.isActive = false;
    }
  }

  // Clear output
  function clearOutput() {
    const output = document.getElementById('terminal-output');
    if (output) {
      output.innerHTML = '';
      output.style.display = 'none';
    }
  }

  // Append output
  function appendOutput(text) {
    const output = document.getElementById('terminal-output');
    if (output && text) {
      output.innerHTML += text + '\n';
      output.scrollTop = output.scrollHeight;
    }
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Get completions
  function getCompletions(partial) {
    const cmdNames = Object.keys(commands);
    return cmdNames.filter(c => c.startsWith(partial.toLowerCase()));
  }

  // Execute command
  async function executeCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add to history
    state.history.push(trimmed);
    state.historyIndex = state.history.length;

    // Parse command
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Collapse hero on first command
    if (!state.isActive) {
      collapseHero();
    }

    // Show command in output
    appendOutput(`<span class="prompt">∴</span> <span class="accent">${escapeHtml(trimmed)}</span>`);

    // Execute
    if (commands[cmd]) {
      const result = await commands[cmd].fn(args);
      if (result) {
        appendOutput(result);
        appendOutput('\n<span class="muted">tip: ESC to close | TAB to complete | ↑↓ history</span>');
      }
    } else {
      appendOutput(`<span class="error">command not found: ${cmd}</span>\ntype <span class="cmd">help</span> for available commands.`);
      appendOutput('\n<span class="muted">tip: ESC to close | TAB to complete | ↑↓ history</span>');
    }
  }

  // Initialize
  function init() {
    const input = document.getElementById('terminal-input');
    const form = document.getElementById('terminal-input-form');
    const expandBtn = document.getElementById('hero-expand-btn');

    if (!form || !input) return;

    // Form submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const value = input.value;
      input.value = '';
      await executeCommand(value);
    });

    // Input key handlers
    input.addEventListener('keydown', (e) => {
      // History navigation
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.historyIndex > 0) {
          state.historyIndex--;
          input.value = state.history[state.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          input.value = state.history[state.historyIndex] || '';
        } else {
          state.historyIndex = state.history.length;
          input.value = '';
        }
      }
      // Tab completion
      else if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const value = input.value.trim();
        if (value) {
          const completions = getCompletions(value);
          if (completions.length === 1) {
            input.value = completions[0];
          } else if (completions.length > 1 && state.isActive) {
            appendOutput(`<span class="muted">${completions.join('  ')}</span>`);
          }
        }
      }
      // Ctrl+L to clear
      else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearOutput();
        expandHero();
      }
      // Ctrl+C to cancel
      else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        input.value = '';
      }
      // ESC to close terminal and show profile
      else if (e.key === 'Escape') {
        e.preventDefault();
        clearOutput();
        expandHero();
        input.value = '';
      }
    });

    // Expand button (show profile)
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        expandHero();
      });
    }

    // Terminal close button (in title bar)
    const closeBtn = document.getElementById('terminal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (state.isActive) {
          clearOutput();
          expandHero();
        }
      });
    }

    // Click on collapsed summary to expand
    const heroCollapsed = document.getElementById('hero-collapsed');
    if (heroCollapsed) {
      heroCollapsed.addEventListener('click', (e) => {
        if (e.target !== expandBtn) {
          expandHero();
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
