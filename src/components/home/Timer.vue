<template>
    <div class="timer-svg">
        <svg :width="svgWidth" :height="svgHeight">
        <!-- clock-->
        <circle 
            :cx="cx"
            :cy="cy"
            :r="r"
            :fill="fill"
            :stroke-width="circleStrokeWidth"
            :stroke="circleColor"
        />
        <!-- hour marks -->
        <g>
            <line v-for="(mark, idx) in marks"
                :key="idx"
                :x1="mark.x1"
                :x2="mark.x2"
                :y1="mark.y1"
                :y2="mark.y2"
                :stroke="mark.color"
                :stroke-width="mark.strokeWidth"
            />
        </g>

        <!-- center dot -->
         <circle :cx="cx" :cy="cy" :r="4" :fill="circleColor" stroke="cicleColor"/>

        <!--filling area-->
        <path
            :d="drawPie(cx, cy, r-1, angleDeg)"
            fill="lightgreen"
            opacity="0.85"
        />
    </svg>
    </div>
    <div class="time-left">
        <span class="time-display">Time left: {{minutes}}:{{seconds.toString().padStart(2, "0")}}</span>
    </div> 
    <Transition name="fade" v-if="!isPaused">
        <button id="timerButton" class="control-button" @click="updateTimer">{{timerState}}</button>
    </Transition>
    <Transition v-else>
        <button id="resumeButton" class="control-button" @click="resumeTimer">
            Resume Timer
        </button>
    </Transition>
    <Transition name="fade">
        <button id="pauseButton" class="control-button" v-show="isRunning" @click="pauseTimer">
            Pause Timer
        </button>
    </Transition>
    <div class="input-group">
        <label for="timer-update">Update time left [seconds left]</label>
        <input 
        min="1" 
        :max= "pomodoroTime" 
        type="number" 
        id="timer-update" 
        @change="setTimeLeft"
        v-model.number="inputSeconds"
        />
    </div>
</template>

