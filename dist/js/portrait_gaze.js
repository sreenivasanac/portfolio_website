const P_MIN = -15;
const P_MAX = 15;
const STEP = 3;
const SIZE = 160;
const FALLBACK_SRC = "assets/gaze_images/gaze_px0p0_py0p0_160.webp";
const IDLE_TIMEOUT_MS = 1100;
const TRACKING_DURATION_MS = 6000;
const COOLDOWN_DURATION_MS = 20000;

const TrackingState = {
  READY: 'ready',
  TRACKING: 'tracking',
  COOLDOWN: 'cooldown'
};

const formatCoord = (value) => value.toFixed(1).replace("-", "m").replace(".", "p");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const quantizeToGrid = (normalized) => {
  const projected = P_MIN + ((normalized + 1) * (P_MAX - P_MIN)) / 2;
  const snapped = Math.round(projected / STEP) * STEP;
  return clamp(snapped, P_MIN, P_MAX);
};

const gridToFilename = (px, py) =>
  `gaze_px${formatCoord(px)}_py${formatCoord(py)}_${SIZE}.webp`;

const buildImagePath = (basePath, filename) =>
  `${basePath.endsWith("/") ? basePath : `${basePath}/`}${filename}`;

const resolveBasePath = (image, basePath) =>
  basePath || image?.dataset.gazeBase || "assets/images/gaze_images/";

const resolveDefaultSrc = (image) =>
  image?.dataset.gazeDefault ||
  image?.getAttribute("data-gaze-default") ||
  image?.getAttribute("src") ||
  FALLBACK_SRC;

const buildGridSources = (basePath) => {
  const sources = [];
  for (let px = P_MIN; px <= P_MAX; px += STEP) {
    for (let py = P_MIN; py <= P_MAX; py += STEP) {
      sources.push(buildImagePath(basePath, gridToFilename(px, py)));
    }
  }
  return sources;
};

const getNormalizedCoordinates = (clientX, clientY, rect) => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const nx = clamp((clientX - centerX) / (rect.width / 2 || 1), -1, 1);
  const ny = clamp((centerY - clientY) / (rect.height / 2 || 1), -1, 1);
  return { nx, ny };
};

const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

const preloadImageAsync = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });

const preloadGazeImages = (basePath, defaultSrc) => {
  const sources = new Set([defaultSrc, ...buildGridSources(basePath)]);
  return Promise.allSettled(Array.from(sources, preloadImageAsync));
};

