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
        height: auto;
        padding: 10px 0 10px 0;
        border: 1px solid;
        box-shadow: 1px 1px 1px green;
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

    .pomodoro-session-cont > h4{
        margin: 10px 0 10px 0;
    }
</style>