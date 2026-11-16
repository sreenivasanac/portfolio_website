// Small page-wide behaviours, driven by data attributes.
document.addEventListener("click", async (event) => {
  // [data-copy="text"]: copy the text and confirm on the button itself.
  const copyBtn = event.target.closest("[data-copy]");
  if (copyBtn) {
    const text = copyBtn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      const label = copyBtn.textContent;
      copyBtn.textContent = "Copied";
      setTimeout(() => { copyBtn.textContent = label; }, 1600);
    } catch (err) {
      // Clipboard blocked (e.g. file://): let the visitor copy it by hand.
      window.prompt("Copy this:", text);
    }
  }

  // [data-expand="#section"]: open every <details> in the section, or close them all.
  const expandBtn = event.target.closest("[data-expand]");
  if (expandBtn) {
    const items = [...document.querySelectorAll(`${expandBtn.dataset.expand} details`)];
    const open = items.some((item) => !item.open);
    items.forEach((item) => { item.open = open; });
    expandBtn.textContent = open ? "Collapse all" : "Expand all";
  }
});