function initGazeTracking({ container, image, basePath }) {
  if (!container || !image) {
    return;
  }

  let rafId = null;
  let pendingPoint = null;
  let lastImageSrc = "";
  let isActive = true;
  let idleTimeoutId = null;
  let trackingState = TrackingState.READY;
  let trackingTimerId = null;
  let cooldownTimerId = null;
  const activeBasePath = resolveBasePath(image, basePath);
  const defaultSrc = resolveDefaultSrc(image);

  const clearIdleTimer = () => {
    if (idleTimeoutId !== null) {
      window.clearTimeout(idleTimeoutId);
      idleTimeoutId = null;
    }
  };

  const clearTrackingTimers = () => {
    if (trackingTimerId !== null) {
      window.clearTimeout(trackingTimerId);
      trackingTimerId = null;
    }
    if (cooldownTimerId !== null) {
      window.clearTimeout(cooldownTimerId);
      cooldownTimerId = null;
    }
  };

  const startCooldown = () => {
    trackingState = TrackingState.COOLDOWN;
    resetToDefault();
    clearTrackingTimers();
    cooldownTimerId = window.setTimeout(() => {
      cooldownTimerId = null;
      trackingState = TrackingState.READY;
    }, COOLDOWN_DURATION_MS);
  };

  const startTracking = () => {
    if (trackingState !== TrackingState.READY) {
      return;
    }
    trackingState = TrackingState.TRACKING;
    clearTrackingTimers();
    trackingTimerId = window.setTimeout(() => {
      trackingTimerId = null;
      startCooldown();
    }, TRACKING_DURATION_MS);
  };

  const resetToDefault = () => {
    pendingPoint = null;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (lastImageSrc !== defaultSrc) {
      lastImageSrc = defaultSrc;
      image.src = defaultSrc;
    }
  };

  const resetIdleTimer = () => {
    if (!isActive) {
      clearIdleTimer();
      return;
    }
    clearIdleTimer();
    idleTimeoutId = window.setTimeout(() => {
      idleTimeoutId = null;
      resetToDefault();
    }, IDLE_TIMEOUT_MS);
  };

  const updateImageForPoint = (point) => {
    const rect = container.getBoundingClientRect();
    const { nx, ny } = getNormalizedCoordinates(point.x, point.y, rect);
    const px = quantizeToGrid(nx);
    const py = quantizeToGrid(ny);
    const filename = gridToFilename(px, py);
    const nextSrc = buildImagePath(activeBasePath, filename);
    if (nextSrc !== lastImageSrc) {
      lastImageSrc = nextSrc;
      image.src = nextSrc;
    }
  };

  const processPendingPoint = () => {
    if (pendingPoint) {
      updateImageForPoint(pendingPoint);
      pendingPoint = null;
    }
    rafId = null;
  };

  const scheduleUpdate = (clientX, clientY) => {
    if (window.SettingsManager && !window.SettingsManager.state.animationEnabled) {
        return;
    }
    if (!isActive) {
      return;
    }
    if (trackingState === TrackingState.COOLDOWN) {
      return;
    }
    if (trackingState === TrackingState.READY) {
      startTracking();
    }
    pendingPoint = { x: clientX, y: clientY };
    if (rafId === null) {
      rafId = window.requestAnimationFrame(processPendingPoint);
    }
  };


  const handlePointerMove = (event) => {
    resetIdleTimer();
    scheduleUpdate(event.clientX, event.clientY);
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 0) {
      return;
    }
    const touch = event.touches[0];
    resetIdleTimer();
    scheduleUpdate(touch.clientX, touch.clientY);
  };

  const handleWindowMouseOut = (event) => {
    if (!event.relatedTarget) {
      resetToCenter();
      resetIdleTimer();
    }
  };

  const resetToCenter = () => {
    const rect = container.getBoundingClientRect();
    scheduleUpdate(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const handleVisibilityChange = (entries) => {
    entries.forEach((entry) => {
      isActive = entry.isIntersecting;
      if (isActive) {
        resetToCenter();
        resetIdleTimer();
      } else {
        clearIdleTimer();
        clearTrackingTimers();
        trackingState = TrackingState.READY;
        resetToDefault();
      }
    });
  };

  const observer = new IntersectionObserver(handleVisibilityChange, {
    root: null,
    threshold: 0.1,
  });

  const onImageError = () => {
    if (image.src === FALLBACK_SRC) {
      return;
    }
    image.src = FALLBACK_SRC;
  };

  image.addEventListener("error", onImageError, { once: true });
  window.addEventListener("mousemove", handlePointerMove);
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  window.addEventListener("mouseout", handleWindowMouseOut);
  observer.observe(container);
  
  window.addEventListener('settingsChanged', (e) => {
    if (!e.detail.animationEnabled) {
        clearTrackingTimers();
        trackingState = TrackingState.READY;
        resetToDefault();
    } else {
        resetToCenter();
    }
  });

  const centerFilename = gridToFilename(0, 0);
  preloadImage(buildImagePath(activeBasePath, centerFilename));
  resetToCenter();
  resetIdleTimer();

  return () => {
    image.removeEventListener("error", onImageError);
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("mouseout", handleWindowMouseOut);
    observer.disconnect();
    clearIdleTimer();
    clearTrackingTimers();
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

const bootstrap = () => {
  const container = document.querySelector(".avatar");
  const image = document.querySelector("#portrait-gaze-img");
  if (!container || !image) {
    return;
  }
  const activeBasePath = resolveBasePath(image);
  const defaultSrc = resolveDefaultSrc(image);
  preloadGazeImages(activeBasePath, defaultSrc).finally(() => {
    initGazeTracking({ container, image, basePath: activeBasePath });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}


