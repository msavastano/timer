// Logic for the create/edit page
document.addEventListener('DOMContentLoaded', () => {
    const routineForm = document.getElementById('routine-form');
    const routineNameInput = document.getElementById('routine-name');
    const intervalsContainer = document.getElementById('intervals-container');
    const addIntervalButton = document.getElementById('add-interval');
    const totalTimeSpan = document.getElementById('total-time');

    const LOCAL_STORAGE_KEY = 'timerRoutines';
    const urlParams = new URLSearchParams(window.location.search);
    const routineId = urlParams.get('id');
    let editingRoutine = null;

    function getRoutines() {
        const routines = localStorage.getItem(LOCAL_STORAGE_KEY);
        return routines ? JSON.parse(routines) : [];
    }

    function saveRoutines(routines) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(routines));
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateTotalTime() {
        let totalSeconds = 0;
        const durationInputs = intervalsContainer.querySelectorAll('.interval-duration');
        durationInputs.forEach(input => {
            totalSeconds += Number(input.value) || 0;
        });
        totalTimeSpan.textContent = formatTime(totalSeconds);
    }

    function renderInterval(interval = {}, insertAfterElement = null) {
        const intervalElement = document.createElement('div');
        intervalElement.classList.add('interval-item');

        intervalElement.innerHTML = `
            <input type="number" class="interval-duration" placeholder="Duration (s)" value="${interval.duration || ''}" required>
            <input type="text" class="interval-title" placeholder="Title" value="${interval.title || ''}" required>
            <input type="text" class="interval-description" placeholder="Description" value="${interval.description || ''}">
            <input type="color" class="interval-color" value="${interval.color || '#ffffff'}">
            <button type="button" class="duplicate-interval-btn">Duplicate</button>
            <button type="button" class="remove-interval-btn">Remove</button>
            <button type="button" class="move-up-btn">Up</button>
            <button type="button" class="move-down-btn">Down</button>
        `;

        if (insertAfterElement) {
            insertAfterElement.parentNode.insertBefore(intervalElement, insertAfterElement.nextSibling);
        } else {
            intervalsContainer.appendChild(intervalElement);
        }
    }

    if (routineId) {
        // Edit mode
        const routines = getRoutines();
        editingRoutine = routines.find(r => r.id === routineId);
        if (editingRoutine) {
            routineNameInput.value = editingRoutine.name;
            editingRoutine.intervals.forEach(interval => renderInterval(interval));
        } else {
             // If routine not found, maybe redirect or show an error
            alert("Routine not found!");
            window.location.href = 'index.html';
        }
        updateTotalTime(); // Update time after loading
    } else {
        // Create mode - start with one empty interval
        renderInterval();
        updateTotalTime(); // Update time for the new interval
    }

    addIntervalButton.addEventListener('click', () => {
        renderInterval();
        updateTotalTime();
    });

    intervalsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('interval-duration')) {
            updateTotalTime();
        }
    });

    intervalsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const intervalItem = target.closest('.interval-item');
        if (!intervalItem) return;

        if (target.classList.contains('remove-interval-btn')) {
            intervalItem.remove();
            updateTotalTime();
        } else if (target.classList.contains('move-up-btn')) {
            if (intervalItem.previousElementSibling) {
                intervalsContainer.insertBefore(intervalItem, intervalItem.previousElementSibling);
            }
        } else if (target.classList.contains('move-down-btn')) {
            if (intervalItem.nextElementSibling) {
                intervalsContainer.insertBefore(intervalItem.nextElementSibling, intervalItem);
            }
        } else if (target.classList.contains('duplicate-interval-btn')) {
            const newIntervalData = {
                duration: intervalItem.querySelector('.interval-duration').value,
                title: intervalItem.querySelector('.interval-title').value,
                description: intervalItem.querySelector('.interval-description').value,
                color: intervalItem.querySelector('.interval-color').value,
            };
            renderInterval(newIntervalData, intervalItem);
            updateTotalTime();
        }
    });

    routineForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const intervals = [];
        const intervalElements = document.querySelectorAll('.interval-item');
        intervalElements.forEach(item => {
            intervals.push({
                duration: item.querySelector('.interval-duration').value,
                title: item.querySelector('.interval-title').value,
                description: item.querySelector('.interval-description').value,
                color: item.querySelector('.interval-color').value,
            });
        });

        const newRoutine = {
            id: routineId || Date.now().toString(),
            name: routineNameInput.value,
            intervals: intervals
        };

        let routines = getRoutines();
        if (routineId) {
            // Update existing
            routines = routines.map(r => r.id === routineId ? newRoutine : r);
        } else {
            // Add new
            routines.push(newRoutine);
        }

        saveRoutines(routines);
        window.location.href = 'index.html';
    });
});
