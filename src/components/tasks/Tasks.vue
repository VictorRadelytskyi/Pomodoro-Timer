<template>
    <div class="main-section">
        <div class="tasks-container">
            <div class="add-task-section">
                <div class="add-task-wrapper">
                    <input 
                        type="text" 
                        placeholder="What do you need to get done?" 
                        v-model="taskName" 
                        @keyup.enter="addTask(taskName)"
                        class="add-task-input"
                    >   
                    <button 
                        @click="addTask(taskName)"
                        class="add-task-btn"
                        :disabled="!taskName.trim()"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                        </svg>
                        Add Task
                    </button>
                </div>
            </div>

            <div class="tasks-content">
                <div class="task-section">
                    <div class="section-header">
                        <h2 class="section-title">To Do</h2>
                        <span class="task-count">{{ uncompletedTasks.length }}</span>
                    </div>
                    
                    <div class="task-list" v-if="uncompletedTasks.length > 0">
                        <div 
                            v-for="task in uncompletedTasks" 
                            :key="task.id"  
                            class="task-item"
                        >
                            <div class="task-checkbox" @click="markAsCompleted(task.id)">
                                <svg class="checkbox-icon" width="20" height="20" viewBox="0 0 24 24">
                                    <circle 
                                        cx="12" 
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        fill="none"
                                    />
                                    <transition name="checkmark">
                                        <polyline
                                            v-if="task.showTick"
                                            points="9,12 12,15 15,9"
                                            fill="none"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke="currentColor"
                                        />
                                    </transition>
                                </svg>
                            </div>

                            <div class="task-content">
                                <div class="task-main">
                                    <span class="task-name">{{ task.name }}</span>
                                    <div class="task-meta">
                                        <span v-if="task.timeWorkedOn && task.timeWorkedOn > 0" class="time-worked">
                                            {{ formatWorkTime(task.timeWorkedOn) }} worked
                                        </span>
                                        <span v-if="task.deadline" class="deadline">
                                            Due {{ formatDate(task.deadline) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="task-actions">
                                <div class="calendar-container">
                                       <button 
                                            class="action-btn"
                                            @click="showCalendarPopup(task.id)"
                                            title="Set deadline"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                                            </svg>
                                        </button>
                                        <Calendar 
                                        :id="task.id"
                                        v-if="isCalendarOpen(task.id)"
                                        @deadline-selected="updateDeadline"
                                        @deadline-unselected="handleDeadlineUnselected"
                                        class="calendar-popup"
                                        /> 
                                </div>
                                
                                
                                <div class="dropdown-wrapper">
                                    <button 
                                        class="action-btn"
                                        @click="togglePopup(task.id)"
                                        title="More options"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                                        </svg>
                                    </button>
                                    
                                    <div v-if="String(showPopupId) === task.id" class="dropdown-menu">
                                        <button 
                                            class="dropdown-item"
                                            @click="completeAndClosePopup(task.id)"
                                        >
                                            Mark as completed
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    class="action-btn delete-btn"
                                    @click="removeTask(task.id)"
                                    title="Delete task"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" class="empty-icon">
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                        </svg>
                        <p>No tasks yet</p>
                        <span>Add a task above to get started</span>
                    </div>
                </div>

                <div class="task-section">
                    <div class="section-header">
                        <h2 class="section-title">Completed</h2>
                        <span class="task-count">{{ completedTasks.length }}</span>
                    </div>
                    
                    <div class="task-list" v-if="completedTasks.length > 0">
                        <div 
                            v-for="task in completedTasks" 
                            :key="task.id" 
                            class="task-item completed"
                        >
                            <div class="task-checkbox completed">
                                <svg class="checkbox-icon" width="20" height="20" viewBox="0 0 24 24">
                                    <circle 
                                        cx="12" 
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        fill="currentColor"
                                    />
                                    <polyline
                                        points="9,12 12,15 15,9"
                                        fill="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke="white"
                                    />
                                </svg>
                            </div>

                            <div class="task-content">
                                <span class="task-name">{{ task.name }}</span>
                            </div>

                            <div class="task-actions">
                                <div class="dropdown-wrapper">
                                    <button 
                                        class="action-btn"
                                        @click="togglePopup(task.id)"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                                        </svg>
                                    </button>
                                    
                                    <div v-if="String(showPopupId) === task.id" class="dropdown-menu">
                                        <button 
                                            class="dropdown-item"
                                            @click="unCompleteAndClosePopup(task.id)"
                                        >
                                            Mark as uncompleted
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    class="action-btn delete-btn"
                                    @click="removeTask(task.id)"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" class="empty-icon">
                            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                        </svg>
                        <p>No completed tasks</p>
                        <span>Complete some tasks to see them here</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

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

<style scoped>
    .main-section {
        margin-left: 72px;
        min-height: 100vh;
        background-color: #fafafa;
        transition: margin-left 0.3s ease;
    }

    .tasks-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
    }

    /* Add Task Section */
    .add-task-section {
        margin-bottom: 2rem;
    }

    .add-task-wrapper {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .add-task-input {
        flex: 1;
        height: 48px;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        color: #111827;
        background-color: #ffffff;
        transition: all 0.2s ease;
        outline: none;
    }

    .add-task-input:focus {
        border-color: #6b7280;
        box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
    }

    .add-task-input::placeholder {
        color: #9ca3af;
    }

    .add-task-btn {
        height: 48px;
        padding: 0 1.5rem;
        background-color: #111827;
        color: #ffffff;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
    }

    .add-task-btn:hover:not(:disabled) {
        background-color: #1f2937;
        transform: translateY(-1px);
    }

    .add-task-btn:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
        transform: none;
    }

    .tasks-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    .task-section {
        background-color: #ffffff;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 1.5rem 1rem 1.5rem;
        border-bottom: 1px solid #f3f4f6;
    }

    .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin: 0;
    }

    .task-count {
        background-color: #f3f4f6;
        color: #6b7280;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .task-list {
        padding: 0.5rem;
    }

    .task-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        position: relative;
        z-index: 1;
    }

    .task-item:hover {
        background-color: #f9fafb;
        border-color: #e5e7eb;
    }

    .task-item.completed {
        opacity: 0.7;
    }

    .task-item.completed .task-name {
        text-decoration: line-through;
        color: #6b7280;
    }

    .calendar-container{
        position: relative;
        z-index: 200;
    }

    .calendar-popup{
        position: absolute;
        left: 50%;
        top: calc(100% + 0.rem);
        transform: translateX(-50%);
        z-index: 300;
        background-color: #ffffff;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .task-checkbox {
        margin-top: 0.125rem;
        cursor: pointer;
        color: #6b7280;
        transition: color 0.2s ease;
    }

    .task-checkbox:hover {
        color: #10b981;
    }

    .task-checkbox.completed {
        color: #10b981;
    }

    .checkbox-icon {
        display: block;
    }

    .task-content {
        flex: 1;
        min-width: 0;
    }

    .task-main {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .task-name {
        font-weight: 500;
        color: #111827;
        word-break: break-word;
    }

    .task-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        color: #6b7280;
    }

    .time-worked {
        color: #059669;
        font-weight: 500;
    }

    .deadline {
        color: #dc2626;
        font-weight: 500;
    }

    .task-actions {
        display: flex;
        gap: 0.25rem;
        align-items: flex-start;
    }

    .action-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: none;
        color: #6b7280;
        cursor: pointer;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        background-color: #f3f4f6;
        color: #374151;
    }

    .delete-btn:hover {
        background-color: #fef2f2;
        color: #dc2626;
    }

    .dropdown-wrapper {
        position: relative;
        z-index: 10;
    }

    .dropdown-wrapper:has(.dropdown-menu){
        z-index: 1000;
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        z-index: 100;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        min-width: 160px;
    }

    .dropdown-item {
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        background: none;
        color: #374151;
        font-size: 0.875rem;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
        background-color: #f9fafb;
    }

    .empty-state {
        padding: 3rem 1.5rem;
        text-align: center;
        color: #6b7280;
    }

    .empty-icon {
        margin: 0 auto 1rem auto;
        opacity: 0.5;
    }

    .empty-state p {
        margin: 0 0 0.5rem 0;
        font-weight: 500;
        color: #374151;
    }

    .empty-state span {
        font-size: 0.875rem;
    }

    .checkmark-enter-active {
        transition: all 0.3s ease;
    }

    .checkmark-enter-from {
        opacity: 0;
        transform: scale(0.5);
    }

    @media (max-width: 768px) {
        .main-section {
            margin-left: 0;
        }
        
        .tasks-container {
            padding: 1rem;
        }
        
        .tasks-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        
        .add-task-wrapper {
            flex-direction: column;
            align-items: stretch;
        }
        
        .add-task-btn {
            justify-content: center;
        }
    }

    @media (prefers-color-scheme: dark) {
        .main-section {
            background-color: #111827;
        }

        .task-section {
            background-color: #1f2937;
            border-color: #374151;
        }

        .section-header {
            border-bottom-color: #374151;
        }

        .section-title {
            color: #f9fafb;
        }

        .task-count {
            background-color: #374151;
            color: #9ca3af;
        }

        .add-task-input {
            background-color: #374151;
            border-color: #4b5563;
            color: #f9fafb;
        }

        .add-task-input:focus {
            border-color: #6b7280;
        }

        .task-item:hover {
            background-color: #374151;
            z-index: 10;
        }

        .task-name {
            color: #f9fafb;
        }

        .dropdown-menu {
            background-color: #1f2937;
            border-color: #374151;
        }

        .dropdown-item {
            color: #f9fafb;
        }

        .dropdown-item:hover {
            background-color: #374151;
        }
    }
</style>
