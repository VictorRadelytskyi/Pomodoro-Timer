import { ref } from 'vue';
import type { Task } from './useTasks';

// ✅ Settings state - declare first
const pomodoroTime = ref(25);
const breakTime = ref(5);
const soundEffectOnPomodoroCompletion = ref(true);
const pomodoroCompletionVolume = ref(50);
const soundEffectOnTaskCompletion = ref(true);
const taskCompletionVolume = ref(50);

// ✅ Sound functions - define before TimerType uses them
const playSound = (path: string, volume: number = 0.5) => {
    try {
        const audio = new Audio(path)
        audio.volume = Math.min(Math.max(volume, 0), 1); 
        audio.play().catch(err => {
            console.warn('Could not play sound: ', err);
        })
    } catch(error) {
        console.warn('Audio not supported: ', error);
    }
}

const playPomodoroCompletionSound = () => {
    if (soundEffectOnPomodoroCompletion.value) {
        const volume = pomodoroCompletionVolume.value / 100;
        playSound('/sounds/pomodoro-complete.mp3', volume);
    }
}

const playBreakCompletionSound = () => {
    if (soundEffectOnPomodoroCompletion.value) { // ❌ This should use break settings
        const volume = pomodoroCompletionVolume.value / 100; // ❌ Should use break volume
        playSound('/sounds/break-complete.mp3', volume); // ✅ Different sound file
    }
}

const playTaskCompletionSound = () => {
    if (soundEffectOnTaskCompletion.value) {
        const volume = taskCompletionVolume.value / 100;
        playSound('/sounds/task-complete.mp3', volume);
    }
}

// ✅ TimerTypeConfig interface
interface TimerTypeConfig {
    duration: () => number; // in minutes
    canBindTask: boolean;
    onStart?: () => void;
    onComplete: () => void;
    onTick?: (taskWorkingOn: Task | null, updateTimeWorkedOn: Function | null) => void;
    getLabel: () => string;
}

// ✅ TimerType object - now all functions are defined
export const TimerType: Record<string, TimerTypeConfig> = {
    STUDY_SESSION: {
        duration: () => pomodoroTime.value,
        canBindTask: true,
        onComplete: () => {
            playPomodoroCompletionSound();
            console.log('Pomodoro completed! Time for a break.');
        },
        onTick: (taskWorkingOn, updateTimeWorkedOn) => {
            if (taskWorkingOn && updateTimeWorkedOn) {
                updateTimeWorkedOn(taskWorkingOn, 1);
            }
        },
        getLabel: () => 'Pomodoro'
    },
    
    BREAK: {
        duration: () => breakTime.value,
        canBindTask: false,
        onComplete: () => {
            playBreakCompletionSound();
            console.log('Break completed! Ready for another pomodoro?');
        },
        getLabel: () => 'Break'
    }
} as const;

// ✅ Helper functions
export const getTimerConfig = (type: keyof typeof TimerType) => TimerType[type];
export const canTimerBindTask = (type: keyof typeof TimerType) => TimerType[type].canBindTask;

// ✅ Update functions
const updatePomodoroTime = (value: number) => {
    pomodoroTime.value = value;
    saveToLocalStorage();
}

const updateBreakTime = (value: number) => {
    breakTime.value = value;
    saveToLocalStorage();
}

const updateSoundEffectOnPomodoroCompletion = (value: boolean) => {
    soundEffectOnPomodoroCompletion.value = value;
    saveToLocalStorage();
}

const updatePomodoroCompletionVolume = (value: number) => {
    pomodoroCompletionVolume.value = value;
    saveToLocalStorage();
}

const updateSoundEffectOnTaskCompletion = (value: boolean) => {
    soundEffectOnTaskCompletion.value = value;
    console.log(`soundEffectOnTaskCompletion value changed to ${soundEffectOnTaskCompletion.value}`)
    saveToLocalStorage();
}

const updateTaskCompletionVolume = (value: number) => {
    taskCompletionVolume.value = value;
    saveToLocalStorage();
}

// ✅ LocalStorage functions
const saveToLocalStorage = () => {
    const settings = {
        pomodoroTime: pomodoroTime.value,
        breakTime: breakTime.value,
        soundEffectOnPomodoroCompletion: soundEffectOnPomodoroCompletion.value,
        pomodoroCompletionVolume: pomodoroCompletionVolume.value,
        soundEffectOnTaskCompletion: soundEffectOnTaskCompletion.value,
        taskCompletionVolume: taskCompletionVolume.value,
    }
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
}

const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('pomodoroSettings')
    if (saved) {
        try {
            const settings = JSON.parse(saved)
            pomodoroTime.value = settings.pomodoroTime ?? 25
            breakTime.value = settings.breakTime ?? 5
            soundEffectOnPomodoroCompletion.value = settings.soundEffectOnPomodoroCompletion ?? true
            pomodoroCompletionVolume.value = settings.pomodoroCompletionVolume ?? 50
            soundEffectOnTaskCompletion.value = settings.soundEffectOnTaskCompletion ?? true
            taskCompletionVolume.value = settings.taskCompletionVolume ?? 50
        } catch (error) {
            console.warn('Failed to load settings:', error)
        }
    }
}


// ✅ Main export function
export const loadSettings = () => {
    loadFromLocalStorage();
    
    return {
        // State (reactive refs)
        pomodoroTime,
        breakTime,
        soundEffectOnPomodoroCompletion,
        pomodoroCompletionVolume,
        soundEffectOnTaskCompletion,
        taskCompletionVolume,
        
        // Update functions
        updatePomodoroTime,
        updateBreakTime,
        updateSoundEffectOnPomodoroCompletion,
        updatePomodoroCompletionVolume,
        updateSoundEffectOnTaskCompletion,
        updateTaskCompletionVolume,
        
        // Sound functions
        playPomodoroCompletionSound,
        playBreakCompletionSound,
        playTaskCompletionSound,
        playSound
    }
}