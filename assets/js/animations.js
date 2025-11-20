document.addEventListener("DOMContentLoaded", () => {
  // Terminal command typewriter animation
  const terminalCommandTextElements = Array.from(document.querySelectorAll(".terminal-command-text"));
  if (terminalCommandTextElements.length > 0) {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const commands = terminalCommandTextElements
      .map((element) => ({
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
          // Removed typing sound to avoid noise during scroll-triggered animations
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
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const scrambleElements = document.querySelectorAll(".hacker-text, .scramble-text, .project-text h3, .company-header h3 a");

  scrambleElements.forEach((element) => {
    // Store original text once to ensure integrity
    element.dataset.originalText = element.innerText;

    element.addEventListener("mouseover", (event) => {
      let iterations = 0;
      const originalText = element.dataset.originalText;

      // Clear any existing interval to prevent race conditions
      if (element.dataset.scrambleInterval) {
        clearInterval(Number(element.dataset.scrambleInterval));
      }

      const interval = setInterval(() => {
        event.target.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");

        if (iterations >= originalText.length) {
          clearInterval(interval);
          event.target.innerText = originalText; // Ensure final text is correct
          delete element.dataset.scrambleInterval;
        }

        iterations += 1; // Faster: 1 character per 30ms
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
});
