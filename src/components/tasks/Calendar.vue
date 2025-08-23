<template>
    <div class="calendar-popup">
        <div class="calendar-navigation">
            <img 
                src="/src/assets/arrow-left.svg"
                class="task-control-image previous-month"
                alt="previous month"
                width="24px"
                height="24px"
                @click="changeMonth(-1)"
            >

            <input 
                class="date-search"
                placeholder="MM-DD-YEAR"
                type="text"
                v-model="searchedDate"
            >

            <img 
                src="/src/assets/arrow-right.svg"
                class="task-control-image next-month"
                alt="next month"
                width="24px"
                height="24px"
                @click="changeMonth(1)"
            >
        </div>

        <div class="select-date-UI">
            <div class="date-grid">
                <div class="days-of-week">
                    <span v-for="day in daysOfWeek" class="day-of-week">{{day}}</span>
                </div>
                <div v-for="(dayRow, rowIndex) in dayRows" class="day-row">
                    <span 
                    v-for="(day, dayIndex) in dayRow" 
                    class="day" 
                    :class="{
                        'prev-month': isPreviousMonth(rowIndex, dayIndex),
                        'next-month': isNextMonth(rowIndex, dayIndex),
                        'current-month': isCurrentMonth(rowIndex, dayIndex),
                        'selected': isSelectedDay(day, rowIndex, dayIndex)
                    }"
                    @click="selectDate(day, rowIndex, dayIndex)">
                        {{day}} 
                    </span>
                </div>
            </div>

            <div class="selected-date">
                <span v-if="dateIsSelected">Selected: {{selectedDateStr}}</span>
                <span v-else>{{monthShortcut(currentMonth)}} {{currentYear}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, computed, watch} from 'vue';
    const searchedDate = ref<string>('');
    const dateIsSelected = ref<boolean>(false);
    const currentMonth = ref<number>(new Date().getMonth()+1);
    const currentYear = ref<number>(new Date().getFullYear());
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'Wd', 'Th', 'Fr', 'St'];
    const selectedDateStr = ref<string>('');

    const parseDate = function(input: string): ParsedDate {
        if (!input.trim()) {
            var now = new Date();
            return {
                day: now.getDate(),
                month: now.getMonth()+1,
                year: now.getFullYear(),
                dayOfWeek: now.getDay()
            }
        }

        // Handle MM-DD-YYYY format specifically
        const mmddyyyy = input.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (mmddyyyy) {
            const month = parseInt(mmddyyyy[1]);
            const day = parseInt(mmddyyyy[2]);
            const year = parseInt(mmddyyyy[3]);
            
            // Validate ranges
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
                // Check if date actually exists
                const testDate = new Date(year, month - 1, day);
                if (testDate.getDate() === day && testDate.getMonth() === month - 1) {
                    return {
                        day: day,
                        month: month,
                        year: year,
                        dayOfWeek: testDate.getDay()
                    }
                }
            }
        }

        // Fallback to Date.parse
        try {
            const timestamp = Date.parse(input);
            if (!isNaN(timestamp)) {
                const date = new Date(timestamp);
                return {
                    day: date.getDate(),
                    month: date.getMonth()+1,
                    year: date.getFullYear(),
                    dayOfWeek: date.getDay()
                }
            }
        } catch (err) {
            console.warn("Can't parse the date");
        }
        
        // Return current date as fallback
        var now = new Date();
        return {
            day: now.getDate(),
            month: now.getMonth()+1,
            year: now.getFullYear(),
            dayOfWeek: now.getDay()
        }
    }

    type ParsedDate = {
        day: number,
        month: number,
        year: number,
        dayOfWeek: number
    };

    const date = computed(()=>parseDate(searchedDate.value));
    const dayRows = computed(()=>{
        const year = currentYear.value;
        const month = currentMonth.value;

        const firstDay = new Date(year, month-1, 1).getDay();
        const daysToPrepend = firstDay;
        console.log(`first day: ${firstDay}`);

        const monthLength = new Date(year, month, 0).getDate()
        console.log(`month length: ${monthLength}`);

        const lastDay = new Date(year, month, 0).getDay();
        console.log(`last day: ${lastDay}`);
        let daysToAppend = 0;
        if(lastDay < 6){
            daysToAppend = 6-lastDay;
        }

        const dayNums = [];
        
        const prevMonthLength = new Date(year, month-1, 0).getDate();
        for (let i = daysToPrepend - 1; i >= 0; i--) {
            dayNums[daysToPrepend - 1 - i] = prevMonthLength - i;
        }

        for (let i=0; i<monthLength; i++){
            dayNums[i+daysToPrepend] = i+1;
        }

        for (let i=0; i<daysToAppend; i++){
            dayNums[i+daysToPrepend+monthLength] = i+1;
            console.log(`appended ${dayNums[i+daysToPrepend+monthLength]}`);
        }

        const rows = []; 

        for (let i=0; i<dayNums.length; i+=7){
            rows.push(dayNums.slice(i, i+7));
        }

        console.log(`dateRows: ${rows}`);
        return rows;
    })

    const monthShortcut = (monthNum: number): string => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNum - 1] || '';
    }

    const changeMonth = function(delta: number) {
        if(Math.abs(delta)>11){
            throw Error(`the month change parameter delta: ${delta} should be an integer number from -11 to 11`);
        }
        let newMonth = currentMonth.value + delta;
        let newYear = currentYear.value;
        
        if (newMonth > 12) {
            newMonth -= 12;
            newYear++;
        } else if (newMonth < 1) {
            newMonth += 12;
            newYear--;
        }
        
        currentMonth.value = newMonth;
        currentYear.value = newYear;
    };

    const isPreviousMonth = function(rowIndex: number, dayIndex: number): boolean{
        const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay();
        const flatIndex = rowIndex*7 + dayIndex;
        return flatIndex < firstDay;
    }

    const isNextMonth = function(rowIndex: number, dayIndex: number): boolean{
        const firstDay = new Date(currentYear.value, currentMonth.value-1, 1).getDay();
        const monthLength = new Date(currentYear.value, currentMonth.value, 0).getDate();
        const flatIndex = rowIndex*7 + dayIndex;
        return flatIndex >= firstDay + monthLength;
    }

    const isCurrentMonth = function(rowIndex: number, dayIndex: number): boolean{
        return !isPreviousMonth(rowIndex, dayIndex) && !isNextMonth(rowIndex, dayIndex);
    }

    const isSelectedDay = (day: number, rowIndex: number, dayIndex: number): boolean => {
        if (!dateIsSelected.value) return false;
        
        const parts = selectedDateStr.value.split('-');
        if (parts.length !== 3) return false;
        
        const selectedMonth = parseInt(parts[0]);
        const selectedDay = parseInt(parts[1]);
        const selectedYear = parseInt(parts[2]);
        
        let actualMonth = currentMonth.value;
        let actualYear = currentYear.value;
        
        if (isPreviousMonth(rowIndex, dayIndex)) {
            actualMonth = currentMonth.value - 1;
            if (actualMonth < 1) {
                actualMonth = 12;
                actualYear = currentYear.value - 1;
            }
        } else if (isNextMonth(rowIndex, dayIndex)) {
            actualMonth = currentMonth.value + 1;
            if (actualMonth > 12) {
                actualMonth = 1;
                actualYear = currentYear.value + 1;
            }
        }
        
        return day === selectedDay && 
            actualMonth === selectedMonth && 
            actualYear === selectedYear;
    };
    const props = defineProps<{
        id: string
    }>();

    const emit = defineEmits<{
        'deadline-selected': [
            id: string,
            date: Date
        ]
        'deadline-unselected': [id: string];
    }>();

    const selectDate = function(day: number, rowIndex: number, dayIndex: number) {
        // Calculate which month this day belongs to
        let actualMonth = currentMonth.value;
        let actualYear = currentYear.value;
        
        if (isPreviousMonth(rowIndex, dayIndex)) {
            actualMonth = currentMonth.value - 1;
            if (actualMonth < 1) {
                actualMonth = 12;
                actualYear = currentYear.value - 1;
            }
        } else if (isNextMonth(rowIndex, dayIndex)) {
            actualMonth = currentMonth.value + 1;
            if (actualMonth > 12) {
                actualMonth = 1;
                actualYear = currentYear.value + 1;
            }
        }
        
        // Check if date is in the past BEFORE any state changes
        const selectedDate = new Date(actualYear, actualMonth - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only dates
        
        if (selectedDate < today) {
            alert(`The deadline can't be in the past`);
            return; 
        }
        
        const dayStr = day.toString().padStart(2, '0');
        const monthStr = actualMonth.toString().padStart(2, '0');
        const yearStr = actualYear.toString();

        //check if the selected date is already selected
        if (isSelectedDay(day, rowIndex, dayIndex)){
            console.log('unselecting');
            unSelect();
            return;
        }
        selectedDateStr.value = `${monthStr}-${dayStr}-${yearStr}`;
        searchedDate.value = `${monthStr}-${dayStr}-${yearStr}`;  
        dateIsSelected.value = true;

        const selectedDateObj = new Date(actualYear, actualMonth - 1, day);
        emit('deadline-selected', props.id, selectedDateObj);
        
        console.log(`Selected ${monthStr}-${dayStr}-${yearStr}`);
    }

    const unSelect = function(){
        selectedDateStr.value = '';
        searchedDate.value = '';
        dateIsSelected.value = false;
        emit('deadline-unselected', props.id);
    }

    watch(date, (newDate) => {
        if (newDate && newDate.day && newDate.month && newDate.year) {
            // Validate that the date is not in the past
            const inputDate = new Date(newDate.year, newDate.month - 1, newDate.day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to compare only dates
            
            if (inputDate < today) {
                console.log(`Typed date ${newDate.month}-${newDate.day}-${newDate.year} is in the past`);
                // Clear the selection state but keep the typed input
                dateIsSelected.value = false;
                selectedDateStr.value = '';
                return; // Don't jump calendar or select date
            }
            
            // Check if we need to change the calendar view
            if (newDate.month !== currentMonth.value || newDate.year !== currentYear.value) {
                currentMonth.value = newDate.month;
                currentYear.value = newDate.year;

                const dayStr = newDate.day.toString().padStart(2, '0');
                const monthStr = newDate.month.toString().padStart(2, '0');
                const yearStr = newDate.year.toString();
                
                selectedDateStr.value = `${monthStr}-${dayStr}-${yearStr}`;
                dateIsSelected.value = true;

                emit('deadline-selected', props.id, inputDate);
                
                console.log(`Calendar jumped to ${monthStr}/${yearStr}`);
            }
        }
    }, { immediate: false }); // Don't run on initial mount
    
</script>

<style scoped>
.calendar-popup {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
    border: 1px solid black;
    max-width: 300px;
}

.calendar-navigation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    border: 1px solid;
    padding: 10px;
}

.date-search {
    flex: 1;
    text-align: center;
    padding: 5px;
}

.select-date-UI {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.date-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
}   

.days-of-week,
.day-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    width: 280px; 
}

.day-of-week {
    text-align: center;
    font-weight: bold;
    padding: 8px;
    font-size: 12px;
    color: #666;
    background-color: #f0f0f0;
}

.day {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    margin: 0; 
    padding: 0;
    background-color: lightgreen;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    justify-self: center; 
}

.selected-date {
    text-align: center;
    padding: 10px;
    font-weight: bold;
}

.day.prev-month,
.day.next-month {
    opacity: 0.4;
    background-color: #e9e9e9;
    color: #999;
}


.day.current-month {
    background-color: lightgreen;
    opacity: 1;
}


.day.selected {
    background-color: #007bff;
    color: white;
    font-weight: bold;
    opacity: 1; 
}


.day.current-month:hover {
    background-color: #b4f8b4;
}

.day.prev-month:hover,
.day.next-month:hover {
    opacity: 0.6;
    background-color: #d4d4d4;
}

.day.selected:hover {
    background-color: #0056b3;
}

</style>