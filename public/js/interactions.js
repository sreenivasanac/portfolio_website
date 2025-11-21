document.addEventListener("DOMContentLoaded", () => {
  // Email copy functionality
  const emailCopyBtn = document.getElementById("email-copy-btn");
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener("click", async () => {
      const email = emailCopyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);

        // Update button text temporarily
        const textSpan = emailCopyBtn.querySelector("span:nth-child(2)");
        const originalText = textSpan.textContent;
        textSpan.textContent = "Copied!";
        emailCopyBtn.style.backgroundColor = "rgba(16, 185, 129, 0.1)";

        // Reset after 2 seconds
        setTimeout(() => {
          textSpan.textContent = originalText;
          emailCopyBtn.style.backgroundColor = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy email:", err);
        // Fallback: show email in alert
        alert(`Email: ${email}`);
      }
    });
  }

  // Sound Effects Integration
  if (window.soundManager) {
    // Project Cards - Hover Scan Sound
    document.querySelectorAll('.project-card').forEach(card => {
      let hoverTimer;
      
      card.addEventListener('mouseenter', () => {
        if (!window.soundManager.isMuted) {
          // Clear any existing timer
          clearTimeout(hoverTimer);
          // Set timer for 3 second delay
          hoverTimer = setTimeout(() => {
             window.soundManager.playScanSound();
          }, 3000);
        }
      });

      card.addEventListener('mouseleave', () => {
        // Cancel sound if mouse leaves before 3 second
        clearTimeout(hoverTimer);
      });
    });

    // Skill Chips - Quick Blip (DISABLED)
    // document.querySelectorAll('.project-tag, .tag-row span').forEach(tag => {
    //   tag.addEventListener('mouseenter', () => {
    //     if (!window.soundManager.isMuted) {
    //        window.soundManager.playHoverSound();
    //     }
    //   });
    // });
    
    // Navigation Links
    document.querySelectorAll('a, button').forEach(el => {
      // Skip if it's a "See more..." link
      if (el.classList.contains('see-more-link')) return;
      
      // Skip if it's a skill chip (project-tag or tag-row span) which might be an anchor or button
      if (el.classList.contains('project-tag') || el.closest('.tag-row')) return;
      
      // Skip if inside company header (text scrambling area)
      if (el.closest('.company-header')) return;

      el.addEventListener('mouseenter', () => window.soundManager.playHoverSound());
      el.addEventListener('click', () => window.soundManager.playClickSound());
    });
  }
});
