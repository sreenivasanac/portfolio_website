/**
 * Lightweight Particle Network Animation
 * Draws particles connected by lines, reacting to mouse movement.
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-2'; // Behind everything, even the background gradient
canvas.style.pointerEvents = 'none';

let particles = [];
const particleCount = 60; // Number of particles
const connectionDistance = 150;
const mouseDistance = 200;

let animationFrameId;
let isAnimating = true;

let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', resizeCanvas);

// Handle visibility change (tab switch)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAnimation();
    } else {
        startAnimation();
    }
});

// Handle settings change
window.addEventListener('settingsChanged', (e) => {
    if (e.detail.animationEnabled) {
        canvas.style.display = 'block';
        startAnimation();
    } else {
        stopAnimation();
        canvas.style.display = 'none';
    }
});

function checkInitialState() {
     if (window.SettingsManager && !window.SettingsManager.state.animationEnabled) {
        canvas.style.display = 'none';
        isAnimating = false;
     }
     // Check reduced motion
     const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
     if (motionPreference.matches) {
        isAnimating = false;
     }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseVx = (Math.random() - 0.5) * 0.1; // Reduced speed (20% of 0.5)
        this.baseVy = (Math.random() - 0.5) * 0.1;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.size = Math.random() * 2 + 1;
        this.color = 'rgba(0, 243, 255, 0.5)'; // Cyan
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
            this.baseVx *= -1;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
            this.baseVy *= -1;
        }

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;
                const directionX = forceDirectionX * force * 0.1; // Reduced force to match lower speed
                const directionY = forceDirectionY * force * 0.1;

                this.vx -= directionX;
                this.vy -= directionY;
            }
        }

        // Friction: Return to base speed
        this.vx += (this.baseVx - this.vx) * 0.1;
        this.vy += (this.baseVy - this.vy) * 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (!isAnimating) {
        if (window.SettingsManager && !window.SettingsManager.state.animationEnabled) return;
        isAnimating = true;
        animate();
    }
}

function stopAnimation() {
    isAnimating = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

// Initialize
resizeCanvas();
checkInitialState();
if (isAnimating) {
    animate();
}
