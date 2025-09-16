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

    import { onMounted } from 'vue';
    import { initializeTimer } from '../composables/useGlobalTimer';
    import { loadSettings } from '../composables/settings';

    onMounted(() => {
        console.log('🚀 App mounted, initializing timer...');
        
        const settings = loadSettings();
        const pomodoroTime = settings.pomodoroTime.value;
        console.log(`pomodoro time before intiailization: ${pomodoroTime}`)
        
        
        initializeTimer(
            settings.pomodoroTime.value,
            settings.breakTime.value,
            {
                playPomodoroCompletionSound: settings.playPomodoroCompletionSound,
                playBreakCompletionSound: settings.playBreakCompletionSound,
            }
        );
        
        console.log('✅ Timer initialization complete');
    });

    const updateSettings = function(){
        console.log('🚀 reinitializing timer...');
        
        const settings = loadSettings();
        const pomodoroTime = settings.pomodoroTime.value;
        console.log(`pomodoro time before intiailization: ${pomodoroTime}`)
        
        
        initializeTimer(
            settings.pomodoroTime.value,
            settings.breakTime.value,
            {
                playPomodoroCompletionSound: settings.playPomodoroCompletionSound,
                playBreakCompletionSound: settings.playBreakCompletionSound,
            }
        );
        
        console.log('✅ Timer reinitialization complete');
    }
</script>

<template>
    <Menu :current-view="currentView" @change-view="switchView"/>
    <Header/>
        <div class="app">
            <Home v-if="currentView === 'home'" />
            <Goals v-if="currentView === 'goals'"/>
            <Tasks v-if="currentView === 'tasks'"/>
            <Statistics v-if="currentView === 'statistics'"/>
            <Settings @settings-updated="updateSettings" v-if="currentView === 'settings'"/>
        </div>
    <Footer/>
</template>

<style scoped>
    .app{
        margin-left: 72px;
        background-color: #fafafa;
    }
    @media (max-width: 768px){
        .app{
            margin-left: 64px;
        }
    }
</style>

