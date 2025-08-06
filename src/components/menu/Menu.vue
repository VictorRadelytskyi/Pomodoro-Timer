<template>
    <nav class="nav-menu">
        <ul class="nav-menu-list">
            <li>
                <div class="nav-menu-item-cont" v-on:click="changeVisibility">
                    <img src="/src/assets/menu.png">
                </div>
            </li>
        </ul>
        <transition name="fade">
            <ul class="nav-menu-list" v-if="menuVisible">
                <li>
                    <div class="nav-menu-item-cont">
                        <img src="/src/assets/pomodoro.png">
                        <p>Home</p>
                    </div>
                </li>
                <li>
                    <div class="nav-menu-item-cont">
                        <img src="/src/assets/tasks.png">
                        <p>Tasks</p>
                    </div>
                </li>
                <li>
                    <div class="nav-menu-item-cont">
                        <img src="/src/assets/goals.png">
                        <p>Goals</p>
                    </div>
                </li>
                <li>
                    <div class="nav-menu-item-cont">
                        <img src="/src/assets/statistics.png">
                        <p>Statistics</p>
                    </div>
                </li>
                <li>
                    <div @click="placeholderFunc()" class="nav-menu-item-cont">
                        <img src="/src/assets/settings.png">
                        <p>Settings</p>
                    </div>
                </li>
            </ul>
        </transition>
    </nav>
</template>

<style scoped>
    nav.nav-menu{
        position: fixed;
        top: 0;
        left: 0;
        background-color: #FFE5FF;
        width: 72px;
    }

    .nav-menu-list{
        width: 100%;
        padding: 0;
        margin-bottom: 0;
    }

    .nav-menu-list > li{
        list-style-type: None;
        overflow: hidden;
        width: 100%;
    }

    .nav-menu-item-cont{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 75%;
        padding-top: 5%;
        margin-bottom: 25%; 
    }

    .nav-menu-item-cont:hover{
        background-color: green;
        transition: 0.5s;
    }

    .nav-menu-item-cont > img {
        width: 24px;
        height: 24px;
        object-fit: contain; 
    }

    .nav-menu-item-cont > p {
        flex: 0 0 25%;
        margin: 0px 3px 3px;
        text-align: center;
    }

    .nav-menu-item-cont > p:last-child{
        padding-bottom: 0;
        margin-bottom: 0;
    }
    .nav-menu-list > .nav-menu-item-cont:last-child{
        margin-bottom: 0;
    }

    .fade-enter-active, .fade-leave-active{
        transition: opacity 1s;
    }

    .fade-enter-to, .fade-leave-from{
        opacity: 1;
    }

    .fade-enter-from, .fade-leave-to{
        opacity: 0;
    }
</style>

<script setup lang="ts">
    import {ref} from 'vue';
    const menuVisible = ref(true);

    let changeVisibility = function(){
        menuVisible.value = !menuVisible.value;
    }

    let placeholderFunc = function(){
        alert('This feature is not implemented yet');
    }
</script>