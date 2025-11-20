document.addEventListener("DOMContentLoaded", () => {
  // --- Sound Integration ---

  // Initialize audio context immediately to allow early playback (e.g. hover)
  // Browsers might still block 'resume' until interaction, but we try our best.
  if (window.soundManager) {
    window.soundManager.init();
  }

  // Optional: Try to resume audio context on any user interaction
  const unlockAudio = () => {
    if (window.soundManager) {
        window.soundManager.resume().catch(e => console.log("Audio resume failed:", e));
    }
    ['click', 'keydown', 'touchstart', 'touchend'].forEach(event => 
        document.removeEventListener(event, unlockAudio)
    );
  };

  ['click', 'keydown', 'touchstart', 'touchend'].forEach(event => 
      document.addEventListener(event, unlockAudio)
  );

  // Scroll guard to prevent accidental hover sounds during scroll
  let isScrolling = false;
  let scrollTimeout;

  document.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 150);
  }, { passive: true });

  // Attach hover and click sounds to interactive elements
  const interactiveSelector = 'a, button, .nav-link, .hero-pill, .project-link, .see-more-link';
  const interactiveElements = document.querySelectorAll(interactiveSelector);

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (isScrolling) return; // Don't play sound if scrolling
      if (window.soundManager) window.soundManager.playHoverSound();
    });

    el.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playClickSound();
    });
  });
});
