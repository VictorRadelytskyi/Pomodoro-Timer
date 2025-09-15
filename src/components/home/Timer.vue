<template>
    <div class="timer-container">
        <div class="timer-card">
            <!-- Timer Display -->
            <div class="timer-display">
                <div class="timer-svg">
                    <svg :width="svgWidth" :height="svgHeight">
                        <!-- Background circle -->
                        <circle 
                            :cx="cx" :cy="cy" :r="r"
                            :fill="fill" :stroke-width="2"
                            stroke="#e5e7eb"
                        />
                        
                        <!-- Hour marks -->
                        <g>
                            <line v-for="(mark, idx) in marks" :key="idx"
                                :x1="mark.x1" :x2="mark.x2"
                                :y1="mark.y1" :y2="mark.y2"
                                :stroke="mark.color" :stroke-width="mark.strokeWidth"
                            />
                        </g>
                        
                        <!-- ✅ Dynamic progress circle -->
                        <circle 
                            :cx="cx" :cy="cy" :r="r"
                            fill="none" 
                            :stroke="isBreak ? '#10b981' : '#ef4444'"
                            stroke-width="3"
                            stroke-dasharray="898"
                            :stroke-dashoffset="898 - (898 * progress)"
                            stroke-linecap="round"
                            transform="rotate(-90 147.5 145.5)"
                        />
                        
                        <!-- Center dot -->
                        <circle :cx="cx" :cy="cy" :r="3" fill="#6b7280" />
                    </svg>
                </div>
                
                <!-- Time Display -->
                <div class="time-display">
                    <!-- ✅ Show timer type and clean time display -->
                    <div class="timer-type">{{ timerLabel }}</div>
                    <div class="time-text">
                        {{ minutes }}:{{ seconds.toString().padStart(2, '0') }}
                    </div>
                    <div class="time-label">Time Remaining</div>
                </div>
            </div>

            <!-- ✅ New Info Panel -->
            <div class="timer-info-panel">
                <div class="info-row">
                    <div class="info-item state-info">
                        <span class="info-label">Status:</span>
                        <span class="info-value" :class="`state-${getStateDisplayName(timerState).toLowerCase()}`">
                            {{ getStateDisplayName(timerState) }}
                        </span>
                    </div>
                    
                    <div class="info-item progress-info">
                        <span class="info-label">Progress:</span>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div 
                                    class="progress-fill" 
                                    :style="{ width: `${(progress * 100)}%` }"
                                    :class="{ 'break-progress': isBreak }"
                                ></div>
                            </div>
                            <span class="progress-text">{{ (progress * 100).toFixed(1) }}%</span>
                        </div>
                    </div>
                </div>

                <!-- ✅ Task info - only show if applicable -->
                <div v-if="canBindTask && taskWorkingOn" class="info-row task-row">
                    <div class="info-item task-info">
                        <span class="info-label">Working on:</span>
                        <span class="task-name">{{ taskWorkingOn.name }}</span>
                        <button 
                            class="unbind-btn"
                            @click="unbindTask"
                            title="Stop working on this task"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                
                <!-- ✅ Show when no task is bound but can bind -->
                <div v-else-if="canBindTask && !taskWorkingOn" class="info-row task-row">
                    <div class="info-item no-task-info">
                        <span class="info-label">Task:</span>
                        <span class="no-task-text">None selected</span>
                    </div>
                </div>
            </div>

            <!-- Timer Controls -->
            <div class="timer-controls">
                <!-- ✅ Separate buttons for different timer types -->
                <button 
                    v-if="timerState === TimerState.STOPPED" 
                    class="control-btn start"
                    @click="startPomodoro"
                >
                    Start Pomodoro
                </button>
                
                <button 
                    v-if="timerState === TimerState.RUNNING && timerType === 'STUDY_SESSION'" 
                    class="control-btn start-break"
                    @click="startBreak"
                >
                    Start Break
                </button>
                
                <button 
                    v-if="timerState === TimerState.RUNNING" 
                    class="control-btn pause"
                    @click="pauseTimer"
                >
                    Pause
                </button>
                
                <button 
                    v-if="timerState === TimerState.PAUSED" 
                    class="control-btn resume"
                    @click="resumeTimer"
                >
                    Resume
                </button>
                
                <button 
                    v-if="timerState !== TimerState.STOPPED" 
                    class="control-btn reset"
                    @click="stopTimer"
                >
                    Finish Session
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import {useGlobalTimer} from '../../composables/useGlobalTimer';
    import {TimerState} from '../../composables/useGlobalTimer';

    const {
        // State
        timeLeft,
        duration,
        taskWorkingOn,
        minutes,
        seconds,
        timerState,
        timerType,
        timerLabel,
        isBreak,
        canBindTask,
        
        // Actions
        startPomodoro,
        startBreak,
        stopTimer,
        pauseTimer,
        resumeTimer,
        bindTask,
        unbindTask,
    } = useGlobalTimer();

    const progress = computed(() => {
        if (duration.value === 0) return 0;
        return (duration.value - timeLeft.value) / duration.value;
    });

    // ✅ Helper function to display state names
    const getStateDisplayName = (state: TimerState): string => {
        switch (state) {
            case TimerState.RUNNING:
                return 'Running';
            case TimerState.PAUSED:
                return 'Paused';
            case TimerState.STOPPED:
                return 'Stopped';
            default:
                return 'Unknown';
        }
    };

    const svgWidth = 295;
    const svgHeight = 291;
    const cx = 147.5;
    const cy = 145.5;
    const r = 143; 
    const fill: string = "none";

    // Update the colors to match the professional theme
    const generateLine = function(cx: number, cy: number, angle: number, length: number, strokeWidth: number, color: string = "#d1d5db") {
        const x1 = cx + r*Math.cos(angle);
        const y1 = cy + r*Math.sin(angle);
        const x2 = cx + (r-length)*Math.cos(angle);
        const y2 = cy + (r-length)*Math.sin(angle);
        return {x1, y1, x2, y2, strokeWidth, color};
    }

    const markHour = function(hour: number){
        if(hour<0 || hour>12){
            throw new RangeError("the hour should be an integer number between 0 and 12");
        }
        if (!Number.isInteger(hour)){
            throw new TypeError("the hour should be an integer number between 0 and 12");
        }
        const angle = Math.PI*(hour/6);
        if(hour%3 ==0){
            // Quarter hour marks - thicker and darker
            return generateLine(cx, cy, angle, 25, 3, "#9ca3af");
        }
        else{
            // Regular hour marks - thinner and lighter
            return generateLine(cx, cy, angle, 15, 2, "#d1d5db");
        }
    }

    const marks = Array.from({length: 12}, (_, hour) =>{
        return markHour(hour);
    })

    defineExpose({
        bindTask
    });
