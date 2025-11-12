(function () {
  // --- Global Chart Variables ---
  let taskChart = null;
  let priorityChart = null;
  const DB_KEY = "synergyflow_db";

  // --- 1. THEME LOGIC (Already uses localStorage) ---
  const themeToggleBtn = document.getElementById("theme-toggle-icon");
  const htmlElement = document.documentElement;

  function setTheme(theme) {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (
      document.getElementById("page-dashboard").classList.contains("active")
    ) {
      renderDashboard(); // Re-render charts with new colors
    }
  });

  // --- 2. LOCALSTORAGE DATABASE API ---

  // Gets the entire database from localStorage
  function getDB() {
    let db = JSON.parse(localStorage.getItem(DB_KEY));
    if (!db) {
      // If no DB, create a default one
      db = {
        tasks: [
          {
            id: 1,
            title: "Update Homepage Hero",
            assignee: "Vansh Chauhan",
            dueDate: "2025-11-15",
            priority: "High",
            status: "Pending",
            description: "",
          },
          {
            id: 2,
            title: "Fix Navbar Bug",
            assignee: "Yashi Vishnoi",
            dueDate: "2025-11-14",
            priority: "Medium",
            status: "In Progress",
            description: "",
          },
          {
            id: 3,
            title: "Update Charts UI",
            assignee: "Yash Kumar",
            dueDate: "2025-12-01",
            priority: "Low",
            status: "Completed",
            description: "",
          },
        ],
        team: [
          {
            id: "t1",
            name: "Vansh Chauhan",
            role: "Project Admin",
            email: "vanshchauhan@gmail.com",
            avatar: "VC",
            color: "#78a6d3",
          },
          {
            id: "t2",
            name: "Yashi Vishnoi",
            role: "Frontend Developer",
            email: "yashivishnoi@gmail.com",
            avatar: "YV",
            color: "#e85d04",
          },
          {
            id: "t3",
            name: "Prachi Vashistha",
            role: "Backend Engineer",
            email: "prachivashistha@gmail.com",
            avatar: "PV",
            color: "#2a9d8f",
          },
          {
            id: "t4",
            name: "Yash Kumar",
            role: "UI/UX Designer",
            email: "yashkumar@gmail.com",
            avatar: "YK",
            color: "#9b5de5",
          },
        ],
      };
      saveDB(db);
    }
    return db;
  }

  // Saves the entire database to localStorage
  function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  // --- Task Functions ---
  function getTasks() {
    return getDB().tasks;
  }
  function getTeam() {
    return getDB().team;
  }

  function addTask(task) {
    const db = getDB();
    task.id = Date.now(); // Simple unique ID
    task.status = "Pending"; // All new tasks are Pending
    db.tasks.push(task);
    saveDB(db);
  }

  function updateTask(updatedTask) {
    const db = getDB();
    const taskIndex = db.tasks.findIndex((task) => task.id === updatedTask.id);
    if (taskIndex > -1) {
      db.tasks[taskIndex] = updatedTask;
      saveDB(db);
    }
  }

  function deleteTask(taskId) {
    const db = getDB();
    db.tasks = db.tasks.filter((task) => task.id !== taskId);
    saveDB(db);
  }

  // --- 3. DYNAMIC RENDERING FUNCTIONS ---

  // Renders the table on the "Manage Tasks" page
  function renderManageTasksTable() {
    const tasks = getTasks();
    const tbody = document.getElementById("manage-tasks-tbody");
    tbody.innerHTML = ""; // Clear existing table

    if (tasks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No tasks found.</td></tr>';
      return;
    }

    tasks.forEach((task) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${task.title}</td>
        <td>${task.assignee}</td>
        <td>${new Date(task.dueDate).toLocaleDateString()}</td>
        <td><span class="badge ${task.priority.toLowerCase()}">${
        task.priority
      }</span></td>
        <td><span class="badge ${task.status
          .replace(" ", "-")
          .toLowerCase()}">${task.status}</span></td>
        <td>
          <button class="action-btn" data-id="${
            task.id
          }"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" data-id="${
            task.id
          }"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Renders the cards on the "Team Members" page
  function renderTeamMembersGrid() {
    const team = getTeam();
    const grid = document.getElementById("team-members-grid");
    grid.innerHTML = ""; // Clear grid

    team.forEach((member) => {
      const card = document.createElement("div");
      card.className = "member-card";
      card.innerHTML = `
        <div class="member-avatar" style="background-color: ${member.color}">${member.avatar}</div>
        <h3>${member.name}</h3>
        <span class="member-role">${member.role}</span>
        <p class="member-email">${member.email}</p>
        <button class="btn btn-secondary" style="width: 100%">View Profile</button>
      `;
      grid.appendChild(card);
    });
  }

  // Renders the <option> tags in the "Create Task" form
  function renderAssigneeOptions() {
    const team = getTeam();
    const select = document.getElementById("assignee");
    select.innerHTML = '<option value="">Select Team Member</option>';
    team.forEach((member) => {
      select.innerHTML += `<option value="${member.name}">${member.name}</option>`;
    });
  }

  // Function to populate the form for editing
  function populateEditForm(task) {
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("assignee").value = task.assignee;
    document.getElementById("priority").value = task.priority;
    document.getElementById("dueDate").value = task.dueDate;
    document.getElementById("description").value = task.description;
  }

  // Calculates stats and renders the dashboard widgets
  function renderDashboard() {
    const tasks = getTasks();

    // 1. Calculate Stats
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const progress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;

    // 2. Update Stat Cards
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-pending").textContent = pending;
    document.getElementById("stat-progress").textContent = progress;
    document.getElementById("stat-completed").textContent = completed;

    // 3. Render Charts
    renderCharts({ pending, progress, completed });
  }

  // Renders the two charts on the dashboard
  function renderCharts(stats) {
    // Get theme colors from CSS
    const rootStyles = getComputedStyle(document.documentElement);
    const colorPrimary = rootStyles.getPropertyValue("--primary").trim();
    const colorSecondary = rootStyles.getPropertyValue("--secondary").trim();
    const colorAccent = rootStyles.getPropertyValue("--accent").trim();
    const colorText = rootStyles.getPropertyValue("--text").trim();

    // Destroy existing charts for re-render
    if (taskChart) taskChart.destroy();
    if (priorityChart) priorityChart.destroy();

    // --- Chart 1: Task Distribution (Doughnut) ---
    const taskCtx = document
      .getElementById("taskDistributionChart")
      .getContext("2d");
    taskChart = new Chart(taskCtx, {
      type: "doughnut",
      data: {
        labels: ["Pending", "In Progress", "Completed"],
        datasets: [
          {
            data: [stats.pending, stats.progress, stats.completed],
            backgroundColor: [colorPrimary, colorAccent, colorSecondary],
            borderColor: "transparent",
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { color: colorText } },
        },
      },
    });

    // --- Chart 2: Task Priority (Bar) ---
    // Calculate priority stats
    const tasks = getTasks();
    const high = tasks.filter((t) => t.priority === "High").length;
    const medium = tasks.filter((t) => t.priority === "Medium").length;
    const low = tasks.filter((t) => t.priority === "Low").length;

    const priorityCtx = document
      .getElementById("taskPriorityChart")
      .getContext("2d");
    priorityChart = new Chart(priorityCtx, {
      type: "bar",
      data: {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            data: [high, medium, low],
            backgroundColor: [colorPrimary, colorAccent, colorSecondary],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: colorText, stepSize: 1 },
            grid: { color: colorText + "33" },
          },
          x: { ticks: { color: colorText }, grid: { display: false } },
        },
      },
    });
  }

  // --- 4. NAVIGATION LOGIC ---
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".dashboard-page");
  const pageTitle = document.getElementById("page-title");

  function showPage(pageId) {
    pages.forEach((page) => page.classList.remove("active"));
    navLinks.forEach((link) => link.classList.remove("active"));

    document.getElementById(pageId).classList.add("active");

    const activeLink = document.querySelector(
      `.nav-link[data-target="${pageId}"]`
    );
    let newTitle = "Dashboard";
    if (activeLink) {
      activeLink.classList.add("active");
      newTitle = activeLink.textContent.trim();
    }

    // NEW: Logic to handle Create/Edit form state
    if (pageId === "page-create-task") {
      const submitBtn = document.getElementById("submit-task-btn");
      if (currentEditTaskId !== null) {
        // --- EDIT MODE ---
        newTitle = "Edit Task";
        submitBtn.textContent = "Save Changes";
        const task = getTaskById(currentEditTaskId);
        populateEditForm(task);
      } else {
        // --- CREATE MODE ---
        newTitle = "Create New Task";
        submitBtn.textContent = "Create Task";
        document.getElementById("createTaskForm").reset();
      }
    }

    pageTitle.textContent = newTitle;

    // Render content for the new page
    if (pageId === "page-dashboard") {
      renderDashboard();
    } else if (pageId === "page-manage-tasks") {
      renderManageTasksTable();
    } else if (pageId === "page-team-members") {
      renderTeamMembersGrid();
    } else if (pageId === "page-create-task" && currentEditTaskId === null) {
      // Only render assignees if we are in CREATE mode (to avoid re-render)
      renderAssigneeOptions();
    }
  }

  // --- 5. EVENT LISTENERS ---

  // UPDATED: Navigation now also resets the edit mode
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // NEW: Reset edit mode when navigating
      currentEditTaskId = null;

      const targetId = link.dataset.target;
      if (targetId) {
        showPage(targetId);
      }
    });
  });

  // UPDATED: Form submission now handles both Create and Update
  document.getElementById("createTaskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    if (currentEditTaskId === null) {
      // --- CREATE NEW TASK ---
      const newTask = {
        title: document.getElementById("taskTitle").value,
        assignee: document.getElementById("assignee").value,
        priority: document.getElementById("priority").value,
        dueDate: document.getElementById("dueDate").value,
        description: document.getElementById("description").value,
      };
      addTask(newTask);
      alert("Task Created Successfully!");
    } else {
      // --- UPDATE EXISTING TASK ---
      const originalTask = getTaskById(currentEditTaskId);
      const updatedTask = {
        id: currentEditTaskId,
        status: originalTask.status, // Preserve original status
        title: document.getElementById("taskTitle").value,
        assignee: document.getElementById("assignee").value,
        priority: document.getElementById("priority").value,
        dueDate: document.getElementById("dueDate").value,
        description: document.getElementById("description").value,
      };
      updateTask(updatedTask);
      alert("Task Updated Successfully!");
    }

    // Reset state and show the task list
    e.target.reset();
    currentEditTaskId = null;
    showPage("page-manage-tasks");
  });

  // UPDATED: Event Delegation now also handles Edit clicks
  document
    .getElementById("manage-tasks-tbody")
    .addEventListener("click", (e) => {
      const deleteButton = e.target.closest(".delete");
      const editButton = e.target.closest(".edit");

      if (deleteButton) {
        if (confirm("Are you sure you want to delete this task?")) {
          const taskId = Number(deleteButton.dataset.id);
          deleteTask(taskId);
          renderManageTasksTable();
        }
      }

      // NEW: Handle Edit button click
      if (editButton) {
        const taskId = Number(editButton.dataset.id);
        currentEditTaskId = taskId; // Set the global edit ID
        showPage("page-create-task"); // Show the form in edit mode
      }
    });

  // --- 6. INITIALIZATION ---
  document.addEventListener("DOMContentLoaded", () => {
    // Set initial theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      htmlElement.setAttribute("data-theme", savedTheme);
    } else {
      const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      htmlElement.setAttribute("data-theme", sysTheme);
    }

    // Set the dynamic date on the welcome banner
    const dateEl = document.getElementById("current-date");
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateEl.textContent = today.toLocaleDateString("en-US", options);

    // Render the default page (Dashboard)
    renderDashboard();

    // Pre-render other pages in the background
    renderAssigneeOptions();
    renderManageTasksTable();
    renderTeamMembersGrid();
  });
})();
