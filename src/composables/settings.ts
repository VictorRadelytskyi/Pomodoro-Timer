let pomodoroTime = 25*60;
let breakTime = 5*60;

function updatePomodoroTime(durationInSec: number){
    pomodoroTime = durationInSec;
}

function updateBreakTime(durationInSec: number){
    breakTime = durationInSec;
}

export const loadSettings = function(){
    return {
        pomodoroTime,
        breakTime,
        updatePomodoroTime,
        updateBreakTime,
        soundEffectOnPomodoroCompletion: true,
        soundEffectOnTaskCompletion: true
    }
}