<script setup lang="ts">
    import {ref, computed} from 'vue'
    const svgWidth = 295;
    const svgHeight = 291;
    const cx = 147.5;
    const cy = 145.5;
    const r = 143; 
    const fill: string = "none";
    const circleStrokeWidth = 5;
    const circleColor: string = "#42b983";

    const pomodoroTime = 25*60;
    const timeLeft = ref(pomodoroTime);
    const minutes = computed(()=>Math.floor(timeLeft.value/60));
    const seconds = computed(()=>Math.round(timeLeft.value%60));
    const isRunning = ref(false);
    const isPaused = ref(false);
    const timerState = ref("Start Session");
    const angleDeg = computed(()=>360*(pomodoroTime-timeLeft.value)/pomodoroTime);
    import type {Task} from '../../composables/useTasks';
    import {useTasks} from '../../composables/useTasks';
    const {updateTimeWorkedOn, playSoundOnPomodoroCompletion} = useTasks();
    const taskWorkingOn = ref<Task | null>(null);
    
    //an ID of the interval which updates timeLeft each second
    let updateTimerInterval: number | undefined = undefined;
    let lastUpdateTime = Date.now();

    //think of how to make the time update more synchronized
    const startTimer = function(){
        lastUpdateTime = Date.now(); //reset timer reference
        updateTimerInterval = setInterval(function(){
            if(timeLeft.value > 0){
                const now = Date.now();
                const timeSinceLastUpdate = (now-lastUpdateTime)/1000;
                if (timeSinceLastUpdate >= 1){
                    timeLeft.value-=timeSinceLastUpdate;
                    if(taskWorkingOn.value){
                        updateTimeWorkedOn(taskWorkingOn.value, timeSinceLastUpdate);
                    }
                    lastUpdateTime = now;
                }
            } else{
                console.log('Pomodoro completed');
                playSoundOnPomodoroCompletion();
                stopTimer();
            }
        }, 250);
        isRunning.value = true;
        timerState.value = "Stop Session";
    }

    const stopTimer = function(){
        if(updateTimerInterval){
            clearInterval(updateTimerInterval);
            updateTimerInterval = undefined;
        }
        isRunning.value = false;
        timeLeft.value = 25*60;
        timerState.value = "Start Session";
    }

    const updateTimer = function(){
        if(!isRunning.value){
            startTimer();
        }
        else{
            stopTimer();
        }
    }

    const pauseTimer = function(){
        if(updateTimerInterval){
            clearInterval(updateTimerInterval);
            updateTimerInterval = undefined;
        }
        isPaused.value = true;
        isRunning.value = false;
    }

    const resumeTimer = function(){
        startTimer();
        isPaused.value = false;
    }

    const generateLine = function(cx: number, cy: number, angle: number, length: number, strokeWidth: number, color: string = "#42b983") {
        const x1 = cx + r*Math.cos(angle);
        const y1 = cy + r*Math.sin(angle);
        const x2 = cx + (r-length)*Math.cos(angle);
        const y2 = cy + (r-length)*Math.sin(angle);
        //console.log({x1, y1, x2, y2, strokeWidth, color});
        return {x1, y1, x2, y2, strokeWidth, color};
    }

    const markHour = function(hour: number){
        if(hour<0 || hour>12){
            throw new RangeError("the hour should be an integer number between 0 and 12");
        }
        if (!Number.isInteger(hour)){
            throw new TypeError("the hour should be an integer number between 0 and 12");
        }
        const angle = Math.PI*(hour/6);
        if(hour%3 ==0){
            return generateLine(cx, cy, angle, 40, 6);
        }
        else{
            return generateLine(cx, cy, angle, 30, 4);
        }
    }

    const marks = Array.from({length: 12}, (_, hour) =>{
        return markHour(hour);
    })

    const polarToCartesian = function(cx: number, cy: number, r: number, angleDeg: number): [number, number]{
        const angleRad = (angleDeg-90)*Math.PI/180;
        return [cx+r*Math.cos(angleRad), cy+r*Math.sin(angleRad)];
    }

    const drawPie = function(cx: number, cy: number, r: number, angle: number): string{
        const [x1, y1] = polarToCartesian(cx, cy, r, 0);
        const [x2, y2]  = polarToCartesian(cx, cy, r, angle);
        const largeArcFlag = angle >= 180 ? 1 : 0;
        const returnString = [`M ${cx} ${cy}`, `L ${x1} ${y1}`, `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(" ");
        //console.log(returnString);
        return returnString;
    }

    const inputSeconds = ref(timeLeft.value);

    const setTimeLeft = function(){
        if(isRunning.value){
            timeLeft.value = inputSeconds.value;
        }
    }

    const bindTask = function(task: Task){
        taskWorkingOn.value = task;
        console.log(`task with id: ${task.id} has been bounded`);
    }

    defineExpose({
        bindTask
    });

</script>

<style scoped>
    .control-button{
        margin-top: 5px;
        margin-bottom: 5px;
        border: 1px solid;
        border-radius: 5px;
        padding: 10px 20px 10px 20px;
        background-color: #AFDEB8;
    }

    .control-button:hover{
        background-color: rgb(87, 254, 87);
        transition: 0.3s;
        cursor: pointer;
        box-shadow: 0 0 2px green;
    }

    .timer-svg{
        border: 0px inset pink;
        box-shadow: 0px 0px 4px rgba(0,0,0,0.1);
        padding: 5px;
    }

    .time-left{
        margin: 10px 0 10px 0;
        padding: 15px 30px 15px 30px;
        background-color: #FFC5BC;
        border-radius: 3px;
        border: 1px solid;
        box-shadow: 0 0 2px green;
    }

    .time-display{
        font-size: 22px;
        font-weight: bold;
    }

    .fade-enter-active, .fade-leave-active{
        transition: opacity 0.5s;
    }
    
    .fade-leave-to, .fade-enter-from{
        opacity: 0;
    }

    .fade-enter-to, .fade-leave-from{
        opacity: 1;
    }

</style>