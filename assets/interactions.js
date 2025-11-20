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
});
