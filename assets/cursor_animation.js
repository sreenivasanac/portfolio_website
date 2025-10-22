// Cursor animation module
const CursorAnimation = {
  isEnabled: true,
  lastTime: 0,
  throttleDelay: 50, // Throttle to 20 FPS for performance
  particlePool: [],
  maxParticles: 30,

  init() {
    // Check for reduced motion preference
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) {
      this.isEnabled = false;
      return;
    }

    // Listen for motion preference changes
    motionPreference.addEventListener("change", (e) => {
      this.isEnabled = !e.matches;
    });

    // Add mouse move listener with throttling
    document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
  },

  handleMouseMove(event) {
    if (!this.isEnabled) return;

    const currentTime = Date.now();
    if (currentTime - this.lastTime < this.throttleDelay) return;
    
    this.lastTime = currentTime;
    this.createSpark(event);
  },

  createSpark(event) {
    // Limit number of particles for performance
    if (document.querySelectorAll(".cursor-spark").length >= this.maxParticles) {
      return;
    }

    const spark = document.createElement("div");
    spark.className = "cursor-spark";
    
    // Set position
    spark.style.left = event.pageX + "px";
    spark.style.top = event.pageY + "px";

    // Random scale and color variation
    const scale = Math.random() * 1.5 + 0.5;
    spark.style.transform = `scale(${scale})`;
    
    // Add slight color variation
    const hue = Math.random() * 30 - 15; // -15 to +15 degrees
    spark.style.filter = `hue-rotate(${hue}deg)`;

    // Set random transition values
    spark.style.setProperty("--x", this.getRandomTransitionValue());
    spark.style.setProperty("--y", this.getRandomTransitionValue());
    
    document.body.appendChild(spark);

    // Remove the element after animation completes
    setTimeout(() => {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    }, 2000);
  },

  getRandomTransitionValue() {
    // Generate a random value between -100 and 100 pixels (reduced for subtlety)
    return `${Math.random() * 200 - 100}px`;
  }
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => CursorAnimation.init());
} else {
  CursorAnimation.init();
}
