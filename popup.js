class PopupTimer {
    constructor() {
        this.currentState = {
            timeLeft: 1500,
            duration: 1500,
            state: 'STOPPED',
            type: 'STUDY_SESSION',
            taskName: null
        };

        this.initElements();
        this.setupEventListeners();
        this.startStatePolling();
    }

    initElements() {
        // Timer display elements
        this.timeDisplay = document.getElementById('timeLeft');
        this.timerState = document.getElementById('timerState');
        this.timerType = document.getElementById('timerType');
        this.progressCircle = document.getElementById('progressCircle');

        // Button elements
        this.startPomodoroBtn = document.getElementById('startPomodoro');
        this.startBreakBtn = document.getElementById('startBreak');
        this.pauseBtn = document.getElementById('pause');
        this.resumeBtn = document.getElementById('resume');
        this.stopBtn = document.getElementById('stop');
        this.optionsBtn = document.getElementById('optionsBtn');

        // Set initial display states
        this.updateButtonVisibility();
    }

    setupEventListeners() {
        // ✅ Button click handlers - send messages to SPA
        this.startPomodoroBtn?.addEventListener('click', () => {
            this.sendTimerMessage('START_TIMER_FROM_POPUP', { type: 'STUDY_SESSION' });
        });

        this.startBreakBtn?.addEventListener('click', () => {
            this.sendTimerMessage('START_TIMER_FROM_POPUP', { type: 'BREAK' });
        });

        this.pauseBtn?.addEventListener('click', () => {
            this.sendTimerMessage('PAUSE_TIMER_FROM_POPUP');
        });

        this.resumeBtn?.addEventListener('click', () => {
            this.sendTimerMessage('START_TIMER_FROM_POPUP', { 
                type: this.currentState.type 
            });
        });

        this.stopBtn?.addEventListener('click', () => {
            this.sendTimerMessage('STOP_TIMER_FROM_POPUP');
        });

        this.optionsBtn?.addEventListener('click', () => {
            chrome.tabs.create({
                url: chrome.runtime.getURL('index.html'),
                active: true
            });
            window.close();
        });
    }

    // ✅ Start polling SPA for timer state every second
    startStatePolling() {
        this.requestTimerState(); // Initial request
        
        this.pollingInterval = setInterval(() => {
            this.requestTimerState();
        }, 1000);
    }

    // ✅ Request current timer state from SPA
    async requestTimerState() {
        try {
            const tabs = await chrome.tabs.query({ 
                url: chrome.runtime.getURL('index.html') 
            });
            
            if (tabs.length > 0) {
                // SPA is open - request state directly
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'REQUEST_TIMER_STATE'
                }, (response) => {
                    if (response?.success && response.data) {
                        this.updateState(response.data);
                    } else {
                        this.showSPANotRunning();
                    }
                });
            } else {
                this.showSPANotRunning();
            }
        } catch (error) {
            console.log('Error requesting timer state:', error);
            this.showSPANotRunning();
        }
    }

    // ✅ Send timer control messages to SPA
    async sendTimerMessage(messageType, data = null) {
        try {
            const tabs = await chrome.tabs.query({ 
                url: chrome.runtime.getURL('index.html') 
            });
            
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: messageType,
                    data: data
                }, (response) => {
                    if (response?.success) {
                        console.log(`${messageType} sent successfully`);
                    }
                });
            } else {
                // SPA not open - open it first
                this.openSPAAndSendMessage(messageType, data);
            }
        } catch (error) {
            console.log(`Error sending ${messageType}:`, error);
        }
    }

    // ✅ Open SPA and send message
    openSPAAndSendMessage(messageType, data) {
        chrome.tabs.create({
            url: chrome.runtime.getURL('index.html'),
            active: true
        }, (tab) => {
            // Wait for SPA to load, then send message
            setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, {
                    type: messageType,
                    data: data
                });
            }, 1500);
        });
        
        window.close();
    }

    // ✅ Update popup state from SPA response
    updateState(data) {
        this.currentState = { ...data };
        this.updateDisplay();
        this.updateButtonVisibility();
        this.updateProgressCircle();
    }

    // ✅ Update timer display
    updateDisplay() {
        // Update time display
        if (this.timeDisplay) {
            const minutes = Math.floor(this.currentState.timeLeft / 60);
            const seconds = this.currentState.timeLeft % 60;
            this.timeDisplay.textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // Update timer state
        if (this.timerState) {
            const stateMap = {
                'RUNNING': '🟢 Running',
                'PAUSED': '🟡 Paused',
                'STOPPED': '⚪ Ready'
            };
            this.timerState.textContent = stateMap[this.currentState.state] || 'Ready';
        }

        // Update timer type
        if (this.timerType) {
            this.timerType.textContent = 
                this.currentState.type === 'STUDY_SESSION' ? '🍅 Pomodoro' : '☕ Break';
        }
    }

    // ✅ Update button visibility based on Vue logic
    updateButtonVisibility() {
        const { state, type } = this.currentState;

        // Start Pomodoro - show when STOPPED
        if (this.startPomodoroBtn) {
            this.startPomodoroBtn.style.display = 
                state === 'STOPPED' ? 'block' : 'none';
        }

        // Start Break - show when RUNNING and is STUDY_SESSION
        if (this.startBreakBtn) {
            this.startBreakBtn.style.display = 
                (state === 'RUNNING' && type === 'STUDY_SESSION') ? 'block' : 'none';
        }

        // Pause - show when RUNNING
        if (this.pauseBtn) {
            this.pauseBtn.style.display = 
                state === 'RUNNING' ? 'block' : 'none';
        }

        // Resume - show when PAUSED
        if (this.resumeBtn) {
            this.resumeBtn.style.display = 
                state === 'PAUSED' ? 'block' : 'none';
        }

        // Stop - show when NOT STOPPED
        if (this.stopBtn) {
            this.stopBtn.style.display = 
                state !== 'STOPPED' ? 'block' : 'none';
        }
    }

    // ✅ Update circular progress
    updateProgressCircle() {
        if (this.progressCircle) {
            const { timeLeft, duration } = this.currentState;
            const progress = ((duration - timeLeft) / duration) * 100;
            const circumference = 2 * Math.PI * 52; // r=52
            const strokeDashoffset = circumference - (progress / 100) * circumference;
            
            this.progressCircle.style.strokeDasharray = circumference;
            this.progressCircle.style.strokeDashoffset = strokeDashoffset;
            
            // Change color based on timer type
            const color = this.currentState.type === 'STUDY_SESSION' ? '#ef4444' : '#10b981';
            this.progressCircle.style.stroke = color;
        }
    }

    showSPANotRunning() {
        if (this.timerState) {
            this.timerState.textContent = '⚠️ Open full app to start timer';
        }
        if (this.timeDisplay) {
            this.timeDisplay.textContent = '25:00';
        }
        if (this.timerType) {
            this.timerType.textContent = '🍅 Pomodoro';
        }

        // Show only start pomodoro button when SPA not running
        if (this.startPomodoroBtn) {
            this.startPomodoroBtn.style.display = 'block';
            this.startPomodoroBtn.textContent = '🚀 Open App & Start';
        }
        
        ['startBreakBtn', 'pauseBtn', 'resumeBtn', 'stopBtn'].forEach(btnName => {
            if (this[btnName]) this[btnName].style.display = 'none';
        });
    }

    destroy() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}

let popupTimer;
document.addEventListener('DOMContentLoaded', () => {
    popupTimer = new PopupTimer();
});

window.addEventListener('beforeunload', () => {
    popupTimer?.destroy();
});

