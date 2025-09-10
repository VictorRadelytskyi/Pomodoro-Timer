import {ref, computed, readonly} from 'vue';
import type {Task} from './useTasks';
import {useTasks} from './useTasks';
import {loadSettings} from './settings';

const {
    pomodoroTime,
    playPomodoroCompletionSound,
} = loadSettings();

export enum TimerState {
    RUNNING,
    PAUSED,
    STOPPED 
}

const timeLeft = ref(pomodoroTime.value);
const taskWorkingOn = ref<Task | null>(null);
const timerState = ref<TimerState>(TimerState.STOPPED);

let globalUpdateTimeWorkedOn: ((task: Task, seconds: number) => void) | null = null;
let globalIntervalId: number | null = null;

const startGlobalTimer = () => {
    if (globalIntervalId) {
        clearInterval(globalIntervalId);
    }
    
    globalIntervalId = setInterval(() => {
        console.log(`task working on: ${JSON.stringify(taskWorkingOn.value, null, 2)}`)
        if (timeLeft.value > 0) {
            timeLeft.value -= 1;
            
            if (taskWorkingOn.value) {
                if (globalUpdateTimeWorkedOn){
                    globalUpdateTimeWorkedOn(taskWorkingOn.value, 1);
                    updateTask(taskWorkingOn.value);
                } else{
                    throw Error(`globalUpdateTimeWorkedOn is null!`);
                }
            }
        } else {
            console.log("Pomodoro completed");
            playPomodoroCompletionSound();
            stopTimer();
        }
    }, 1000);
};

const stopGlobalTimer = () => {
    if (globalIntervalId) {
        clearInterval(globalIntervalId);
        globalIntervalId = null;
    }
};

const startTimer = function() {
    console.log('🟢 Timer started');
    startGlobalTimer();
    timerState.value = TimerState.RUNNING;
};

const stopTimer = function() {
    console.log('🔴 Timer stopped');
    stopGlobalTimer();
    timeLeft.value = pomodoroTime.value;
    timerState.value = TimerState.STOPPED;
    taskWorkingOn.value = null;
};

const pauseTimer = function() {
    console.log('🟡 Timer paused');
    stopGlobalTimer();
    timerState.value = TimerState.PAUSED;
};

const resumeTimer = function() {
    console.log('🟢 Timer resumed');
    startGlobalTimer();
    timerState.value = TimerState.RUNNING;
};

const bindTask = function(task: Task) {
    taskWorkingOn.value = task;
    console.log(`task ${task.name} has been bound`);
};

const unbindTask = () => {
    taskWorkingOn.value = null;
    console.log('Task unbound from timer');
};

const updateTask = function(newTask: Task){
    const oldTaskString = localStorage.getItem('tasks');
    let oldTasks: Task[] | null = null;
    if(oldTaskString){
        oldTasks = JSON.parse(oldTaskString);
    }

    let newTasks: Task[] | null = null;

    if(oldTasks){
        const taskIndex = oldTasks.findIndex((oldTask)=>oldTask.id === newTask.id);
        newTasks = oldTasks;
        if (taskIndex != -1){
            newTasks[taskIndex] = newTask;
        } else{
            throw Error(`no task found with id ${newTask.id}`);
        }
    }
    localStorage.setItem('tasks', JSON.stringify(newTasks as Task[]));
}

export const useGlobalTimer = function() {
    if (!globalUpdateTimeWorkedOn){
        globalUpdateTimeWorkedOn = useTasks().updateTimeWorkedOn;
    }

    const angleDeg = computed(() => 360 * (pomodoroTime.value - timeLeft.value) / pomodoroTime.value);
    const minutes = computed(() => Math.floor(timeLeft.value / 60));
    const seconds = computed(() => Math.round(timeLeft.value % 60));

    return {
        // State (readonly to prevent external mutation)
        timeLeft: readonly(timeLeft),
        taskWorkingOn: readonly(taskWorkingOn),
        timerState: readonly(timerState),
        
        // Computed
        minutes,
        seconds,
        angleDeg,
        
        // Actions
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        bindTask,
        unbindTask
    }
}