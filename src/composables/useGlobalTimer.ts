import {ref, computed, readonly} from 'vue';
import type {Task} from './useTasks';
import {useTasks} from './useTasks';

export enum TimerState {
    RUNNING,
    PAUSED,
    STOPPED,
}


export interface TimerConfig {
    duration: number; // Store actual duration, not function
    canBindTask: boolean;
    onComplete: () => void;
    onTick?: (taskWorkingOn: Task | null, updateTimeWorkedOn: Function | null) => void;
    getLabel: () => string;
}

export type TimerTypeName = 'STUDY_SESSION' | 'BREAK';

interface TimerContext {
    type: TimerTypeName;
    state: TimerState;
    duration: number; // in seconds
    timeLeft: number; // in seconds
}

let currentTimerContext = ref<TimerContext>({
    type: 'STUDY_SESSION',
    state: TimerState.STOPPED,
    duration: 1500, // Default 25 minutes
    timeLeft: 1500,
});

const taskWorkingOn = ref<Task | null>(null);
let globalUpdateTimeWorkedOn: Function | null = null;
let globalIntervalId: number | null = null;
const timerConfigs = ref<Record<TimerTypeName, TimerConfig> | null>(null);

// ✅ Explicit initialization function
export const initializeTimer = (pomodoroMinutes: number, breakMinutes: number, soundCallbacks: any) => {
    console.log('🚀 Initializing timer with:', {pomodoroMinutes, breakMinutes});
    
    // ✅ Create timer configs with actual values, not functions
    timerConfigs.value = {
        STUDY_SESSION: {
            duration: pomodoroMinutes * 60,
            canBindTask: true,
            onComplete: soundCallbacks.playPomodoroCompletionSound,
            onTick: (taskWorkingOn, updateTimeWorkedOn) => {
                if (taskWorkingOn && updateTimeWorkedOn) {
                    updateTimeWorkedOn(taskWorkingOn, 1);
                }
            },
            getLabel: () => 'Pomodoro'
        },
        BREAK: {
            duration: breakMinutes * 60,
            canBindTask: false,
            onComplete: soundCallbacks.playBreakCompletionSound,
            getLabel: () => 'Break'
        }
    };
    
    currentTimerContext.value = {
        type: 'STUDY_SESSION',
        state: TimerState.STOPPED,
        duration: timerConfigs.value.STUDY_SESSION.duration,
        timeLeft: timerConfigs.value.STUDY_SESSION.duration,
    };
    
    console.log('✅ Timer configs initialized:', timerConfigs);
    console.log('✅ Timer context initialized:', currentTimerContext.value);
    
    return timerConfigs;
};


const getTimerConfig = (type: TimerTypeName) => {
    if (!timerConfigs.value) {
        console.error('❌ Timer not initialized! Call initializeTimer() first');
        return null;
    }
    return timerConfigs.value[type];
};

const createTimerContext = (type: TimerTypeName, timerState: TimerState = TimerState.STOPPED): TimerContext => {
    const config = getTimerConfig(type);
    
    if (!config) {
        throw new Error(`Timer config not found for ${type}. Did you call initializeTimer()?`);
    }
    
    const context = {
        type,
        state: timerState,
        duration: config.duration,
        timeLeft: config.duration
    };
    
    console.log(`✅ Created ${type} context:`, context);
    return context;
};

const clearGlobalInterval = () => {
    if (globalIntervalId) {
        console.log('🛑 Clearing existing interval:', globalIntervalId);
        clearInterval(globalIntervalId);
        globalIntervalId = null;
        broadcastTimerState();
    }
};

const startTimer = (type: TimerTypeName = 'STUDY_SESSION') => {
    clearGlobalInterval();

    console.log(`🎬 Starting ${type} timer`);
    
    const config = getTimerConfig(type);
    if (!config) {
        console.error(`❌ Cannot start timer: config not found for ${type}`);
        return;
    }
    
    if (currentTimerContext.value.type !== type) {
        console.log(`🔄 Transitioning to ${type}`);
        currentTimerContext.value = createTimerContext(type);
    }
    
    console.log(`📊 Starting with context:`, currentTimerContext.value);
    
    currentTimerContext.value.state = TimerState.RUNNING;
    
    broadcastTimerState();
    
    globalIntervalId = setInterval(() => {
        if (currentTimerContext.value.timeLeft > 0) {
            currentTimerContext.value.timeLeft -= 1;
            config.onTick?.(taskWorkingOn.value, globalUpdateTimeWorkedOn);
            broadcastTimerState();
        } else {
            handleTimerCompletion();
        }
    }, 1000);
};

const handleTimerCompletion = () => {
    const config = getTimerConfig(currentTimerContext.value.type);
    if (!config) return;
    
    config.onComplete();
    
    // Auto-transition
    const nextType = currentTimerContext.value.type === 'STUDY_SESSION' ? 'BREAK' : 'STUDY_SESSION';
    currentTimerContext.value = createTimerContext(nextType, TimerState.RUNNING);
    broadcastTimerState();
    
};

const broadcastTimerState = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        try {
            const timerData = {
                timeLeft: currentTimerContext.value.timeLeft,
                duration: currentTimerContext.value.duration,
                state: TimerState[currentTimerContext.value.state],
                type: currentTimerContext.value.type,
                taskName: taskWorkingOn.value?.name || null
            };

            chrome.runtime.sendMessage({
                type: 'TIMER_STATE_UPDATE',
                data: timerData
            }).catch(() => {
                console.log('Extension not available');
            });
        } catch (error) {
            console.log('Chrome runtime error:', error);
        }
    }
}

