<script setup lang="ts">
    import Menu from './menu/Menu.vue';
    import Header from './header/Header.vue';
    import Footer from './footer/Footer.vue';
    import Home from './home/Home.vue';
    import Tasks from './tasks/Tasks.vue';
    import Goals from './goals/Goals.vue';
    import Statistics from './statistics/Statistics.vue';
    import Settings from './settings/Settings.vue';

    import {ref} from 'vue';
    const currentView = ref('home');
    const switchView = function(view: string){
        currentView.value = view;
    }
</script>

<template>
    <Menu :current-view="currentView" @change-view="switchView"/>
    <Header/>
        <Home v-if="currentView === 'home'" class="main-section"/>
        <Goals v-if="currentView === 'goals'"/>
        <Tasks v-if="currentView === 'tasks'"/>
        <Statistics v-if="currentView === 'statistics'"/>
        <Settings v-if="currentView === 'settings'"/>
    <Footer/>
</template>

