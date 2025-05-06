
const db = firebase.firestore();

// ДОХОДЫ (tattoo_income)
document.getElementById("income-date").valueAsDate = new Date();

document.getElementById("income-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const doc = {
    date: document.getElementById("income-date").value,
    timeFrom: document.getElementById("time-from").value,
    timeTo: document.getElementById("time-to").value,
    type: document.getElementById("income-type").value,
    amount: parseFloat(document.getElementById("income-amount").value.replace(',', '.')),
    tags: document.getElementById("income-tags").value.trim(),
    comment: document.getElementById("income-comment").value.trim()
  };

  await db.collection("tattoo_income").add(doc);
  alert("Доход сохранён");
  document.getElementById("income-form").reset();
  document.getElementById("income-date").valueAsDate = new Date();
});

// РАСХОДЫ (tattoo_expenses)
document.getElementById("expense-date").valueAsDate = new Date();

document.getElementById("expense-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const doc = {
    date: document.getElementById("expense-date").value,
    category: document.getElementById("expense-category").value,
    amount: parseFloat(document.getElementById("expense-amount").value.replace(',', '.')),
    tags: document.getElementById("expense-tags").value.trim(),
    comment: document.getElementById("expense-comment").value.trim()
  };

  await db.collection("tattoo_expenses").add(doc);
  alert("Расход сохранён");
  document.getElementById("expense-form").reset();
  document.getElementById("expense-date").valueAsDate = new Date();
});