export const setupExtensionSync = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
            console.log('SPA received message:', message);
            
            switch (message.type) {
                case 'REQUEST_TIMER_STATE':
                    // Send current state to popup
                    const currentState = {
                        timeLeft: currentTimerContext.value.timeLeft,
                        duration: currentTimerContext.value.duration,
                        state: TimerState[currentTimerContext.value.state],
                        type: currentTimerContext.value.type,
                        taskName: taskWorkingOn.value?.name || null
                    };
                    
                    sendResponse({ success: true, data: currentState });
                    break;
                    
                case 'START_TIMER_FROM_POPUP':
                    startTimer(message.data?.type || 'STUDY_SESSION');
                    sendResponse({ success: true });
                    break;
                    
                case 'PAUSE_TIMER_FROM_POPUP':
                    const timer = useGlobalTimer();
                    timer.pauseTimer();
                    sendResponse({ success: true });
                    break;
                    
                case 'STOP_TIMER_FROM_POPUP':
                    const timerInstance = useGlobalTimer();
                    timerInstance.stopTimer();
                    sendResponse({ success: true });
                    break;
            }
            
            return true; // Keep message channel open
        });
    }
};

export const listenForExtensionUpdates = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === 'SYNC_FROM_POPUP') {
                // Update SPA when popup changes timer
                syncTimerFromExtension(message.data);
            }
        });
    }
};

const syncTimerFromExtension = (extensionData: any) => {
    if (extensionData.state === 'RUNNING' && currentTimerContext.value.state !== TimerState.RUNNING) {
        startTimer(extensionData.type);
    } else if (extensionData.state === 'PAUSED' && currentTimerContext.value.state !== TimerState.PAUSED) {
        const timer = useGlobalTimer();
        timer.pauseTimer();
    } else if (extensionData.state === 'STOPPED' && currentTimerContext.value.state !== TimerState.STOPPED) {
        const timer = useGlobalTimer();
        timer.stopTimer();
    }
    
    // Sync time if different
    if (extensionData.timeLeft !== currentTimerContext.value.timeLeft) {
        currentTimerContext.value.timeLeft = extensionData.timeLeft;
    }
};

export const useGlobalTimer = () => {
    if (!globalUpdateTimeWorkedOn) {
        globalUpdateTimeWorkedOn = useTasks().updateTimeWorkedOn;
    }

    const timeLeft = computed(() => currentTimerContext.value.timeLeft);
    const timerState = computed(() => currentTimerContext.value.state);
    const timerType = computed(() => currentTimerContext.value.type);
    const duration = computed(() => currentTimerContext.value.duration);
    
    const currentConfig = computed(() => getTimerConfig(timerType.value));
    const canBindTask = computed(() => currentConfig.value?.canBindTask ?? false);
    const timerLabel = computed(() => currentConfig.value?.getLabel() ?? timerType.value);
    
    const minutes = computed(() => Math.floor(timeLeft.value / 60));
    const seconds = computed(() => Math.round(timeLeft.value % 60));
    
    const isStudySession = computed(() => timerType.value === 'STUDY_SESSION');
    const isBreak = computed(() => timerType.value === 'BREAK'); 
    
    const bindTask = (task: Task) => {
        const config = getTimerConfig(currentTimerContext.value.type);
        
        if (!config) {
            console.error(`❌ Cannot bind task: config not found`);
            return;
        }
        
        if (config.canBindTask) {
            taskWorkingOn.value = task;
            console.log(`Task ${task.name} bound to ${config.getLabel()}`);
        } else {
            console.warn(`Cannot bind task to ${config.getLabel()} - not supported`);
            throw new Error(`Task binding not available for ${config.getLabel()}`);
        }
    };

    const unbindTask = () => {
        const config = getTimerConfig(currentTimerContext.value.type);
        if (config?.canBindTask && taskWorkingOn.value) {
            taskWorkingOn.value = null;
            console.log(`Task unbound from ${config.getLabel()}`);
        }
    };

    const pauseTimer = () => {
        const config = getTimerConfig(currentTimerContext.value.type);
        if (!config) {
            console.error(`❌ Cannot pause timer: config not found`);
            return;
        }
        
        console.log(`🟡 ${config.getLabel()} paused`);
        
        if (globalIntervalId) {
            clearInterval(globalIntervalId);
            globalIntervalId = null;
        }
        
        currentTimerContext.value.state = TimerState.PAUSED;
        broadcastTimerState();
    };

    const resumeTimer = () => {
        if (currentTimerContext.value.state === TimerState.PAUSED) {
            startTimer(currentTimerContext.value.type);
        }
    };

    const stopTimer = () => {
        const config = getTimerConfig(currentTimerContext.value.type);
        if (config) {
            console.log(`🔴 ${config.getLabel()} stopped`);
        }
        
        if (globalIntervalId) {
            clearInterval(globalIntervalId);
            globalIntervalId = null;
        }
        
        currentTimerContext.value.state = TimerState.STOPPED;
        currentTimerContext.value.timeLeft = currentTimerContext.value.duration;
        
        if (config?.canBindTask) {
            taskWorkingOn.value = null;
        }

        broadcastTimerState();
    };

    return {
        // State
        timeLeft: readonly(timeLeft),
        duration: readonly(duration),                    
        taskWorkingOn: readonly(taskWorkingOn),          
        timerState: readonly(timerState),
        timerType: readonly(timerType),
        canBindTask: readonly(canBindTask),              
        timerLabel: readonly(timerLabel),
        
        // Computed
        minutes,
        seconds,
        isStudySession,
        isBreak,                                         
        
        // Actions
        startTimer,
        startPomodoro: () => startTimer('STUDY_SESSION'),
        startBreak: () => startTimer('BREAK'),
        pauseTimer,                                      
        resumeTimer,                                     
        stopTimer,
        bindTask,                                        
        unbindTask,                                      
        
        // Enums
        TimerState
    };
};
