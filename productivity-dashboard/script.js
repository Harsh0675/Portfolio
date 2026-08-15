document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Mock Tasks Dataset
  const INITIAL_TASKS = [
    {
      id: "task-101",
      title: "Implement RESTful JWT Authentication Endpoint",
      category: "Backend",
      priority: "High",
      status: "todo",
      dueDate: "2026-08-20",
      desc: "Architect Node.js/Express router with bcrypt password hashing and token generation middleware."
    },
    {
      id: "task-102",
      title: "Optimize LCP Image Preloading & CWV Performance",
      category: "Frontend",
      priority: "High",
      status: "progress",
      dueDate: "2026-08-18",
      desc: "Configure fetchpriority='high' attributes and compress hero assets to WebP format."
    },
    {
      id: "task-103",
      title: "Design PostgreSQL Composite B-Tree Index Schema",
      category: "Database",
      priority: "Medium",
      status: "done",
      dueDate: "2026-08-15",
      desc: "Run EXPLAIN ANALYZE on slow JOIN queries and add indexing across user_id and created_at columns."
    },
    {
      id: "task-104",
      title: "Configure GitHub Actions Docker Deployment Pipeline",
      category: "DevOps",
      priority: "Medium",
      status: "progress",
      dueDate: "2026-08-22",
      desc: "Automate Docker container compilation and automated unit testing steps on push to main branch."
    },
    {
      id: "task-105",
      title: "Build Responsive Glassmorphism Navigation Drawer",
      category: "Frontend",
      priority: "Low",
      status: "done",
      dueDate: "2026-08-12",
      desc: "Create responsive mobile navigation menu with CSS backdrop-filter blur and smooth scroll links."
    }
  ];

  // 2. Storage Helpers
  const STORAGE_KEY = "taskpulse_tasks_db";

  const getTasks = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(data);
  };

  const saveTasks = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  };

  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }
  };

  // 3. Render Dashboard Views
  const renderDashboard = () => {
    const tasks = getTasks();
    const searchVal = document.getElementById("search-input")?.value.toLowerCase().trim() || "";
    const catVal = document.getElementById("filter-category")?.value || "";
    const prioVal = document.getElementById("filter-priority")?.value || "";

    const filtered = tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchVal) ||
        t.desc.toLowerCase().includes(searchVal) ||
        t.category.toLowerCase().includes(searchVal);

      const matchesCat = !catVal || t.category === catVal;
      const matchesPrio = !prioVal || t.priority === prioVal;

      return matchesSearch && matchesCat && matchesPrio;
    });

    // Render Metrics
    const completedCount = tasks.filter((t) => t.status === "done").length;
    const progressCount = tasks.filter((t) => t.status === "progress").length;
    const highPrioCount = tasks.filter((t) => t.priority === "High" && t.status !== "done").length;

    document.getElementById("stat-total").textContent = tasks.length;
    document.getElementById("stat-completed").textContent = completedCount;
    document.getElementById("stat-in-progress").textContent = progressCount;
    document.getElementById("stat-high-priority").textContent = highPrioCount;

    // Render Completion Progress Bar
    const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
    const progressFill = document.getElementById("progress-fill-bar");
    const progressPctText = document.getElementById("progress-pct-text");
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressPctText) progressPctText.textContent = `${pct}% Completed`;

    // Render Kanban Columns
    const todoTasks = filtered.filter((t) => t.status === "todo");
    const progressTasks = filtered.filter((t) => t.status === "progress");
    const doneTasks = filtered.filter((t) => t.status === "done");

    document.getElementById("count-todo").textContent = todoTasks.length;
    document.getElementById("count-progress").textContent = progressTasks.length;
    document.getElementById("count-done").textContent = doneTasks.length;

    renderTaskList("col-todo-list", todoTasks);
    renderTaskList("col-progress-list", progressTasks);
    renderTaskList("col-done-list", doneTasks);
  };

  const renderTaskList = (containerId, taskArray) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (taskArray.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;" class="text-muted small">
          No tasks in this stage.
        </div>
      `;
      return;
    }

    container.innerHTML = taskArray
      .map(
        (t) => `
        <div class="task-item" data-id="${t.id}">
          <div class="task-tags">
            <span class="tag-cat">${t.category}</span>
            <span class="tag-prio prio-${t.priority.toLowerCase()}">${t.priority}</span>
          </div>

          <h4 class="task-title">${t.title}</h4>
          <p class="task-desc">${t.desc}</p>

          <div class="task-footer">
            <span><i class="fa-regular fa-calendar"></i> Due ${t.dueDate}</span>

            <div class="task-actions">
              <button class="btn-task-act btn-advance" data-id="${t.id}" title="Move Next">
                <i class="fa-solid fa-arrow-right-long"></i>
              </button>
              <button class="btn-task-act btn-edit-task" data-id="${t.id}" title="Edit Task">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-task-act delete btn-delete-task" data-id="${t.id}" title="Delete Task">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    // Attach Event Listeners
    container.querySelectorAll(".btn-advance").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        advanceTaskStatus(b.getAttribute("data-id"));
      });
    });

    container.querySelectorAll(".btn-edit-task").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditTaskModal(b.getAttribute("data-id"));
      });
    });

    container.querySelectorAll(".btn-delete-task").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTask(b.getAttribute("data-id"));
      });
    });
  };

  // 4. Filter Input Listeners
  ["search-input", "filter-category", "filter-priority"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", renderDashboard);
  });

  document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
    if (document.getElementById("search-input")) document.getElementById("search-input").value = "";
    if (document.getElementById("filter-category")) document.getElementById("filter-category").value = "";
    if (document.getElementById("filter-priority")) document.getElementById("filter-priority").value = "";
    renderDashboard();
  });

  // 5. Advance Task Status Cycle
  const advanceTaskStatus = (id) => {
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === id);
    if (task) {
      if (task.status === "todo") task.status = "progress";
      else if (task.status === "progress") task.status = "done";
      else if (task.status === "done") task.status = "todo";

      saveTasks(tasks);
      renderDashboard();
      showToast(`Task moved to ${task.status.toUpperCase()}`);
    }
  };

  // 6. Delete Task
  const deleteTask = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      let tasks = getTasks();
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks(tasks);
      renderDashboard();
      showToast("Task deleted.");
    }
  };

  // 7. Add / Edit Task Modal Handlers
  const taskModal = document.getElementById("task-modal");
  const taskForm = document.getElementById("task-form");

  const openAddTaskModal = () => {
    if (!taskModal || !taskForm) return;
    taskForm.reset();
    document.getElementById("task-id").value = "";
    document.getElementById("input-duedate").value = new Date().toISOString().split("T")[0];
    document.getElementById("modal-title").textContent = "Create New Task";
    document.getElementById("modal-submit-btn").textContent = "Save Task";
    taskModal.classList.add("active");
  };

  const openEditTaskModal = (id) => {
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task || !taskModal) return;

    document.getElementById("task-id").value = task.id;
    document.getElementById("input-title").value = task.title;
    document.getElementById("input-category").value = task.category;
    document.getElementById("input-priority").value = task.priority;
    document.getElementById("input-status").value = task.status;
    document.getElementById("input-duedate").value = task.dueDate;
    document.getElementById("input-desc").value = task.desc;

    document.getElementById("modal-title").textContent = "Edit Task Details";
    document.getElementById("modal-submit-btn").textContent = "Update Task";
    taskModal.classList.add("active");
  };

  const closeModal = () => {
    if (taskModal) taskModal.classList.remove("active");
  };

  document.getElementById("btn-add-task")?.addEventListener("click", openAddTaskModal);
  document.getElementById("modal-close-btn")?.addEventListener("click", closeModal);
  document.getElementById("modal-cancel-btn")?.addEventListener("click", closeModal);

  if (taskForm) {
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = document.getElementById("task-id").value;
      const tasks = getTasks();

      const newTask = {
        id: id || `task-${Date.now()}`,
        title: document.getElementById("input-title").value.trim(),
        category: document.getElementById("input-category").value,
        priority: document.getElementById("input-priority").value,
        status: document.getElementById("input-status").value,
        dueDate: document.getElementById("input-duedate").value,
        desc: document.getElementById("input-desc").value.trim()
      };

      if (id) {
        const index = tasks.findIndex((t) => t.id === id);
        if (index !== -1) tasks[index] = newTask;
        showToast("Task updated successfully!");
      } else {
        tasks.push(newTask);
        showToast("Task created successfully!");
      }

      saveTasks(tasks);
      closeModal();
      renderDashboard();
    });
  }

  // Initialize View
  renderDashboard();
});