</script>

<style scoped>
    .timer-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
        padding: 2rem;
        background-color: #fafafa;
    }

    .timer-card {
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        padding: 3rem 2rem;
        width: 100%;
        max-width: 420px;
        text-align: center;
    }

    .timer-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .timer-svg {
        margin-bottom: 1.5rem;
    }

    .time-text {
        font-size: 3.5rem;
        font-weight: 300;
        color: #111827;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        margin-bottom: 0.5rem;
        letter-spacing: -0.025em;
    }

    .time-label {
        font-size: 0.875rem;
        color: #6b7280;
        text-transform: uppercase;
        font-family: system-ui, -apple-system, sans-serif;
        letter-spacing: 0.1em;
        font-weight: 500;
    }

    .timer-type {
        font-size: 1rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* ✅ Info Panel Styles */
    .timer-info-panel {
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 2rem;
        font-size: 0.875rem;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.75rem;
    }

    .info-row:last-child {
        margin-bottom: 0;
    }

    .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }

    .info-label {
        font-weight: 500;
        color: #6b7280;
        white-space: nowrap;
    }

    .info-value {
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8125rem;
        text-transform: uppercase;
        letter-spacing: 0.025em;
    }

    .info-value.state-running {
        background-color: #dcfce7;
        color: #166534;
    }

    .info-value.state-paused {
        background-color: #fef3c7;
        color: #92400e;
    }

    .info-value.state-stopped {
        background-color: #f3f4f6;
        color: #374151;
    }

    .progress-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }

    .progress-bar {
        flex: 1;
        height: 6px;
        background-color: #e5e7eb;
        border-radius: 3px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: #ef4444;
        border-radius: 3px;
        transition: width 0.3s ease;
    }

    .progress-fill.break-progress {
        background-color: #10b981;
    }

    .progress-text {
        font-weight: 500;
        color: #6b7280;
        min-width: 45px;
        text-align: right;
    }

    .task-row {
        border-top: 1px solid #e5e7eb;
        padding-top: 0.75rem;
        margin-top: 0.75rem;
        margin-bottom: 0;
    }

    .task-info {
        justify-content: space-between;
        width: 100%;
    }

    .task-name {
        font-weight: 500;
        color: #111827;
        flex: 1;
        text-align: left;
        margin-left: 0.5rem;
    }

    .unbind-btn {
        background-color: #fee2e2;
        color: #dc2626;
        border: none;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .unbind-btn:hover {
        background-color: #fecaca;
    }

    .no-task-info {
        width: 100%;
    }

    .no-task-text {
        color: #9ca3af;
        font-style: italic;
        flex: 1;
        text-align: left;
        margin-left: 0.5rem;
    }

    .timer-controls {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .control-btn {
        padding: 0.75rem 1.5rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        background-color: #ffffff;
        color: #374151;
        min-width: 100px;
    }

    .control-btn:hover {
        background-color: #f9fafb;
        border-color: #9ca3af;
    }

    .control-btn:active {
        background-color: #f3f4f6;
        transform: translateY(1px);
    }

    .control-btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        border-color: #3b82f6;
    }

    .control-btn.start {
        background-color: #111827;
        color: #ffffff;
        border-color: #111827;
    }

    .control-btn.start:hover {
        background-color: #1f2937;
    }

    .control-btn.pause {
        background-color: #6b7280;
        color: #ffffff;
        border-color: #6b7280;
    }

    .control-btn.pause:hover {
        background-color: #4b5563;
    }

    .control-btn.resume {
        background-color: #111827;
        color: #ffffff;
        border-color: #111827;
    }

    .control-btn.resume:hover {
        background-color: #1f2937;
    }

    .control-btn.reset {
        color: #dc2626;
        border-color: #fecaca;
        background-color: #fef2f2;
    }

    .control-btn.reset:hover {
        background-color: #fee2e2;
        border-color: #fca5a5;
    }

    .control-btn.start-break {
        background-color: #10b981;
        color: #ffffff;
        border-color: #10b981;
    }

    .control-btn.start-break:hover {
        background-color: #059669;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .timer-container {
            padding: 1rem;
            min-height: 60vh;
        }
        
        .timer-card {
            padding: 2rem 1.5rem;
        }
        
        .time-text {
            font-size: 2.5rem;
        }
        
        .control-btn {
            min-width: 90px;
            padding: 0.625rem 1.25rem;
            font-size: 0.8125rem;
        }

        .info-row {
            flex-direction: column;
            gap: 0.5rem;
        }

        .info-item {
            justify-content: space-between;
            width: 100%;
        }

        .progress-container {
            gap: 0.5rem;
        }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .timer-container {
            background-color: #111827;
        }

        .timer-card {
            background-color: #1f2937;
            border-color: #374151;
        }

        .timer-info-panel {
            background-color: #374151;
            border-color: #4b5563;
        }

        .time-text {
            color: #f9fafb;
        }

        .time-label {
            color: #9ca3af;
        }

        .control-btn {
            background-color: #374151;
            color: #f9fafb;
            border-color: #4b5563;
        }

        .control-btn:hover {
            background-color: #4b5563;
        }

        .task-name {
            color: #f9fafb;
        }
    }
</style>