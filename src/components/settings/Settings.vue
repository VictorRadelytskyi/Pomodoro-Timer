<template>
    <div class="settings-container">
        <div class="settings-sections">
            <!-- Timer Settings Section -->
            <div class="settings-section">
                <div class="section-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                    </svg>
                    <h3>Timer Settings</h3>
                </div>
                
                <div class="settings-options">
                    <div class="setting-item">
                        <label>Pomodoro Session Duration</label>
                        <!-- ✅ Direct v-model binding - automatic reactivity! -->
                        <input 
                            type="number" 
                            v-model.number="pomodoroTime"
                            min="1" 
                            max="60"
                        >
                        <span>minutes</span>
                    </div>

                    <div class="setting-item">
                        <label>Break Session Duration</label>
                        <!-- ✅ Direct v-model binding - automatic reactivity! -->
                        <input 
                            type="number" 
                            v-model.number="breakTime"
                            min="1" 
                            max="60"
                        >
                        <span>minutes</span>
                    </div>
                </div>
            </div>
            
            <!-- Sound Settings Section -->
            <div class="settings-section">
                <div class="section-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                    </svg>
                    <h3>Sound & Notifications</h3>
                </div>
                
                <div class="settings-options">
                    <div class="sound-type">
                        <h4>Sound Effects on pomodoro completion</h4>
                        <div class="setting-item">
                            <label>Enable Sound</label>
                            <!-- ✅ Direct v-model binding -->
                            <input 
                                type="checkbox" 
                                v-model="soundEffectOnPomodoroCompletion"
                            >
                        </div>
                        <div class="setting-item">
                            <label>Volume</label>
                            <!-- ✅ Direct v-model binding -->
                            <input 
                                type="range" 
                                v-model.number="pomodoroCompletionVolume"
                                min="0" 
                                max="100"
                            >
                            <span>{{ pomodoroCompletionVolume }}%</span>
                            <!-- ✅ Test button -->
                            <button @click="playPomodoroCompletionSound()">Test</button>
                        </div>
                    </div>
                    
                    <div class="sound-type">
                        <h4>Sound Effects on task completion</h4>
                        <div class="setting-item">
                            <label>Enable Sound</label>
                            <!-- ✅ Direct v-model binding -->
                            <input 
                                type="checkbox" 
                                v-model="soundEffectOnTaskCompletion"
                            >
                        </div>
                        <div class="setting-item">
                            <label>Volume</label>
                            <!-- ✅ Direct v-model binding -->
                            <input 
                                type="range" 
                                v-model.number="taskCompletionVolume"
                                min="0" 
                                max="100"
                            >
                            <span>{{ taskCompletionVolume }}%</span>
                            <!-- ✅ Test button -->
                            <button @click="playTaskCompletionSound()">Test</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../stores/useSettingsStore';

// ✅ No more emit needed - store handles everything automatically
const {
    pomodoroTime,
    breakTime,
    soundEffectOnPomodoroCompletion,
    pomodoroCompletionVolume,
    soundEffectOnTaskCompletion,
    taskCompletionVolume,
    playPomodoroCompletionSound,
    playTaskCompletionSound
} = useSettingsStore();

// ✅ No wrapper functions needed - direct binding to reactive refs!
</script>

<style scoped>
.settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.settings-sections {
    display: flex;
    flex-direction: column;
    gap: 1.775rem;
}

.settings-section {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    color: #111827;
}

.section-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.settings-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.sound-type{
    border: 1px solid #e5e7eb;
    padding: 1rem 0.5rem;
}

.sound-type h4{
    margin: 0 0.5rem 0.5rem 0.5rem;
}

.setting-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 8px;
}

.setting-item label {
    font-weight: 500;
    color: #374151;
    min-width: 120px;
}

.setting-item input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    outline: none;
}

.setting-item input:focus {
    border-color: #6b7280;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
}

.setting-item span {
    color: #6b7280;
    font-size: 0.875rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .settings-container {
        padding: 1rem;
    }
    
    .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .setting-item label {
        min-width: auto;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .settings-title {
        color: #f9fafb;
    }
    
    .settings-subtitle {
        color: #9ca3af;
    }
    
    .settings-section {
        background-color: #1f2937;
        border-color: #374151;
    }
    
    .section-header {
        color: #f9fafb;
    }
    
    .setting-item {
        background-color: #374151;
    }
    
    .setting-item label {
        color: #f9fafb;
    }
    
    .setting-item input {
        background-color: #1f2937;
        border-color: #4b5563;
        color: #f9fafb;
    }
}
</style>