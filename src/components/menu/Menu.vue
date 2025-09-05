<template>
    <nav class="nav-menu">
        <!-- Menu toggle button -->
        <div class="menu-toggle" @click="changeVisibility">
            <svg class="menu-icon" :class="{ 'rotated': menuVisible }" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
            </svg>
        </div>

        <!-- Menu items with slide transition -->
        <transition name="slide-fade">
            <div class="nav-menu-content" v-if="menuVisible">
                <div class="nav-menu-items">
                    <div 
                        v-for="item in menuItems" 
                        :key="item.view"
                        @click="$emit('change-view', item.view)" 
                        class="nav-menu-item"
                        :class="{ 'active': currentView === item.view }"
                        :title="item.label"
                    >
                        <div class="nav-menu-icon" v-html="item.icon"></div>
                        <span class="nav-menu-label">{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </transition>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const menuVisible = ref(true);

defineProps<{
    currentView?: string;
}>();

// Menu items with direct SVG strings
const menuItems = ref([
    {
        view: 'home',
        label: 'Home',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
               </svg>`
    },
    {
        view: 'tasks',
        label: 'Tasks',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z"/>
               </svg>`
    },
    // {
    //     view: 'goals',
    //     label: 'Goals',
    //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    //             <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21A7,7 0 0,1 14,26H10A7,7 0 0,1 3,19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M12,4.5A0.5,0.5 0 0,0 11.5,4A0.5,0.5 0 0,0 12,3.5A0.5,0.5 0 0,0 12.5,4A0.5,0.5 0 0,0 12,4.5Z"/>
    //            </svg>`
    // },
    // {
    //     view: 'statistics',
    //     label: 'Stats',
    //     icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    //             <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/>
    //            </svg>`
    // },
    {
        view: 'settings',
        label: 'Settings',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
               </svg>`
    }
]);

const changeVisibility = () => {
    menuVisible.value = !menuVisible.value;
};

defineEmits<{
    'change-view': [view: string];
}>();
</script>

<style scoped>
.nav-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 72px;
    height: 100vh;
    background-color: #ffffff;
    border-right: 1px solid #e5e7eb;
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow: hidden;
}

.menu-toggle {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    transition: all 0.2s ease;
}

.menu-toggle:hover {
    background-color: #f3f4f6;
}

.menu-icon {
    color: #6b7280;
    transition: transform 0.3s ease;
}

.menu-icon.rotated {
    transform: rotate(90deg);
}

.nav-menu-content {
    padding: 0.5rem 0;
}

.nav-menu-items {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.nav-menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    margin: 0 8px;
    border-radius: 12px;
    color: #6b7280; 
}

.nav-menu-item:hover {
    background-color: #f9fafb;
    color: #374151;
}

.nav-menu-item.active {
    background-color: #111827;
    color: #ffffff;
}

.nav-menu-item.active::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 24px;
    background-color: #111827;
    border-radius: 0 2px 2px 0;
}

.nav-menu-icon {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-menu-label {
    font-size: 0.6875rem;
    font-weight: 500;
    text-align: center;
    line-height: 1;
    letter-spacing: 0.025em;
}

/* Transitions */
.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.2s ease;
}

.slide-fade-enter-from {
    transform: translateY(-10px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(-5px);
    opacity: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .nav-menu {
        background-color: #1f2937;
        border-right-color: #374151;
    }

    .menu-toggle {
        background-color: #374151;
        border-bottom-color: #4b5563;
    }

    .menu-toggle:hover {
        background-color: #4b5563;
    }

    .menu-icon {
        color: #9ca3af;
    }

    .nav-menu-item {
        color: #9ca3af;
    }

    .nav-menu-item:hover {
        background-color: #374151;
        color: #f9fafb;
    }

    .nav-menu-item.active {
        background-color: #f9fafb;
        color: #111827;
    }

    .nav-menu-item.active::before {
        background-color: #f9fafb;
    }
}

/* Responsive adjustments */
@media (max-height: 600px) {
    .nav-menu-item {
        height: 52px;
    }
    
    .nav-menu-label {
        font-size: 0.625rem;
    }
}
</style>