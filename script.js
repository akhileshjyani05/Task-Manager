
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;
let searchTerm = "";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const greetingEl = document.getElementById("greeting");
const dateEl = document.getElementById("currentDate");

// Dynamic Greeting and Date
function updateGreetingAndDate() {
    const now = new Date();
    const hour = now.getHours();
    let greetingText = "";
    let emoji = "";

    if (hour >= 5 && hour < 12) {
        greetingText = "Good Morning!";
        emoji = "☀️";
    } else if (hour >= 12 && hour < 17) {
        greetingText = "Good Afternoon!";
        emoji = "🌤️";
    } else if (hour >= 17 && hour < 21) {
        greetingText = "Good Evening!";
        emoji = "🌅";
    } else {
        greetingText = "Good Night!";
        emoji = "🌙";
    }

    greetingEl.innerHTML = `${emoji} ${greetingText}`;

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    dateEl.textContent = now.toLocaleDateString("en-US", options);
}

// Search Functionality
searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderTasks();
});

function filterTasks(task) {
    if (!searchTerm) return true;
    const matchesTitle = task.title.toLowerCase().includes(searchTerm);
    const matchesDate = task.dueDate
        ? task.dueDate.toLowerCase().includes(searchTerm)
        : false;
    return matchesTitle || matchesDate;
}

function renderTasks() {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter(filterTasks);
    filteredTasks.forEach((task) => {
        const originalIndex = tasks.indexOf(task);
        const taskEl = document.createElement("div");
        taskEl.className = `task ${task.completed ? "completed" : ""}`;
        const dueDateText = task.dueDate
            ? `<div class="task-due">📅 Due: ${new Date(
                task.dueDate
            ).toLocaleDateString()}
            </div>`
            : "";
        taskEl.innerHTML = `
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        ${dueDateText}
                    </div>
                    <div class="task-actions">
                        ${!task.completed
                ? `<button class="complete-btn" onclick="toggleComplete(${originalIndex})">✓ Complete</button>`
                : `<span style="color: #10b981; font-size: 18px;">🎉 Done!</span>`
            }
                        <button class="edit-btn" onclick="editTask(${originalIndex})">✏️ Edit</button>
                        <button class="delete-btn" onclick="deleteTask(${originalIndex})">🗑️ Delete</button>
                    </div>
                `;
        taskList.appendChild(taskEl);
    });
    updateProgress(filteredTasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress(visibleTasks = tasks) {
    const total = visibleTasks.length;
    const completed = visibleTasks.filter((t) => t.completed).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    progressFill.style.width = percentage + "%";
    progressText.textContent = `${Math.round(
        percentage
    )}% Complete (${completed}/${total} tasks)`;
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const dueDate = document.getElementById("taskDueDate").value;

    if (!title) return;

    if (editId !== null) {
        tasks[editId] = { ...tasks[editId], title, dueDate: dueDate || null };
        editId = null;
        addBtn.innerHTML = "➕ Add Task";
    } else {
        tasks.push({ title, dueDate: dueDate || null, completed: false });
    }

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDueDate").value = "";
    renderTasks();
}
                         );

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function editTask(index) {
    const task = tasks[index];
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDueDate").value = task.dueDate || "";
    editId = index;
    addBtn.innerHTML = "✅ Update Task";
    taskForm.scrollIntoView({ behavior: "smooth" });
    searchInput.value = "";
    searchTerm = "";
}

function deleteTask(index) {
    if (confirm("Delete this task?")) {
        tasks.splice(index, 1);
        renderTasks(); }
    
}

// Initial Setup
updateGreetingAndDate();
setInterval(updateGreetingAndDate, 60000); // Update every minute
renderTasks();
