import {ref, watch, onMounted, computed} from 'vue';
import { v4 as uuidv4 } from 'uuid';
import {loadSettings} from './settings';

const {
    playTaskCompletionSound,
} = loadSettings();

export enum Priority{
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}

export type Task = {
    id: string;
    name: string;
    isCompleted: boolean;
    timeWorkedOn: number;
    priority?: Priority;
    showTick?: boolean;
    deadline?: Date;
};
const tasks = ref<Task[]>([]);
export function useTasks(){
    const completedTasks = computed(() => tasks.value.filter(task => task.isCompleted));
    const uncompletedTasks = computed(()=>tasks.value.filter(task=>!task.isCompleted));
    const showPopup = ref<boolean>(false);
    const showPopupId = ref <string | null>(null);
    const showCalendarId = ref<string | null>(null);

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
        playTaskCompletionSound();
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

    const showCalendarPopup = function(taskId: string){
        showCalendarId.value = showCalendarId.value === taskId ? null : taskId;
    }

    const closeCalendar = function(){
        showCalendarId.value = null;
    }

    const isCalendarOpen = function(taskId: string){
        return showCalendarId.value === taskId;
    }

    const updateDeadline = function(taskId: string, dateObj: Date){
        const task = tasks.value.find(task => task.id === taskId);
        if (task) {
            task.deadline = dateObj;
        } else {
            throw Error(`Can't find the task of id: ${taskId}`);
        }
    }

    const removeDeadline = function(taskId: string) {
        const task = tasks.value.find(t => t.id === taskId);
        if (task) {
            task.deadline = undefined;
            console.log(`Removed deadline for task ${taskId}`);
        }
    }

    const handleDeadlineUnselected = (taskId: string) => {
        removeDeadline(taskId);
        closeCalendar(); 
    }

    const formatDate = (date: Date | string): string => {
        if (!date) return '';
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(dateObj.getTime())) return 'Invalid Date';
        
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric', 
            year: 'numeric'
        });
    }

    const formatWorkTime = (seconds: number | undefined): string => {
        if (!seconds || seconds < 1) return '';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

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
        showCalendarPopup,
        closeCalendar,
        isCalendarOpen,
        updateDeadline,
        formatDate,
        removeDeadline,
        handleDeadlineUnselected,
        formatWorkTime
    }
}