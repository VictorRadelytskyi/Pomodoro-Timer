import {ref, computed} from 'vue';
import {useIntervalFn} from '@vueuse/core';
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

export const useGlobalTimer = function(){
    const angleDeg = computed(()=>360*(pomodoroTime.value-timeLeft.value)/pomodoroTime.value);
    const minutes = computed(() => Math.floor(timeLeft.value / 60));
    const seconds = computed(() => Math.round(timeLeft.value % 60));

    const {updateTimeWorkedOn} = useTasks();
    
    //an ID of the interval which updates timeLeft each second
    let updateTimerInterval: number | undefined = undefined;

    const {pause, resume} = useIntervalFn(function(){
        if (timeLeft.value > 0){
            timeLeft.value -= 1;
            
            if(taskWorkingOn.value){
                updateTimeWorkedOn(taskWorkingOn.value, 1);
            } 
        } else{
            console.log("Pomodoro completed");
            playPomodoroCompletionSound();
            stopTimer();
         }
    }, 1000, {immediate: false})

    const startTimer = function(){
        resume();
        timerState.value = TimerState.RUNNING;
    }

    const stopTimer = function(){
        pause();
        timeLeft.value = pomodoroTime.value;
        timerState.value = TimerState.STOPPED;
    }

    // const updateTimer = function(){
    //     if(!isRunning.value){
    //         startTimer();
    //     }
    //     else{
    //         stopTimer();
    //     }
    // }

    const pauseTimer = function(){
        pause();
        timerState.value = TimerState.PAUSED;
    }

    const resumeTimer = function(){
        resume();
        timerState.value = TimerState.RUNNING;
    }

    const cleanup = () => {
        if(updateTimerInterval){
            clearInterval(updateTimerInterval);
            updateTimerInterval = undefined;
        }
    }

    const bindTask = function(task: Task){
        taskWorkingOn.value = task;
        console.log(`task with id: ${task.id} has been bounded`);
    }

    const unbindTask = () => {
        taskWorkingOn.value = null;
        console.log('Task unbound from timer');
    }

    // const updateTimerState = function(state: string){
    //     switch (state){
    //         case 'RUNNING':
    //             timerState.value = 
    //     }
    // }

    return {
        // State
        timeLeft,
        taskWorkingOn,
        minutes,
        seconds,
        timerState,
        angleDeg,
        
        // Actions
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        cleanup,
        bindTask,
        unbindTask
    }
}