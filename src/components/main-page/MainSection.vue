<template>
    <div class="main-section"> 
        <div class="pomodoro-session-cont horizontal-centralize down-flex">
            <h4 class="strip-boundaries">Pomodoro Session</h4>
            <Timer/>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Timer from './Timer.vue'
</script>

<style>
    .pomodoro-session-cont{
        background-color: #FFEDFF;
        width: 451px;
        height: 428px;
    }
    .main-section{
        margin-left: 72px;
        padding: 15px 0 15px 0;
        background: #FFF3F3;
    }
    .horizontal-centralize{
        margin-left: auto;
        margin-right: auto;
    }
    .down-flex{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .strip-boundaries{
        padding: 0;
        margin: 0;
    }
</style>