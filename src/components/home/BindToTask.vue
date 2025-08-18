<template>  
    <div class="bind-to-task">
        <input 
            type="text" 
            placeholder="What task are you working on?"
            id="task-info"
            class="bind-to-task-input"
            v-model="searchTerm"
        />
        <div class="show-tasks">
            <img 
                src="/src/assets/arrow-down-angle.svg" 
                width="20px" 
                height="20px" 
                class="task-control-image"
                @click="toggleDropdown"
            >
        </div>

        <div v-if="showDropdown" class="tasks-dropdown">
            <ol>
                <li v-for="task in uncompletedTasks" 
                class="dropdown-task" 
                @click="selectTask(task)"
                >{{task.name}}</li>
            </ol>

        </div>
    </div>
</template>

<style scoped>
    .bind-to-task{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0 5px 10px 5px;
        position: relative;
    }

    .bind-to-task-input{
        width: 100%;
        height: 30px;
    }

    .show-tasks{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 10px;
    }

    .tasks-dropdown{
        position: absolute;
        width: 98.8%;
        top: 100%;
        left: 0;
        z-index: 10;
        border: 1px solid black;
        background-color: #f1f1f1;
        padding: 5px 10px 5px 0px;
        margin: 0px;
    }

    .tasks-dropdown ol{
        margin: 0;
        margin-left: 20px;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .dropdown-task{
        padding: 8px 5px 8px 10px;
        border: 1px solid black;
    }   

    .dropdown-task:hover{
        cursor: pointer;
        background-color: #fcfcfc;
    }  

</style>

<script setup lang="ts">
    import {ref} from 'vue';
    
    const searchTerm = ref<string>('');
    const showDropdown = ref<boolean>(false);
    import type {Task} from '../../composables/useTasks';
    import {useTasks} from '../../composables/useTasks';

    const {
        uncompletedTasks
    } = useTasks();

    const toggleDropdown = function(){
        showDropdown.value = !showDropdown.value;
    }

    const emit = defineEmits<{
        'task-selected': [task: Task]
    }>();

    const selectTask = function(task: Task){
        searchTerm.value  = task.name;
        showDropdown.value = false;
        
        emit('task-selected', task);
    }

</script>