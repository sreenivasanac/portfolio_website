document.addEventListener("DOMContentLoaded", () => {
  // Modal functionality
  const modalContainer = document.getElementById("modal-container");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.querySelector(".modal-close");
  const seeMoreButtons = document.querySelectorAll(".see-more-link");

  // Show modal function
  function showModal(company) {
    // Ensure companyDetails is available
    if (typeof companyDetails === 'undefined') {
      console.error("companyDetails data not loaded");
      return;
    }

    const details = companyDetails[company];
    if (details) {
      modalBody.innerHTML = `<h2>${details.title}</h2>${details.content}`;
      modalContainer.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  // Hide modal function
  function hideModal() {
    modalContainer.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Add event listeners to see more links
  seeMoreButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const company = button.dataset.modal;
      showModal(company);
    });
  });

  // Close modal on close button click
  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  // Close modal on background click
  if (modalContainer) {
    modalContainer.addEventListener("click", (e) => {
      if (e.target === modalContainer) {
        hideModal();
      }
    });
  }

  // Close modal on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalContainer && modalContainer.classList.contains("active")) {
      hideModal();
    }
  });
});
