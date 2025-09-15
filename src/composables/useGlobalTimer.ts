import {ref, computed, readonly} from 'vue';
import type {Task} from './useTasks';
import {useTasks} from './useTasks';

export enum TimerState {
    RUNNING,
    PAUSED,
    STOPPED,
}

// ✅ Make timer types more explicit
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

// ✅ Simple, predictable state
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
    
    // ✅ Initialize with explicit values
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

// ✅ Simple, predictable timer creation
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
    }
};

// ✅ Rest of your functions stay mostly the same, but simpler
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
    
    globalIntervalId = setInterval(() => {
        if (currentTimerContext.value.timeLeft > 0) {
            currentTimerContext.value.timeLeft -= 1;
            config.onTick?.(taskWorkingOn.value, globalUpdateTimeWorkedOn);
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
    
};

// ✅ Export the composable
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
    const isBreak = computed(() => timerType.value === 'BREAK'); // ✅ Add this
    
    // ✅ Task binding functions
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

    // ✅ Timer controls
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
        
        // ✅ Only unbind task if timer supports task binding
        if (config?.canBindTask) {
            taskWorkingOn.value = null;
        }
    };

    return {
        // State
        timeLeft: readonly(timeLeft),
        duration: readonly(duration),                    // ✅ Add this
        taskWorkingOn: readonly(taskWorkingOn),          // ✅ Add this
        timerState: readonly(timerState),
        timerType: readonly(timerType),
        canBindTask: readonly(canBindTask),              // ✅ Add this
        timerLabel: readonly(timerLabel),
        
        // ✅ Computed
        minutes,
        seconds,
        isStudySession,
        isBreak,                                         
        
        // ✅ Actions
        startTimer,
        startPomodoro: () => startTimer('STUDY_SESSION'),
        startBreak: () => startTimer('BREAK'),
        pauseTimer,                                      
        resumeTimer,                                     
        stopTimer,
        bindTask,                                        
        unbindTask,                                      
        
        // ✅ Enums
        TimerState
    };
};

// ✅ Make sure to call this after settings load
// timerConfigs = null; // Will be set by initializeTimer