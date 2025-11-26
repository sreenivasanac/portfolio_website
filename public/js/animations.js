document.addEventListener("DOMContentLoaded", () => {
  let commands = []; // Lifted for global access

  // Terminal command typewriter animation
  const terminalCommandTextElements = Array.from(document.querySelectorAll(".terminal-command-text"));
  if (terminalCommandTextElements.length > 0) {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    commands = terminalCommandTextElements
      .map((element, idx) => ({
        id: idx,
        element,
        original: element.textContent ?? "",
        animated: false,
        timeoutId: null,
        caretTimeoutId: null,
      }))
      .filter((command) => command.original.trim().length > 0);

    if (commands.length > 0) {
      const commandMap = new Map(commands.map((command) => [command.element, command]));
      let observer = null;

      const scheduleCaretHide = (command) => {
        if (command.caretTimeoutId !== null) {
          window.clearTimeout(command.caretTimeoutId);
        }
        command.caretTimeoutId = window.setTimeout(() => {
          command.element.classList.remove("terminal-caret");
          command.caretTimeoutId = null;
        }, 5000);
      };

      const typeCommand = (command) => {
        const { element, original } = command;
        let index = 0;
        element.classList.remove("terminal-caret");
        element.classList.add("terminal-typing");
        element.textContent = "";

        const step = () => {
          if (index >= original.length) {
            element.textContent = original;
            element.classList.remove("terminal-typing");
            element.classList.add("terminal-caret");
            command.timeoutId = null;
            scheduleCaretHide(command);
            return;
          }

          element.textContent += original.charAt(index);
          // Play electric typing sound - throttled and limited to first 20 chars
          if (index < 20 && window.soundManager) {
             window.soundManager.playElectricTypingSound(command.id);
          }
          index += 1;
          const delay = 28 + Math.random() * 42;
          command.timeoutId = window.setTimeout(step, delay);
        };

        step();
      };

      const triggerCommand = (command) => {
        if (command.animated) {
          return;
        }

        // Check global settings - if animations disabled, show text immediately and mark animated
        if (window.SettingsManager && !window.SettingsManager.state.animationEnabled) {
             command.element.textContent = command.original;
             command.element.classList.remove("terminal-typing");
             command.element.classList.add("terminal-caret"); 
             command.animated = true;
             return;
        }

        command.animated = true;
        typeCommand(command);
      };

      const checkVisibleCommands = () => {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        commands.forEach((command) => {
          if (command.animated) {
            return;
          }

          const rect = command.element.getBoundingClientRect();
          const isVisible = rect.bottom > 0 && rect.top <= viewportHeight * 0.9;

          if (isVisible) {
            triggerCommand(command);
            if (observer) {
              observer.unobserve(command.element);
            }
          }
        });
      };

      const activateTyping = () => {
        observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              const command = commandMap.get(entry.target);
              if (!command) {
                obs.unobserve(entry.target);
                return;
              }

              triggerCommand(command);
              obs.unobserve(entry.target);
            });
          },
          {
            root: null,
            threshold: 0.2,
            rootMargin: "0px 0px -10%",
          },
        );

        commands.forEach((command) => {
          observer.observe(command.element);
        });

        checkVisibleCommands();
        window.addEventListener("load", checkVisibleCommands, { once: true });
      };

      const applyReduceMotionState = () => {
        if (observer) {
          observer.disconnect();
          observer = null;
        }

        commands.forEach((command) => {
          if (command.timeoutId !== null) {
            window.clearTimeout(command.timeoutId);
            command.timeoutId = null;
          }
          if (command.caretTimeoutId !== null) {
            window.clearTimeout(command.caretTimeoutId);
            command.caretTimeoutId = null;
          }
          command.element.classList.remove("terminal-typing");
          command.element.classList.add("terminal-caret");
          command.element.textContent = command.original;
          command.animated = true;
          scheduleCaretHide(command);
        });
      };

      if (motionPreference.matches) {
        applyReduceMotionState();
      } else {
        activateTyping();
      }

      const handleMotionPreferenceChange = (event) => {
        if (event.matches) {
          applyReduceMotionState();
        }
      };

      if (typeof motionPreference.addEventListener === "function") {
        motionPreference.addEventListener("change", handleMotionPreferenceChange);
      } else if (typeof motionPreference.addListener === "function") {
        motionPreference.addListener(handleMotionPreferenceChange);
      }
    }
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Hacker Text Scramble Effect
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>[]{}|/\\~`";
  const scrambleElements = document.querySelectorAll(".hacker-text, .scramble-text, .project-text h3, .company-header h3 a");

  scrambleElements.forEach((element) => {
    // Store original text once to ensure integrity
    element.dataset.originalText = element.innerText;

    element.addEventListener("mouseover", (event) => {
      // CHECK IF ANIMATION DISABLED
      if (document.body.classList.contains('disable-animation')) return;

      // Stop propagation to prevent global hover sounds from firing
      event.stopPropagation();
      
      // Play electric sound on hover start
      if (window.soundManager && !window.soundManager.isMuted) {
        const audio = new Audio('assets/sounds/sci_fi_beep_electric.wav');
        audio.volume = 0.1;
        audio.play().catch(() => {});
      }

      let iterations = 0;
      const originalText = element.dataset.originalText;

      // Clear any existing interval to prevent race conditions
      if (element.dataset.scrambleInterval) {
        clearInterval(Number(element.dataset.scrambleInterval));
      }

      const interval = setInterval(() => {
        const words = originalText.split(' ');
        const revealIndex = Math.floor(iterations / 3);
        const scrambledWords = words.map((word) => {
          return word.split('').map((char, charIndex) => {
            if (charIndex < revealIndex) {
              return char;
            }
            return letters[Math.floor(Math.random() * letters.length)];
          }).join('');
        });
        
        event.target.innerText = scrambledWords.join(' ');
        
        const maxWordLength = Math.max(...words.map(w => w.length));
        
        if (revealIndex >= maxWordLength) {
          clearInterval(interval);
          event.target.innerText = originalText;
          delete element.dataset.scrambleInterval;
        }

        iterations += 1;
      }, 30);

      element.dataset.scrambleInterval = interval;
    });

    // Reset immediately on mouse leave
    element.addEventListener("mouseleave", (event) => {
      if (element.dataset.scrambleInterval) {
        clearInterval(Number(element.dataset.scrambleInterval));
        delete element.dataset.scrambleInterval;
      }
      event.target.innerText = element.dataset.originalText;
    });
  });

  // Listen for settings changes to force-finish animations if needed
  window.addEventListener('settingsChanged', (e) => {
    if (!e.detail.animationEnabled) {
      // Kill running typewriters
      if (commands.length > 0) {
         commands.forEach(cmd => {
            if(cmd.timeoutId) clearTimeout(cmd.timeoutId);
            cmd.element.textContent = cmd.original;
            cmd.element.classList.remove('terminal-typing');
         });
      }
      // Kill running scrambles
      scrambleElements.forEach(el => {
         if(el.dataset.scrambleInterval) {
             clearInterval(Number(el.dataset.scrambleInterval));
             delete el.dataset.scrambleInterval;
             el.innerText = el.dataset.originalText;
         }
      });
    }
  });
});
