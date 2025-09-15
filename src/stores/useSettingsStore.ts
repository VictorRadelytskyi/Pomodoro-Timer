import { ref, computed, watch } from 'vue';
import { initializeTimer } from '../composables/useGlobalTimer';

// ✅ Global settings store
const pomodoroTime = ref(25);
const breakTime = ref(5);
const soundEffectOnPomodoroCompletion = ref(true);
const soundEffectOnBreakCompletion = ref(false);
const pomodoroCompletionVolume = ref(50);
const breakCompletionVolume = ref(50);
const soundEffectOnTaskCompletion = ref(true);
const taskCompletionVolume = ref(50);

// ✅ Auto-save to localStorage
const saveToLocalStorage = () => {
    const settings = {
        pomodoroTime: pomodoroTime.value,
        breakTime: breakTime.value,
        soundEffectOnPomodoroCompletion: soundEffectOnPomodoroCompletion.value,
        pomodoroCompletionVolume: pomodoroCompletionVolume.value,
        soundEffectOnTaskCompletion: soundEffectOnTaskCompletion.value,
        taskCompletionVolume: taskCompletionVolume.value,
    };
    
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    console.log('⚙️ Settings auto-saved to localStorage');
};

// ✅ Auto-reinitialize timer when relevant settings change
let isInitialized = false;

watch([pomodoroTime, breakTime], () => {
    if (!isInitialized) {
        isInitialized = true;
        return;
    }
    
    console.log('🔄 Timer settings changed, reinitializing...');
    
    initializeTimer(
        pomodoroTime.value,
        breakTime.value,
        {
            playPomodoroCompletionSound,
            playBreakCompletionSound,
        }
    );
}, { flush: 'post' });

// ✅ Auto-save when any setting changes
watch([
    pomodoroTime,
    breakTime,
    soundEffectOnPomodoroCompletion,
    pomodoroCompletionVolume,
    soundEffectOnTaskCompletion,
    taskCompletionVolume
], saveToLocalStorage, { flush: 'post' });

// ✅ Sound functions
const playSound = (path: string, volume: number = 0.5) => {
    try {
        const audio = new Audio(path);
        audio.volume = Math.min(Math.max(volume, 0), 1);
        audio.play().catch(err => {
            console.warn('Could not play sound:', err);
        });
    } catch(error) {
        console.warn('Audio not supported:', error);
    }
};

const playPomodoroCompletionSound = () => {
    if (soundEffectOnPomodoroCompletion.value) {
        const volume = pomodoroCompletionVolume.value / 100;
        playSound('/sounds/pomodoro_completed.mp3', volume);
    }
};

const playTaskCompletionSound = () => {
    if (soundEffectOnBreakCompletion.value) {
        const volume = breakCompletionVolume.value / 100;
        playSound('/sounds/task-complete.mp3', volume);
    }
};

const playBreakCompletionSound = () => {
    if (soundEffectOnBreakCompletion.value) {
        const volume = breakCompletionVolume.value / 100;
        playSound('/sounds/break-complete.mp3', volume);
    }
};

// ✅ Load from localStorage on startup
const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            pomodoroTime.value = settings.pomodoroTime ?? 25;
            breakTime.value = settings.breakTime ?? 5;
            soundEffectOnPomodoroCompletion.value = settings.soundEffectOnPomodoroCompletion ?? true;
            pomodoroCompletionVolume.value = settings.pomodoroCompletionVolume ?? 50;
            soundEffectOnTaskCompletion.value = settings.soundEffectOnTaskCompletion ?? true;
            taskCompletionVolume.value = settings.taskCompletionVolume ?? 50;
            
            console.log('⚙️ Settings loaded from localStorage');
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }
};

// ✅ Initialize on first import
loadFromLocalStorage();

// ✅ Export the store
export const useSettingsStore = () => {
    return {
        // State (reactive)
        pomodoroTime,
        breakTime,
        soundEffectOnPomodoroCompletion,
        pomodoroCompletionVolume,
        soundEffectOnTaskCompletion,
        taskCompletionVolume,
        
        // Sound functions
        playPomodoroCompletionSound,
        playTaskCompletionSound,
        playBreakCompletionSound,
        
        // Computed
        timerSettings: computed(() => ({
            pomodoroDuration: pomodoroTime.value,
            breakDuration: breakTime.value,
        })),
        
        // Utilities
        loadFromLocalStorage,
        saveToLocalStorage,
    };
};