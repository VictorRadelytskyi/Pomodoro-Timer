<template>
    <div class="main-section"> 
        <div class="home-container">
            <BindToTask @task-selected="bindTimerToTask" />
            
            <div class="timer-section">
                <Timer ref="timerRef" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Timer from './Timer.vue';
    import BindToTask from './BindToTask.vue';
    import type {Task} from '../../composables/useTasks';
    import {ref, nextTick} from 'vue';
    
    const timerRef = ref<InstanceType<typeof Timer>>();

    const bindTimerToTask = async function(task: Task){
        // Wait before the Timer component is mounted 
        await nextTick();

        if (timerRef.value && timerRef.value.bindTask){
            timerRef.value.bindTask(task);
        } else{
            console.warn('Timer component not ready yet');
        }
    }
</script>

<style scoped>
    .main-section {
        margin-left: 72px;
        min-height: 100vh;
        background-color: #fafafa;
        transition: margin-left 0.3s ease;
        padding-top: 2rem; /* Add top padding since we removed header */
    }

    .home-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .timer-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .main-section {
            margin-left: 0;
            padding-top: 1rem;
        }
        
        .home-container {
            padding: 1rem;
            gap: 1.5rem;
        }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .main-section {
            background-color: #111827;
        }
    }

    /* Animation for smooth loading */
    .home-container {
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>