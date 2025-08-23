<template>
    <div class="task-cont main-section">
        <div class="add-task-cont">
            <input 
                type="text" 
                placeholder="Enter task name" 
                v-model="taskName" 
                @keyup.enter="addTask(taskName)"
                class="add-task-field"
            >   
            <img 
                src="/src/assets/plus.svg"
                class="task-control-image plus-icon"
                width="24px"
                height="24px"
                alt="add task"
                title="add task"
                @click="addTask(taskName)"
            >
        </div>
        <div class="task-list-cont">
            <h3>To do</h3>
            <ol id="tasks" class="task-list">
                <li v-for="task in uncompletedTasks" :key="task.id"  class="task-item">
                    <div class="task-item-cont">
                        <div class="task-mgmt-controls">
                            <div class="task-status" title="Mark task as completed">
                                <svg class="task-control-image" height="24px" width="24px" @click="markAsCompleted(task.id)">
                                    <!-- circle to mark the task as completed-->
                                    <circle 
                                        cx="12px" 
                                        cy="12px"
                                        r="10"
                                        stroke="green"
                                        stroke-width="2px"
                                        fill="none"
                                    />
                                    <!--tick to show completion-->
                                    <transition name="fade">
                                        <polyline
                                            v-if="task.showTick"
                                            points="2,12 12,21 19,5"
                                            fill="none"
                                            stroke-width="2.5px"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke="green"
                                        />
                                    </transition>
                                </svg>
                            </div>
                            <div class="task-deadline">
                                <img 
                                    src="/src/assets/calendar.svg.png" 
                                    class="task-control-image"
                                    title="schedule a deadline for the task"
                                    @click="showCalendarPopup(task.id)"
                                />
                                <Calendar 
                                    :id="task.id"
                                    v-if="isCalendarOpen(task.id)"
                                    @deadline-selected="updateDeadline"
                                    @deadline-unselected="handleDeadlineUnselected"
                                />
                            </div>

                            <div class="display-deadline" v-if="task.deadline">
                                <span>Complete by: </span>
                                <span class="deadline-date">{{formatDate(task.deadline)}}</span>
                            </div>
                        </div>
                        <div class="task-main-info">
                            <div class="task-name">
                                <span>{{task.name}}</span>
                            </div>
                        </div>
                        <div class="task-mgmt-controls">
                            <div v-if="task.timeWorkedOn && task.timeWorkedOn > 0" class="task-worked-on">
                                <span>Worked: </span>
                                <span 
                                    class="time-worked-on"> 
                                    {{formatWorkTime(task.timeWorkedOn)}}
                                </span>
                            </div>
                            <div class="three-dots-wrapper">
                                <div class="task-config-popup" v-if="String(showPopupId) === task.id">
                                    <div class="task-popup-control" @click="completeAndClosePopup(task.id)">
                                        <span class="inside">Mark as completed</span>
                                    </div>
                                </div>
                                <img 
                                    src="/src/assets/three-dots-vertical.svg" 
                                    @click="togglePopup(task.id)" 
                                    alt="Context Menu"
                                    class="task-control-image"
                                    title="advanced configurations"
                                />
                            </div>
                            <img 
                                src="/src/assets/trash.svg" 
                                @click="removeTask(task.id)" 
                                alt="Delete item"
                                class="task-control-image"
                                title="remove task"
                            />
                        </div>
                    </div>
                </li>
            </ol>
        </div>
        <div class="task-list-cont">
            <h3>Completed</h3>
            <ol id="tasks" class="task-list">
                <li v-for="task in completedTasks" :key="task.id" class="task-item">
                    <div class="task-item-cont">
                        <div class="control-task-mgmt-controls">
                            <div class="task-status">
                            </div>
                        </div>
                        <div class="task-name">
                            <span>{{task.name}}</span>
                        </div>
                        <div class="task-mgmt-controls">
                            <div class="three-dots-wrapper">
                                <div class="task-config-popup" v-if="String(showPopupId) === task.id">
                                    <div class="task-popup-control" @click="unCompleteAndClosePopup(task.id)">
                                        <span class="inside">Mark as uncompleted</span>
                                    </div>
                                </div>
                                <img 
                                    src="/src/assets/three-dots-vertical.svg" 
                                    @click="togglePopup(task.id)" 
                                    alt="Context Menu"
                                    class="task-control-image"
                                    title="advanced configurations"
                                />
                            </div>
                            <img 
                                src="/src/assets/trash.svg" 
                                @click="removeTask(task.id)" 
                                alt="Delete item"
                                class="task-control-image"
                                title="remove task"
                            />
                        </div>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</template>

