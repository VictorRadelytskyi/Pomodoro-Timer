import {ref, watch, onMounted, computed} from 'vue';
import { v4 as uuidv4 } from 'uuid';
import settings from './settings';

export type Task = {
    id: string;
    name: string;
    isCompleted: boolean;
    timeWorkedOn: number;
    showTick?: boolean;
};
const tasks = ref<Task[]>([]);
export function useTasks(){
    const completedTasks = computed(() => tasks.value.filter(task => task.isCompleted));
    const uncompletedTasks = computed(()=>tasks.value.filter(task=>!task.isCompleted));
    const showPopup = ref<boolean>(false);
    const showPopupId = ref <string | null>(null);

    const addTask = function(name: string){
        const trimmed = name.trim();
        if(trimmed === ''){
            alert('A task can\'t be empty');
            return;
        }
        const taskId = uuidv4();
        //check if the id is not unique
        if(tasks.value.find(task=>task.id===taskId)){
            throw Error(`Failed to create a new task the task id: ${taskId} is not unique`);
        } else{
            tasks.value.push({id: taskId, name: trimmed, isCompleted: false, timeWorkedOn: 0, showTick: false});
        }
    }   

    const removeTask = function(id: string){
        tasks.value = tasks.value.filter(task=>task.id!==id);
    }

    const markAsCompleted = function(id: string){
        const task = tasks.value.find(task=>task.id===id);
        console.log(`task to mark as complete: ${task} with id requested as ${id}`);
        if(task){
            task.showTick = true;

            setTimeout(()=>{
                task.isCompleted = true;
                console.log(`Marked ${task} as completed`);
            }, 500);
        } else{
            throw Error(`Can't find the task of id: ${id}`);
        }
        playSoundOnTaskCompletion();
    }

    const markAsUncompleted = function(id: string){
        const task = tasks.value.find(task=>task.id===id);
        if(task){
            task.isCompleted = false;
            task.showTick = false;
        }else{
            throw Error(`Can't find the task of id: ${id}`);
        }
    }

    const togglePopup = function(id: string){
        if (showPopupId.value === id ){ //close if opened
            showPopupId.value = null;
            showPopup.value = false;
        }
        else{ 
            showPopup.value = true;
            showPopupId.value = id;
        }
    }

    const completeAndClosePopup = function(id: string){
        markAsCompleted(id);
        togglePopup(id);
    }

    const unCompleteAndClosePopup = function(id: string){
        markAsUncompleted(id);
        togglePopup(id);
    }

    const updateTimeWorkedOn = function(task: Task, deltaSeconds: number){
        task.timeWorkedOn += deltaSeconds;
    };

    const playSoundOnPomodoroCompletion = function(volume: number = 0.5){
        if (settings.soundEffectOnPomodoroCompletion){
            playSound('/public/sounds/pomodoro_completed.mp3', volume);
        }
    }

    const playSoundOnTaskCompletion = function(volume: number = 0.5){
        if (settings.soundEffectOnPomodoroCompletion){
            playSound('/public/sounds/good.mp3', volume);
        }
    }

    const playSound = function(path: string, volume: number = 0.5){
        try{
            const audio = new Audio(path);
            audio.volume = volume;
            audio.play().catch(err=>{
                console.warn('Could not play pomodoro completion sound: ', err);
            });
        } catch(error){
            console.warn('Audio not supported: ', error);
        }
    }

    const showCalendarPopup = function(taskId: string){

    }

    onMounted(()=>{
        const saved = localStorage.getItem('tasks');
        if(saved){
            tasks.value = JSON.parse(saved) as Task[];
        }
    });

    watch(tasks, (newTasks)=>{
        const stringifiedTasks = JSON.stringify(newTasks);
        console.log(`watch function called`);
        localStorage.setItem('tasks', stringifiedTasks);
        
    }, {deep: true})

    return {
        tasks,
        showPopup,
        showPopupId,
        completedTasks,
        uncompletedTasks,
        addTask,
        removeTask,
        togglePopup,
        completeAndClosePopup,
        unCompleteAndClosePopup,
        markAsCompleted, 
        markAsUncompleted, 
        updateTimeWorkedOn,
        playSoundOnPomodoroCompletion,
        showCalendarPopup
    }
}