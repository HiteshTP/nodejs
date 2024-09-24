document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const priorityInput = document.getElementById('priorityInput');
    const labelsInput = document.getElementById('labelsInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task));
    }

    // Save tasks to local storage
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add a task to the DOM
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="${task.completed ? 'text-decoration: line-through;' : ''}">
                ${task.text} (Category: ${task.category}, Deadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}, Priority: ${task.priority}, Labels: ${task.labels.join(', ')})
            </span>
            <div>
                <button class="complete" ${task.completed ? 'disabled' : ''}>Complete</button>
                <button class="edit">Edit</button>
                <button class="remove">Remove</button>
            </div>
        `;

        const completeButton = li.querySelector('.complete');
        const removeButton = li.querySelector('.remove');
        const editButton = li.querySelector('.edit');

        // Complete task
        completeButton.addEventListener('click', () => {
            task.completed = true;
            saveTasks(getTasksFromDOM());
            loadTasks();
        });

        // Edit task
        editButton.addEventListener('click', () => {
            taskInput.value = task.text;
            categoryInput.value = task.category;
            deadlineInput.value = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
            priorityInput.value = task.priority;
            labelsInput.value = task.labels.join(', ');
            removeTask(task.text);
        });

        // Remove task
        removeButton.addEventListener('click', () => {
            removeTask(task.text);
            loadTasks();
        });

        taskList.appendChild(li);
    }

    // Get tasks from the DOM
    function getTasksFromDOM() {
        const tasks = [];
        document.querySelectorAll('li').forEach(li => {
            const text = li.querySelector('span').innerText;
            const [taskText, details] = text.split(' (Category: ');
            const [category, rest] = details.split(', Deadline: ');
            const [deadline, rest2] = rest.split(', Priority: ');
            const [priority, labelsStr] = rest2.split(', Labels: ');
            const labels = labelsStr.replace(')', '').split(', ').filter(label => label);

            tasks.push({
                text: taskText.trim(),
                category: category.trim(),
                deadline: deadline === 'N/A' ? null : new Date(deadline).toISOString(),
                priority: priority.trim(),
                labels
            });
        });
        return tasks;
    }

    // Remove a task
    function removeTask(taskText) {
        const tasks = getTasksFromDOM().filter(task => task.text !== taskText);
        saveTasks(tasks);
    }

    // Add a task
    addTaskButton.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const category = categoryInput.value.trim();
        const deadline = deadlineInput.value ? new Date(deadlineInput.value).toISOString() : null;
        const priority = priorityInput.value;
        const labels = labelsInput.value.split(',').map(label => label.trim()).filter(label => label);

        if (text) {
            const tasks = getTasksFromDOM();
            tasks.push({ text, category, deadline, priority, labels, completed: false });
            saveTasks(tasks);
            addTaskToDOM({ text, category, deadline, priority, labels, completed: false });
            taskInput.value = '';
            categoryInput.value = '';
            deadlineInput.value = '';
            priorityInput.value = 'Medium';
            labelsInput.value = '';
        }
    });

    // Load tasks on page load
    loadTasks();
});
