<template>  
    <div class="bind-to-task">
        <div class="input-wrapper">
            <input 
                type="text" 
                placeholder="What task are you working on?"
                id="task-info"
                class="bind-to-task-input"
                v-model="searchTerm"
                @focus="showDropdown = true"
            />
            <button 
                class="dropdown-toggle"
                @click="toggleDropdown"
                :class="{ 'active': showDropdown }"
            >
                <svg class="dropdown-icon" :class="{ 'rotated': showDropdown }" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
            </button>
        </div>

        <transition name="dropdown-slide">
            <div v-if="showDropdown" class="tasks-dropdown">
                <div class="dropdown-header">
                    <span class="dropdown-title">Select a task</span>
                    <button class="close-btn" @click="showDropdown = false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="dropdown-content">
                    <div v-if="uncompletedTasks.length === 0" class="no-tasks">
                        <p>No uncompleted tasks available</p>
                        <small>Create some tasks first!</small>
                    </div>
                    
                    <div v-else class="task-list">
                        <div 
                            v-for="task in filteredTasks" 
                            :key="task.id"
                            class="dropdown-task" 
                            @click="selectTask(task)"
                        >
                            <div class="task-info">
                                <span class="task-name">{{ task.name }}</span>
                                <span class="task-meta">{{ formatTime(task.timeWorkedOn) }} worked</span>
                            </div>
                            <div class="task-priority" :class="`priority-${task.priority || 'medium'}`"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Overlay for mobile -->
        <div v-if="showDropdown" class="dropdown-overlay" @click="showDropdown = false"></div>
    </div>
</template>

<script setup lang="ts">
    import {ref, computed} from 'vue';
    import type {Task} from '../../composables/useTasks';
    import {useTasks} from '../../composables/useTasks';

    const searchTerm = ref<string>('');
    const showDropdown = ref<boolean>(false);

    const {
        uncompletedTasks
    } = useTasks();

    const filteredTasks = computed(() => {
        if (!searchTerm.value.trim()) {
            return uncompletedTasks.value;
        }
        return uncompletedTasks.value.filter(task => 
            task.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    });

    const toggleDropdown = function(){
        showDropdown.value = !showDropdown.value;
    }

    const emit = defineEmits<{
        'task-selected': [task: Task]
    }>();

    const selectTask = function(task: Task){
        searchTerm.value = task.name;
        showDropdown.value = false;
        emit('task-selected', task);
    }

    // Format time helper
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: Event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.bind-to-task')) {
            showDropdown.value = false;
        }
    }

    // Add event listener when component mounts
    import { onMounted, onUnmounted } from 'vue';
    
    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<style scoped>
    .bind-to-task {
        position: relative;
        margin-bottom: 1.5rem;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .bind-to-task-input {
        width: 100%;
        height: 48px;
        padding: 0.75rem 3rem 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        color: #111827;
        background-color: #ffffff;
        transition: all 0.2s ease;
        outline: none;
    }

    .bind-to-task-input:focus {
        border-color: #6b7280;
        box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
    }

    .bind-to-task-input::placeholder {
        color: #9ca3af;
        font-weight: 400;
    }

    .dropdown-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border: none;
        background: none;
        color: #6b7280;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .dropdown-toggle:hover {
        background-color: #f3f4f6;
        color: #374151;
    }

    .dropdown-toggle.active {
        color: #111827;
    }

    .dropdown-icon {
        transition: transform 0.2s ease;
    }

    .dropdown-icon.rotated {
        transform: rotate(180deg);
    }

    .tasks-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        z-index: 1000;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        max-height: 300px;
    }

    .dropdown-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
    }

    .dropdown-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
    }

    .close-btn {
        border: none;
        background: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .close-btn:hover {
        background-color: #e5e7eb;
        color: #374151;
    }

    .dropdown-content {
        max-height: 240px;
        overflow-y: auto;
    }

    .no-tasks {
        padding: 2rem 1rem;
        text-align: center;
        color: #6b7280;
    }

    .no-tasks p {
        margin: 0 0 0.5rem 0;
        font-weight: 500;
    }

    .no-tasks small {
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .task-list {
        padding: 0.25rem 0;
    }

    .dropdown-task {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 1px solid #f3f4f6;
    }

    .dropdown-task:last-child {
        border-bottom: none;
    }

    .dropdown-task:hover {
        background-color: #f9fafb;
    }

    .task-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .task-name {
        font-weight: 500;
        color: #111827;
        font-size: 0.875rem;
    }

    .task-meta {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .task-priority {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .priority-high {
        background-color: #ef4444;
    }

    .priority-medium {
        background-color: #f59e0b;
    }

    .priority-low {
        background-color: #10b981;
    }

    .dropdown-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background: transparent;
    }

    /* Transitions */
    .dropdown-slide-enter-active {
        transition: all 0.3s ease;
    }

    .dropdown-slide-leave-active {
        transition: all 0.2s ease;
    }

    .dropdown-slide-enter-from {
        opacity: 0;
        transform: translateY(-10px);
    }

    .dropdown-slide-leave-to {
        opacity: 0;
        transform: translateY(-5px);
    }

    @media (max-width: 768px) {
        .tasks-dropdown {
            position: fixed;
            top: 50%;
            left: 1rem;
            right: 1rem;
            transform: translateY(-50%);
            max-height: 400px;
        }
    }

    @media (prefers-color-scheme: dark) {
        .bind-to-task-input {
            background-color: #374151;
            border-color: #4b5563;
            color: #f9fafb;
        }

        .bind-to-task-input:focus {
            border-color: #6b7280;
            box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.2);
        }

        .bind-to-task-input::placeholder {
            color: #9ca3af;
        }

        .tasks-dropdown {
            background-color: #1f2937;
            border-color: #374151;
        }

        .dropdown-header {
            background-color: #374151;
            border-bottom-color: #4b5563;
        }

        .dropdown-title {
            color: #f9fafb;
        }

        .dropdown-task:hover {
            background-color: #374151;
        }

        .task-name {
            color: #f9fafb;
        }

        .task-meta {
            color: #9ca3af;
        }
    }
</style>