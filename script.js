const DEFAULT_TASKS = ["Drink Water", "Exercise", "Read 10 pages"];
const TASKS_KEY = "daily_tasks";
const DATE_KEY = "last_updated_date";

function loadTasks() {
  const savedDate = localStorage.getItem(DATE_KEY);
  const today = new Date().toDateString();

  if (savedDate !== today) {
    // New day → Reset tasks to default
    const resetTasks = DEFAULT_TASKS.map(task => ({ text: task, done: false }));
    localStorage.setItem(TASKS_KEY, JSON.stringify(resetTasks));
    localStorage.setItem(DATE_KEY, today);
  }

  return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = loadTasks();
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between";

    const left = document.createElement("div");
    left.className = "flex items-center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.className = "mr-2";
    checkbox.addEventListener("change", () => {
      const updatedTasks = loadTasks();
      updatedTasks[index].done = checkbox.checked;
      saveTasks(updatedTasks);
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) {
      span.classList.add("line-through", "text-gray-500");
    }

    left.appendChild(checkbox);
    left.appendChild(span);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.className = "ml-4 text-red-500 hover:text-red-700";
    removeBtn.addEventListener("click", () => {
      const updatedTasks = loadTasks();
      updatedTasks.splice(index, 1);
      saveTasks(updatedTasks);
      renderTasks();
    });

    li.appendChild(left);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });
}

document.getElementById("add-task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("new-task");
  const newTask = input.value.trim();
  if (!newTask) return;

  const tasks = loadTasks();
  tasks.push({ text: newTask, done: false });
  saveTasks(tasks);
  input.value = "";
  renderTasks();
});

renderTasks();
