<template>
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
            opacity="0.7"
        />
    </svg>
    <p class="time-left">{{minutes}}:{{seconds.toString().padStart(2, "0")}}</p>
    <button @click="updateTimer">{{timerState}}</button>
    <div class="input-group" style="display: none;">
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
    const seconds = computed(()=>timeLeft.value%60);
    const isRunning = ref(false);
    const timerState = ref("Start Session");
    const angleDeg = computed(()=>360*(pomodoroTime-timeLeft.value)/pomodoroTime)
    

    //an ID of the interval which updates timeLeft each second
    let updateTimerInterval: number | undefined = undefined;
    const startTimer = function(){
        updateTimerInterval = setInterval(function(){
            if(timeLeft.value > 0){
                timeLeft.value--;
            } else{
                stopTimer();
            }
        }, 1000);
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
</script>