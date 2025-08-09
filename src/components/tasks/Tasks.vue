<template>
    <div class="task-cont main-section">
        <div class="add-mgmt-cont">
            <input type="text" placeholder="Enter task name" v-model="taskName" @keyup.enter="addTask">   
            <button class="task-mgmt-button" @click="addTask">Add task</button>
        </div>
        <div class="task-list-cont">
            <ol id="tasks" class="task-list">
                <li v-for="(task, idx) in tasks" :key="idx" class="task-item">
                    <div class="task-item-cont">
                        <p>{{task}}</p>
                        <div class="task-mgmt-controls">
                            <div class="three-dots-wrapper">
                                <div class="task-config-popup" v-if="showPopup">
                                    <p>this is task config</p>
                                </div>
                                <img src="/src/assets/three-dots-vertical.svg" @click="togglePopup" alt="Context Menu">
                            </div>
                            <img src="/src/assets/trash.svg" @click="removeTask(idx)" alt="Delete item">
                        </div>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</template>

<style>
    .task-list-cont{
        border: 1px solid black;
        box-shadow: 1px 1px 2px green;
    }

    .task-list{
        border: 1px outset pink;
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

    .task-item-cont img:hover{
        cursor: pointer;
        background-color: lch(51.31% 0.4 18.49);
        transition: 0.2s;
        border-radius: 50%;
    }

</style>

<script setup lang="ts">
    import {ref, watch, onMounted} from 'vue';
    const taskName = ref<string>('');
    const tasks = ref<string[]>([]);
    const showPopup = ref<boolean>(false);

    const addTask = function(){
        const trimmed = taskName.value.trim();
        if(trimmed === ''){
            alert('A task can\'t be empty');
        }
        tasks.value.push(trimmed);
        taskName.value = '';
    }

    const removeTask = function(idx: number){
        tasks.value.splice(idx, 1);
    }

    // const openPopup = function(){
    //     showPopup.value = true;
    // }

    // const closePopup = function(){
    //     showPopup.value = false;
    // }

    const togglePopup = function(){
        showPopup.value = !showPopup.value;
    }
    
    onMounted(()=>{
        const saved = localStorage.getItem('tasks');
        if(saved){
            tasks.value = JSON.parse(saved);
        }
    });

    watch(tasks, (newTasks)=>{
        const stringifiedTasks = JSON.stringify(newTasks);
        console.log(stringifiedTasks);
        localStorage.setItem('tasks', stringifiedTasks);
    }, {deep: true})

</script>
