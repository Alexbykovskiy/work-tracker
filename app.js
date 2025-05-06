function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
}

const db = firebase.firestore();

// Функция для создания формы дохода
function createIncomeForm() {
  const incomeDiv = document.getElementById("income");
  incomeDiv.innerHTML = `
    <h2>Добавить доход</h2>
    <form id="incomeForm">
      <label>Дата: <input type="date" id="incomeDate" required></label><br/>
      <label>С: <input type="time" id="incomeFrom" required></label>
      <label>До: <input type="time" id="incomeTo" required></label><br/>
      <label>Тип:
        <select id="incomeType">
          <option>новая</option>
          <option>cover-up</option>
          <option>коррекция</option>
        </select>
      </label><br/>
      <label>Стоимость (€): <input type="number" id="incomeAmount" step="0.01" required></label><br/>
      <label>Теги: <input type="text" id="incomeTags" placeholder="черно-белая, рука"></label><br/>
      <label>Комментарий:<br/>
        <textarea id="incomeComment"></textarea>
      </label><br/>
      <button type="submit">Сохранить доход</button>
    </form>
  `;
  document.getElementById("incomeDate").valueAsDate = new Date();

  document.getElementById("incomeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const doc = {
      date: document.getElementById("incomeDate").value,
      timeFrom: document.getElementById("incomeFrom").value,
      timeTo: document.getElementById("incomeTo").value,
      type: document.getElementById("incomeType").value,
      amount: parseFloat(document.getElementById("incomeAmount").value),
      tags: document.getElementById("incomeTags").value.split(",").map(t => t.trim()).filter(t => t),
      comment: document.getElementById("incomeComment").value
    };
    await db.collection("tattoo_income").add(doc);
    alert("Доход сохранён");
    e.target.reset();
    document.getElementById("incomeDate").valueAsDate = new Date();
  });
}

// Функция для создания формы расхода
function createExpenseForm() {
  const expenseDiv = document.getElementById("expenses");
  expenseDiv.innerHTML = `
    <h2>Добавить расход</h2>
    <form id="expenseForm">
      <label>Дата: <input type="date" id="expenseDate" required></label><br/>
      <label>Категория:
        <select id="expenseCategory">
          <option>питание</option>
          <option>проезд</option>
          <option>жильё</option>
          <option>картриджи</option>
          <option>краски</option>
          <option>химия</option>
          <option>оборудование</option>
        </select>
      </label><br/>
      <label>Сумма (€): <input type="number" id="expenseAmount" step="0.01" required></label><br/>
      <label>Теги: <input type="text" id="expenseTags" placeholder="путешествие, акция"></label><br/>
      <label>Комментарий:<br/>
        <textarea id="expenseComment"></textarea>
      </label><br/>
      <button type="submit">Сохранить расход</button>
    </form>
  `;
  document.getElementById("expenseDate").valueAsDate = new Date();

  document.getElementById("expenseForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const doc = {
      date: document.getElementById("expenseDate").value,
      category: document.getElementById("expenseCategory").value,
      amount: parseFloat(document.getElementById("expenseAmount").value),
      tags: document.getElementById("expenseTags").value.split(",").map(t => t.trim()).filter(t => t),
      comment: document.getElementById("expenseComment").value
    };
    await db.collection("tattoo_expenses").add(doc);
    alert("Расход сохранён");
    e.target.reset();
    document.getElementById("expenseDate").valueAsDate = new Date();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  createIncomeForm();
  createExpenseForm();
});

// Подключение к Firebase и табам остаётся как есть

// Вспомогательная функция для перевода часов в дни с десятыми
function formatHoursToDays(hours) {
  const days = hours / 24;
  return `${hours.toFixed(1)} ч (${days.toFixed(1)} дн)`;
}

// Создание аналитики
async function createAnalytics() {
  const analyticsDiv = document.getElementById("analytics");
  analyticsDiv.innerHTML = "<h2>Анализ</h2><p>Загрузка...</p>";

  const now = new Date();
  const start = new Date("2024-01-01"); // Дата запуска приложения (можно менять)
  const totalHoursAvailable = (now - start) / (1000 * 60 * 60);

  let incomeSnapshot = await db.collection("tattoo_income").get();
  let expenseSnapshot = await db.collection("tattoo_expenses").get();

  let incomeSum = 0;
  let workHours = 0;
  let incomeByType = {};

  incomeSnapshot.forEach(doc => {
    const data = doc.data();
    incomeSum += data.amount || 0;

    // подсчёт часов
    if (data.timeFrom && data.timeTo) {
      const [h1, m1] = data.timeFrom.split(":").map(Number);
      const [h2, m2] = data.timeTo.split(":").map(Number);
      const diff = (h2 + m2 / 60) - (h1 + m1 / 60);
      if (diff > 0) workHours += diff;
    }

    // по типу
    if (data.type) {
      if (!incomeByType[data.type]) incomeByType[data.type] = 0;
      incomeByType[data.type] += data.amount || 0;
    }
  });

  let expenseSum = 0;
  let expensesByCategory = {};

  expenseSnapshot.forEach(doc => {
    const data = doc.data();
    expenseSum += data.amount || 0;
    if (data.category) {
      if (!expensesByCategory[data.category]) expensesByCategory[data.category] = 0;
      expensesByCategory[data.category] += data.amount || 0;
    }
  });

  const freeHours = totalHoursAvailable - workHours;
  const incomeFormatted = formatHoursToDays(workHours);
  const freeFormatted = formatHoursToDays(freeHours);

  analyticsDiv.innerHTML = `
    <h3>Доходы и расходы</h3>
    <canvas id="chart1" width="400" height="400"></canvas>
    <h3>Время в студии и свободное</h3>
    <p><b>Работа:</b> ${incomeFormatted} &nbsp;&nbsp; <b>Свободное:</b> ${freeFormatted}</p>
    <canvas id="chart2" width="400" height="400"></canvas>
  `;

  // Диаграммы
  new Chart(document.getElementById("chart1"), {
    type: 'pie',
    data: {
      labels: ["Доходы", "Расходы"],
      datasets: [{
        data: [incomeSum.toFixed(2), expenseSum.toFixed(2)],
        backgroundColor: ["#4caf50", "#f44336"]
      }]
    }
  });

  new Chart(document.getElementById("chart2"), {
    type: 'pie',
    data: {
      labels: ["Работа", "Свободное"],
      datasets: [{
        data: [workHours.toFixed(1), freeHours.toFixed(1)],
        backgroundColor: ["#2196f3", "#9e9e9e"]
      }]
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  createIncomeForm();
  createExpenseForm();
  createAnalytics();
});
