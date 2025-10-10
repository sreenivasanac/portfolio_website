document.addEventListener("DOMContentLoaded", () => {
  const topNav = document.querySelector(".top-nav");
  const navPath = document.querySelector(".nav-path");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const basePath = navPath?.dataset.base ?? "";

  const sections = navLinks
    .map((link) => {
      const id = link.dataset.section;
      const element = id ? document.getElementById(id) : null;
      return element ? { id, element } : null;
    })
    .filter(Boolean);

  if (!topNav || navLinks.length === 0 || sections.length === 0) {
    return;
  }

  let lastScrollY = window.scrollY;
  let navHidden = false;
  let rafId = null;

  const updatePath = (activeId) => {
    if (!navPath) {
      return;
    }
    const locationEl = navPath.querySelector(".nav-location");
    if (!locationEl) {
      return;
    }

    const suffix = activeId && activeId !== sections[0].id ? `/${activeId}` : "";
    locationEl.textContent = `~/${basePath}${suffix}`;
    navPath.classList.toggle("path-active", suffix.length > 0);
  };

  const setActiveLink = (targetId) => {
    navLinks.forEach((link) => {
      const isActive = link.dataset.section === targetId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    updatePath(targetId);
  };

  const updateOnScroll = () => {
    const currentScrollY = window.scrollY;
    const hideThreshold = topNav.offsetHeight * 2;

    if (currentScrollY > hideThreshold && currentScrollY > lastScrollY + 4) {
      if (!navHidden) {
        topNav.classList.add("nav-hidden");
        navHidden = true;
      }
    } else if (navHidden) {
      topNav.classList.remove("nav-hidden");
      navHidden = false;
    }

    lastScrollY = currentScrollY;

    let currentSectionId = sections[0].id;
    const anchorLine = window.innerHeight * 0.35;

    for (const { id, element } of sections) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= anchorLine && rect.bottom >= anchorLine * 0.5) {
        currentSectionId = id;
      }
    }

    const nearBottom =
      window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 40;
    if (nearBottom) {
      currentSectionId = sections[sections.length - 1].id;
    }

    setActiveLink(currentSectionId);
  };

  const requestScrollUpdate = () => {
    if (rafId !== null) {
      return;
    }
    rafId = window.requestAnimationFrame(() => {
      updateOnScroll();
      rafId = null;
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.dataset.section;
      if (!targetId) {
        return;
      }
      const target = sections.find((section) => section.id === targetId);
      if (!target) {
        return;
      }

      const navOffset = topNav.offsetHeight + 24;
      const targetTop = target.element.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth",
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", `#${targetId}`);
      }

      setActiveLink(targetId);
    });
  });

  document.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);

  const initialHash = window.location.hash.slice(1);
  if (initialHash) {
    const initialSection = sections.find((section) => section.id === initialHash);
    if (initialSection) {
      setActiveLink(initialSection.id);
    } else {
      setActiveLink(sections[0].id);
    }
  } else {
    setActiveLink(sections[0].id);
  }

  updateOnScroll();
});
