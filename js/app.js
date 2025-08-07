// Main app logic for the dashboard
document.addEventListener('DOMContentLoaded', () => {
    const routinesList = document.getElementById('routines-list');
    const LOCAL_STORAGE_KEY = 'timerRoutines';

    function getRoutines() {
        const routines = localStorage.getItem(LOCAL_STORAGE_KEY);
        return routines ? JSON.parse(routines) : [];
    }

    function saveRoutines(routines) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(routines));
    }

    function deleteRoutine(id) {
        let routines = getRoutines();
        routines = routines.filter(routine => routine.id !== id);
        saveRoutines(routines);
        renderRoutines();
    }

    function renderRoutines() {
        const routines = getRoutines();
        routinesList.innerHTML = ''; // Clear the list

        if (routines.length === 0) {
            routinesList.innerHTML = '<p>No routines created yet.</p>';
            return;
        }

        routines.forEach(routine => {
            const routineElement = document.createElement('div');
            routineElement.classList.add('routine');
            // Use routine.id which is a string. In JS, it's fine.
            routineElement.innerHTML = `
                <h3>${routine.name}</h3>
                <a href="timer.html?id=${routine.id}">Start</a>
                <a href="edit.html?id=${routine.id}">Edit</a>
                <button class="delete-btn" data-id="${routine.id}">Delete</button>
            `;
            routinesList.appendChild(routineElement);
        });

        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this routine?')) {
                    deleteRoutine(id);
                }
            });
        });
    }

    renderRoutines();
});
