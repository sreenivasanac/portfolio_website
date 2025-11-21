/**
 * Settings Manager
 * Handles global state for Sound and Animation toggles.
 * Persists preferences to localStorage.
 */

const SettingsManager = {
    state: {
        soundEnabled: true,
        animationEnabled: true
    },

    init() {
        // Load from localStorage or default to true
        const storedSound = localStorage.getItem('soundEnabled');
        const storedAnim = localStorage.getItem('animationEnabled');

        this.state.soundEnabled = storedSound === null ? true : storedSound === 'true';
        this.state.animationEnabled = storedAnim === null ? true : storedAnim === 'true';

        // Apply state immediately to catch early animations
        this.applyState();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.renderUI();
                this.setupEventListeners();
            });
        } else {
            this.renderUI();
            this.setupEventListeners();
        }
    },

    setupEventListeners() {
        // Keyboard Shortcut: Shift + M to toggle ALL
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key.toLowerCase() === 'm') {
                this.toggleAll();
            }
        });

        // Button Listeners (delegated or attached after render)
        const soundBtn = document.getElementById('sys-btn-sound');
        const animBtn = document.getElementById('sys-btn-anim');

        if (soundBtn) soundBtn.addEventListener('click', () => this.toggleSound());
        if (animBtn) animBtn.addEventListener('click', () => this.toggleAnimation());
    },

    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        this.saveState();
        this.applyState();
    },

    toggleAnimation() {
        this.state.animationEnabled = !this.state.animationEnabled;
        this.saveState();
        this.applyState();
    },

    toggleAll() {
        // If either is on, turn both off. If both are off, turn both on.
        const anyOn = this.state.soundEnabled || this.state.animationEnabled;
        
        if (anyOn) {
            this.state.soundEnabled = false;
            this.state.animationEnabled = false;
        } else {
            this.state.soundEnabled = true;
            this.state.animationEnabled = true;
        }
        this.saveState();
        this.applyState();
    },

    saveState() {
        localStorage.setItem('soundEnabled', this.state.soundEnabled);
        localStorage.setItem('animationEnabled', this.state.animationEnabled);
    },

    applyState() {
        // Apply Sound State
        if (window.soundManager) {
            window.soundManager.isMuted = !this.state.soundEnabled;
        }

        // Apply Animation State
        const body = document.body;
        if (this.state.animationEnabled) {
            body.classList.remove('disable-animation');
        } else {
            body.classList.add('disable-animation');
        }

        // Trigger custom event for JS modules that need to react
        window.dispatchEvent(new CustomEvent('settingsChanged', { detail: this.state }));

        this.updateUI();
    },

    renderUI() {
        // Check if already exists
        if (document.getElementById('system-tray')) return;

        const tray = document.createElement('div');
        tray.id = 'system-tray';
        tray.className = 'system-tray';
        tray.innerHTML = `
            <div class="sys-btn-wrapper">
                <div class="sys-tooltip">Toggle Sound</div>
                <button id="sys-btn-sound" class="sys-btn" aria-label="Toggle Sound">
                    <span class="icon-on">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                    </span>
                    <span class="icon-off">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                    </span>
                </button>
            </div>
            <div class="sys-btn-wrapper">
                <div class="sys-tooltip">Toggle Animations</div>
                <button id="sys-btn-anim" class="sys-btn" aria-label="Toggle Animation">
                    <span class="icon-on">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </span>
                    <span class="icon-off">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                    </span>
                </button>
            </div>
            <div id="settings-notification" class="settings-notification">
                <strong> Sound 🔇 &  Animation ✨ has been Disabled 🟥</strong>
                Re-enable Sound & Animation using the buttons below 👇 or press <kbd>Shift + M</kbd>
            </div>
        `;
        document.body.appendChild(tray);
        this.updateUI(); // Ensure UI reflects current state immediately after creation
        this.scheduleNotification();
    },

    scheduleNotification() {
        if (this.notificationScheduled) return;
        this.notificationScheduled = true;

        setTimeout(() => {
            // Auto-disable animations and sounds after 22 seconds
            if (this.state.animationEnabled || this.state.soundEnabled) {
                this.state.soundEnabled = false;
                this.state.animationEnabled = false;
                this.saveState();
                this.applyState();
                this.showNotification();
            }
        }, 22000);
    },

    showNotification() {
        const notification = document.getElementById('settings-notification');
        if (!notification) return;

        notification.classList.add('show');
        
        // Disappear after 13 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 13000);
    },

    updateUI() {
        const soundBtn = document.getElementById('sys-btn-sound');
        const animBtn = document.getElementById('sys-btn-anim');

        if (soundBtn) {
            soundBtn.classList.toggle('active', this.state.soundEnabled);
            soundBtn.classList.toggle('muted', !this.state.soundEnabled);
        }
        if (animBtn) {
            animBtn.classList.toggle('active', this.state.animationEnabled);
            animBtn.classList.toggle('disabled', !this.state.animationEnabled);
        }
    }
};

// Initialize immediately to ensure state is ready for other scripts
SettingsManager.init();

window.SettingsManager = SettingsManager;
