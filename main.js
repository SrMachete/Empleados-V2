const COLORS = [
  "#f28b82", "#fbbc04", "#fff475", "#ccff90", "#a7ffeb",
  "#cbf0f8", "#aecbfa", "#d7aefb", "#fdcfe8", "#e6c9a8",
  "#e8eaed", "#b3e5fc", "#ffccbc", "#dcedc8", "#c5cae9",
  "#f0f4c3", "#b2ebf2", "#d1c4e9", "#ffe0b2", "#c8e6c9",
  "#ffab91", "#f48fb1", "#ce93d8", "#90caf9", "#a5d6a7",
  "#bcaaa4", "#ffb74d", "#81d4fa", "#e1bee7", "#b39ddb"
];

let data = JSON.parse(localStorage.getItem("appData")) || {
  employees: [],
  days: {},
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear()
};

const defaultProcesses = ["Dock2", "Dock3", "Auditor", "Cargas", "Capitán"];

function saveData() {
  localStorage.setItem("appData", JSON.stringify(data));
}

function renderEmployeeList() {
  const list = document.getElementById("employeeList");
  list.innerHTML = "";
  data.employees.forEach(emp => {
    const li = document.createElement("li");
    li.className = "p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100";
    li.textContent = emp.login;
    li.onclick = () => {
      const dates = Object.entries(data.days)
        .filter(([_, logins]) => logins.includes(emp.login))
        .map(([date]) => date)
        .join(", ");
      alert(
        "👤 " + emp.login + "\n📌 Procesos: " + emp.processes.join(", ") +
        "\n📅 Días: " + (dates || "Ninguno")
      );
    };
    list.appendChild(li);
  });
}

function renderCalendar() {
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  const { currentYear, currentMonth } = data;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  document.getElementById("currentMonth").textContent =
    new Date(currentYear, currentMonth).toLocaleString("es-MX", { month: "long", year: "numeric" }).toUpperCase();

  for (let i = 0; i < firstDay; i++) {
    cal.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const box = document.createElement("div");
    box.className = "bg-gray-50 rounded p-1 border relative text-sm";
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    box.textContent = day;

    const markers = document.createElement("div");
    data.days[dateKey]?.forEach(login => {
      const emp = data.employees.find(e => e.login === login);
      if (emp) {
        const dot = document.createElement("span");
        dot.className = "day-marker";
        dot.style.backgroundColor = emp.color;
        markers.appendChild(dot);
      }
    });
    box.appendChild(markers);

    box.onclick = () => {
      const login = prompt("Login del empleado para este día:");
      const emp = data.employees.find(e => e.login === login);
      if (!emp) return alert("Empleado no encontrado");

      data.days[dateKey] = data.days[dateKey] || [];
      const idx = data.days[dateKey].indexOf(login);
      if (idx === -1) data.days[dateKey].push(login);
      else data.days[dateKey].splice(idx, 1);

      saveData();
      renderCalendar();
    };

    cal.appendChild(box);
  }
}

function addEmployee() {
  const login = prompt("Login del nuevo empleado:");
  if (!login || data.employees.find(e => e.login === login)) return alert("Login inválido o ya existe.");

  const options = [...defaultProcesses];
  const custom = prompt("¿Deseas agregar procesos personalizados? Escríbelos separados por coma, o deja vacío:");
  if (custom) options.push(...custom.split(",").map(x => x.trim()));

  const chosen = prompt("Selecciona los procesos para este empleado (separa con coma):\n" + options.join(", "));
  const selected = chosen ? chosen.split(",").map(p => p.trim()).filter(p => options.includes(p)) : [];

  if (selected.length === 0) return alert("Debes asignar al menos un proceso.");

  const color = COLORS[data.employees.length % COLORS.length];
  data.employees.push({ login, processes: selected, color });
  saveData();
  renderEmployeeList();
  renderCalendar();
}

document.getElementById("prevMonth").onclick = () => {
  data.currentMonth--;
  if (data.currentMonth < 0) {
    data.currentMonth = 11;
    data.currentYear--;
  }
  saveData();
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  data.currentMonth++;
  if (data.currentMonth > 11) {
    data.currentMonth = 0;
    data.currentYear++;
  }
  saveData();
  renderCalendar();
};

document.getElementById("addEmployee").onclick = addEmployee;

renderEmployeeList();
renderCalendar();
