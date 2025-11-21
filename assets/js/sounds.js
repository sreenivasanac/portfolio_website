class SoundManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.isMuted = false;
        this.initialized = false;
        this.lastTypingTime = 0;
        this.TYPING_THROTTLE_MS = 60; // Min 60ms between sounds
        this.activeTypingSource = null;
        this.typingSessionEndTime = 0;
        this.TYPING_COOLDOWN_MS = 3000; // 3 seconds cooldown after typing ends
        this.sessionTimeout = null;
    }

    init() {
        if (this.initialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.3; // Master volume
            this.masterGain.connect(this.context.destination);
            this.initialized = true;
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    // Ensure context is running (browsers suspend it until user interaction)
    async resume() {
        if (!this.context) this.init();
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }

    playHoverSound() {
        if (!this.initialized || this.isMuted) return;
        this.resume();

        const t = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        // Sci-fi blip: High frequency sine wave with quick envelope
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, t);
        osc.frequency.exponentialRampToValueAtTime(1500, t + 0.05);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.05);
    }

    playClickSound() {
        if (!this.initialized || this.isMuted) return;
        this.resume();

        const t = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        // Sci-fi confirm: Lower frequency, slightly longer
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.1);
    }

    playTypingSound() {
        if (!this.initialized || this.isMuted) return;
        // Don't resume on typing to avoid constant permission requests if not yet interacted
        if (this.context.state === 'suspended') return;

        const t = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        // Mechanical key click: very short square wave
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.03);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.03);
    }

    playScanSound() {
        if (!this.initialized || this.isMuted) return;
        this.resume();

        const audio = new Audio('assets/sounds/sci_fi_scanner_3.wav');
        audio.volume = this.masterGain.gain.value;
        audio.play().catch(e => console.error("Error playing scanning sound:", e));
    }

    playElectricTypingSound(sourceId) {
        if (!this.initialized || this.isMuted) return;

        const now = Date.now();

        // Logic for "One at a time" and "Cooldown"
        // If there is an active source, and it's not this one, reject.
        if (this.activeTypingSource && this.activeTypingSource !== sourceId) {
            return;
        }

        // If no active source, check cooldown
        if (!this.activeTypingSource) {
            if (now - this.typingSessionEndTime < this.TYPING_COOLDOWN_MS) {
                return; // In cooldown
            }
            // Start new session
            this.activeTypingSource = sourceId;
        }

        // Reset session timeout (auto-release lock if silence for 500ms)
        if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
        this.sessionTimeout = setTimeout(() => {
            this.activeTypingSource = null;
            this.typingSessionEndTime = Date.now();
        }, 500);

        // Prevent stacking within the same session: only play if enough time passed
        if (now - this.lastTypingTime < this.TYPING_THROTTLE_MS) return;
        
        this.lastTypingTime = now;

        // Use the existing sound file
        const audio = new Audio('assets/sounds/sci_fi_beep_electric.wav');
        audio.volume = 0.15; // Subtle volume
        audio.play().catch(() => {});
    }
}

// Export a singleton instance
window.soundManager = new SoundManager();
