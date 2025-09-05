<template>
    <div class="settings-menu">
        <div class="settings-menu-list">
            <div
            v-for="category of settingsCategories" 
            :key="category.id"
            class="settings-category"
            :class="{'active': activeCategory === category.id}"
            @click="setActiveCategory(category.id)"
            >
                <div class="category-icon">
                    <svg width="16px" height="16px" viewBox="0 0 24 24">
                        <path :d="category.icon"></path>
                    </svg>
                </div>
                <div class="category-name">
                    {{ category.name }}
                </div>
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const activeCategory = ref<string>('timer');

interface SettingsCategory{
    id: string;
    name: string;
    icon: string;
}

const settingsCategories: SettingsCategory[] = [
    {
        id: 'timer',
        name: 'Timer Settings',
        icon: 'M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z'
    }, 
    {
        id: 'sounds',
        name: 'Sounds',
        icon: 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z'
    }
]

const setActiveCategory = function(categoryId: string){
    activeCategory.value = categoryId;
}

</script>

<style scoped>

.settings-menu{
    position: fixed;
    height: 100vh;
    margin: 0 0 0 72px; 
    padding: 0.5rem 0;
    width: 72px;
    background-color: #ffffff;
    border-right: 1px solid #e5e7eb;
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.15);
}

.settings-menu-list{
    display: flex;
    flex-direction: column;
}

.settings-category{
    font-weight: 400;
    height: 60px;
    margin: 0 8px;
    border-radius: 12px;
    font-size: 0.775rem;
    color: #464646;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}

.settings-category:hover{
    background-color: #f9f9f9;
    font-weight: 500;
    color: #0f0f0f;
    transition: all ease 0.2s;
    cursor: pointer;
}

.category-name{
    text-align: center;
}

.settings-category.active{
    background-color: #2e2e2e;
    color: #f5f5f5;
}

.settings-category.active::before{
    content: '';
    width: 3px;
    height: 24px;
    background-color: #2e2e2e;
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
}

</style>
