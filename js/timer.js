// Logic for the timer page
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timerTitle = document.getElementById('timer-title');
    const timerDescription = document.getElementById('timer-description');
    const timerEl = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    const startPauseBtn = document.getElementById('start-pause');
    const resetBtn = document.getElementById('reset');

    // State
    let currentRoutine = null;
    let currentIntervalIndex = 0;
    let timeLeftInInterval = 0;
    let timerId = null; // To store setInterval ID
    let isPaused = true;
    let totalRoutineTime = 0;

    // Constants
    const LOCAL_STORAGE_KEY = 'timerRoutines';

    function getRoutines() {
        const routines = localStorage.getItem(LOCAL_STORAGE_KEY);
        return routines ? JSON.parse(routines) : [];
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = parseInt(seconds % 60, 10);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateProgressBar() {
        const timeElapsedInCurrentInterval = currentRoutine.intervals[currentIntervalIndex].duration - timeLeftInInterval;
        const timeElapsedInPreviousIntervals = currentRoutine.intervals.slice(0, currentIntervalIndex).reduce((acc, interval) => acc + Number(interval.duration), 0);
        const totalTimeElapsed = timeElapsedInPreviousIntervals + timeElapsedInCurrentInterval;
        const percentage = (totalTimeElapsed / totalRoutineTime) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    function updateDisplay() {
        if (!currentRoutine) return;

        const interval = currentRoutine.intervals[currentIntervalIndex];
        timerTitle.textContent = interval.title;
        timerDescription.textContent = interval.description;
        document.body.style.backgroundColor = interval.color;
        timerEl.textContent = formatTime(timeLeftInInterval);
        updateProgressBar();
    }

    function startTimer() {
        if (timerId) clearInterval(timerId); // Clear any existing timer

        isPaused = false;
        startPauseBtn.textContent = 'Pause';

        timerId = setInterval(() => {
            if (timeLeftInInterval > 0) {
                timeLeftInInterval--;
                timerEl.textContent = formatTime(timeLeftInInterval);
                updateProgressBar();
            } else {
                // Move to next interval
                currentIntervalIndex++;
                if (currentIntervalIndex < currentRoutine.intervals.length) {
                    const nextInterval = currentRoutine.intervals[currentIntervalIndex];
                    timeLeftInInterval = nextInterval.duration;
                    updateDisplay();
                } else {
                    // Routine finished
                    clearInterval(timerId);
                    timerId = null;
                    isPaused = true;
                    startPauseBtn.textContent = 'Start';
                    progressBar.style.width = '100%';
                    alert('Routine complete!');
                    // Optionally reset to the beginning
                    resetTimer();
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        isPaused = true;
        startPauseBtn.textContent = 'Start';
        clearInterval(timerId);
        timerId = null;
    }

    function resetTimer() {
        pauseTimer();
        currentIntervalIndex = 0;
        if (currentRoutine) {
            timeLeftInInterval = currentRoutine.intervals[0].duration;
            updateDisplay();
        }
    }

    // Event Listeners
    startPauseBtn.addEventListener('click', () => {
        if (!currentRoutine) return;
        if (isPaused) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    resetBtn.addEventListener('click', () => {
        if (currentRoutine) {
            resetTimer();
        }
    });


    // Initialization
    function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const routineId = urlParams.get('id');

        if (!routineId) {
            alert('No routine specified!');
            window.location.href = 'index.html';
            return;
        }

        const routines = getRoutines();
        currentRoutine = routines.find(r => r.id === routineId);

        if (!currentRoutine || !currentRoutine.intervals || currentRoutine.intervals.length === 0) {
            alert('Routine not found or is empty!');
            window.location.href = 'index.html';
            return;
        }

        timeLeftInInterval = currentRoutine.intervals[0].duration;
        totalRoutineTime = currentRoutine.intervals.reduce((acc, interval) => acc + Number(interval.duration), 0);
        updateDisplay();
    }

    init();
});