<style>
    .add-task-cont{
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        position: relative;
    }

    .add-task-field{
        margin-left: 5px;
        width: 98.3%;
        height: 30px;
    }

    .plus-icon{
        position: absolute;
        right: 1%;
        top: 50%;
        transform: translateY(-50%);
    }

    .task-list-cont{
        border: 1px solid black;
        box-shadow: 1px 1px 5px green;
        padding: 5px;
        margin: 5px;
        margin-bottom: 10px;
    }

    .task-list{
        padding-top: 8px;
        padding-bottom: 8px;
        border: 1px solid pink;
    }

    .task-item{
        margin-bottom: 5px;
        border-radius: 8px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        border: 1px solid #f0f0f0;
        transition: box-shadow 0.2s;
    }

    .task-status{
        margin-left: 8px;
        padding-left: 8px;
        padding-right: 8px;
    }

    .task-item:nth-child(odd){
        background-color: #FFF3F3;
    }
    
    .task-item:nth-child(even){
        background-color: #E3F9E5;
    }
    
    .task-item:hover{
        background-color: lch(78.87% 0.37 17.97) !important;
    }

    .task-item-cont{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .task-item-cont img{
        height: 20px; 
        width: auto;
        vertical-align: middle;
        margin-right: 8px;
        padding: 3px;
    }

    .task-main-info{
        display: flex;
        flex-direction: row;
    }

    .task-worked-on{
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 8px;    
    }

    .time-worked-on{
        color: red;
        font-style: bold;
        font-size: 15px;
    }

    .task-mgmt-controls{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .task-control-image:hover{
        cursor: pointer;
        background-color: lch(51.31% 0.4 18.49);
        transition: 0.2s;
        border-radius: 50%;
    }

    .three-dots-wrapper{
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .task-config-popup{
        position: absolute;
        top: 50%;
        right: 110%;
        transform: translateY(-50%);
        border: 1px outset black;
        border-radius: 6px;
        padding: 10px;
        background: #fff;
        box-shadow: 3px 3px 8px rgba(0,0,0,0.2);
        white-space: nowrap;
    }

    .task-popup-control{
        height: 24px;
        padding: 5px;
        margin-bottom: 5px;
        width: auto;
    }

    .task-popup-control:hover{
        cursor: pointer;
        background-color: #dddddd;
        border-radius: 4px;
    }  

    .task-popup-control span{
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 1;
    }

    .task-deadline{
        position: relative;
    }

    .calendar-popup{
        position: absolute;
        background-color: white;
    }

    .display-deadline{
        display: flex;
        gap: 7px;
        flex-direction: row;
        align-items: center;
    }

    .deadline-date{
        font-size: 16px;
        color: red;
    }

</style>

<script setup lang="ts">
    import {ref, watch, onMounted} from 'vue';
    import type {Task} from '../../composables/useTasks'
    import {useTasks} from '../../composables/useTasks';
    import Calendar from './Calendar.vue';
    const taskName = ref<string>('');

    const {
        tasks, 
        showPopupId,
        completedTasks, 
        uncompletedTasks, 
        addTask, 
        removeTask, 
        togglePopup,
        markAsCompleted, 
        completeAndClosePopup,
        unCompleteAndClosePopup,
        showCalendarPopup,
        isCalendarOpen,
        updateDeadline,
        formatDate,
        handleDeadlineUnselected,
        formatWorkTime
    } = useTasks()

    onMounted(()=>{
        const saved = localStorage.getItem('tasks');
        if(saved){
            tasks.value = JSON.parse(saved) as Task[];
        }
    });

    watch(tasks, (newTasks: Task[])=>{
        const stringifiedTasks = JSON.stringify(newTasks);
        localStorage.setItem('tasks', stringifiedTasks);
    }, {deep: true})

</script>
