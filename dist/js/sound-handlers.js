document.addEventListener("DOMContentLoaded", () => {
  // --- Sound Integration ---
  // // Initialize audio context immediately to allow early playback (e.g. hover)
  // // Browsers might still block 'resume' until interaction, but we try our best.
  // if (window.soundManager) {
  //   window.soundManager.init();
  // }

  // Create / resume audio context only after explicit user interaction
  // to comply with browser autoplay policies.
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
  // Exclude .see-more-link directly in the selector or filter it out
  const interactiveSelector = 'a:not(.see-more-link), button:not(.see-more-link), .nav-link, .hero-pill, .project-link';
  const interactiveElements = document.querySelectorAll(interactiveSelector);

  interactiveElements.forEach(el => {
    // Double check for safety
    if (el.classList.contains('see-more-link')) return;
    
    // Exclude skill chips
    if (el.classList.contains('project-tag') || el.closest('.tag-row')) return;
    
    // Exclude company headers (text scrambling)
    if (el.closest('.company-header')) return;

    el.addEventListener('mouseenter', () => {
      if (isScrolling) return; // Don't play sound if scrolling
      if (window.soundManager) window.soundManager.playHoverSound();
    });

    el.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playClickSound();
    });
  });
});
