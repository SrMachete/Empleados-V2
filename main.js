const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");

let currentDate = new Date();
const asociados = [
  { login: "bricafon", turno: "DB", procesos: ["Pick","Pit","Pack","Rebin","Dock"], color: "#FFADAD" },
  { login: "islrica", turno: "D5", procesos: ["Pick","Dock"], color: "#FFD6A5" },
  { login: "anorvpma", turno: "DX", procesos: ["Pick","Dock"], color: "#FDFFB6" },
];

function renderCalendar(date) {
  calendar.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = date.toLocaleString("es-MX", { month: "long", year: "numeric" });

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = d;
    dayDiv.onclick = () => showAssignPopup(d, month, year);
    calendar.appendChild(dayDiv);
  }
}

function showAssignPopup(day, month, year) {
  const selectedDate = `${year}-${month+1}-${day}`;
  let html = `<h3>${selectedDate}</h3>`;
  html += "<p>Selecciona un asociado para asignar vacaciones o DP:</p><ul>";
  for (const a of asociados) {
    html += `<li style="color:${a.color}">${a.login} (${a.turno}) - ${a.procesos.join(", ")}</li>`;
  }
  html += "</ul>";
  popupContent.innerHTML = html;
  popup.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
}

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

renderCalendar(currentDate);
