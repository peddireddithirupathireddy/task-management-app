const API = "/api";

let token = localStorage.getItem("token");


// REGISTER

async function register() {

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch(`${API}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await response.json();

    alert(data.message);
}


// LOGIN

async function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    localStorage.setItem("token", data.token);

    token = data.token;

    showTaskSection(data.user.name);

    loadTasks();
}


// SHOW TASK SECTION

function showTaskSection(name) {

    document.getElementById("authSection")
        .classList.add("hidden");

    document.getElementById("taskSection")
        .classList.remove("hidden");

    document.getElementById("welcome")
        .innerText = `Welcome, ${name}`;
}


// CREATE TASK

async function createTask() {

    const title =
        document.getElementById("taskTitle").value;

    const description =
        document.getElementById("taskDescription").value;

    const status =
        document.getElementById("taskStatus").value;

    const due_date =
        document.getElementById("taskDueDate").value;

    if (!title) {
        alert("Enter task title");
        return;
    }

    const response = await fetch(`${API}/tasks`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            title,
            description,
            status,
            due_date
        })
    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";

    loadTasks();
}


// LOAD TASKS

async function loadTasks() {

    const response = await fetch(`${API}/tasks`, {

        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const tasks = await response.json();

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";

        card.innerHTML = `
            <h3>${task.title}</h3>

            <p>${task.description || ""}</p>

            <span class="status">
                ${task.status}
            </span>

            <p>
                Due Date:
                ${task.due_date || "Not specified"}
            </p>

            <div class="task-buttons">

                <button onclick="completeTask(${task.id})">
                    Complete
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(card);
    });
}


// MARK TASK COMPLETED

async function completeTask(id) {

    const response = await fetch(`${API}/tasks`, {

        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const tasks = await response.json();

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    await fetch(`${API}/tasks/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            title: task.title,
            description: task.description,
            status: "Completed",
            due_date: task.due_date
        })
    });

    loadTasks();
}


// DELETE TASK

async function deleteTask(id) {

    if (!confirm("Delete this task?")) {
        return;
    }

    const response = await fetch(
        `${API}/tasks/${id}`,
        {
            method: "DELETE",

            headers: {
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    alert(data.message);

    loadTasks();
}


// LOGOUT

function logout() {

    localStorage.removeItem("token");

    token = null;

    location.reload();
}


// AUTO LOGIN UI

if (token) {

    document.getElementById("authSection")
        .classList.add("hidden");

    document.getElementById("taskSection")
        .classList.remove("hidden");

    document.getElementById("welcome")
        .innerText = "Welcome Back";

    loadTasks();
}
