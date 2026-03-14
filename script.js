// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all elements we need
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    const pendingTasksSpan = document.getElementById('pendingTasks');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    // Filter buttons
    const allFilter = document.getElementById('allFilter');
    const pendingFilter = document.getElementById('pendingFilter');
    const completedFilter = document.getElementById('completedFilter');
    
    // Current filter
    let currentFilter = 'all';
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Function to save tasks
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        updateStats();
    }
    
    // Function to display tasks based on filter
    function displayTasks() {
        // Clear current list
        taskList.innerHTML = '';
        
        // Filter tasks
        let filteredTasks = tasks;
        if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // Check if no tasks
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet. Add your first task!' : 
                                      currentFilter === 'pending' ? 'No pending tasks!' : 'No completed tasks!';
            taskList.appendChild(emptyMessage);
            return;
        }
        
        // Display each task
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.style.animation = 'slideIn 0.3s ease';
            
            // Find original index in tasks array
            const originalIndex = tasks.findIndex(t => t.id === task.id);
            
            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function() {
                tasks[originalIndex].completed = this.checked;
                saveTasks();
            });
            
            // Task text
            const span = document.createElement('span');
            span.className = `task-text ${task.completed ? 'completed' : ''}`;
            span.textContent = task.text;
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.addEventListener('click', function() {
                if (confirm('Delete this task?')) {
                    tasks.splice(originalIndex, 1);
                    saveTasks();
                }
            });
            
            // Add everything to list item
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            
            // Add to list
            taskList.appendChild(li);
        });
    }
    
    // Function to update statistics
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        pendingTasksSpan.textContent = pending;
    }
    
    // Function to add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        // Create new task object
        const newTask = {
            id: Date.now(), // Unique ID using timestamp
            text: taskText,
            completed: false,
            createdAt: new Date().toLocaleString()
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Save and display
        saveTasks();
        
        // Clear input
        taskInput.value = '';
        
        // Show success message
        alert('Task added successfully! ✅');
    }
    
    // Add task when button clicked
    addBtn.addEventListener('click', addTask);
    
    // Add task when Enter pressed
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Clear all tasks
    clearAllBtn.addEventListener('click', function() {
        if (tasks.length === 0) {
            alert('No tasks to clear!');
            return;
        }
        
        if (confirm('Are you sure you want to delete ALL tasks?')) {
            tasks = [];
            saveTasks();
        }
    });
    
    // Filter buttons
    allFilter.addEventListener('click', function() {
        currentFilter = 'all';
        updateFilterButtons(allFilter);
        displayTasks();
    });
    
    pendingFilter.addEventListener('click', function() {
        currentFilter = 'pending';
        updateFilterButtons(pendingFilter);
        displayTasks();
    });
    
    completedFilter.addEventListener('click', function() {
        currentFilter = 'completed';
        updateFilterButtons(completedFilter);
        displayTasks();
    });
    
    function updateFilterButtons(activeButton) {
        [allFilter, pendingFilter, completedFilter].forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    // Initial display
    saveTasks();
    
    // Add sample tasks if no tasks exist
    if (tasks.length === 0) {
        const sampleTasks = [
            { id: 1, text: 'Complete Hack & Forge project', completed: false, createdAt: new Date().toLocaleString() },
            { id: 2, text: 'Upload to GitHub', completed: false, createdAt: new Date().toLocaleString() },
            { id: 3, text: 'Submit project', completed: false, createdAt: new Date().toLocaleString() }
        ];
        tasks = sampleTasks;
        saveTasks();
    }
    
    console.log('Task Manager is ready! 🚀');
});
