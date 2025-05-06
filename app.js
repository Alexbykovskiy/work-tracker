
const db = firebase.firestore();

// --- ЛОКАЦИИ ---
async function loadLocations() {
  const snapshot = await db.collection("locations").get();
  const locations = snapshot.docs.map(doc => doc.data().name);
  const selects = document.querySelectorAll(".location-select");

  selects.forEach(select => {
    select.innerHTML = "";
    locations.forEach(loc => {
      const option = document.createElement("option");
      option.value = loc;
      option.textContent = loc;
      select.appendChild(option);
    });
  });
}

// ДОХОДЫ
document.getElementById("income-date").valueAsDate = new Date();

document.getElementById("income-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const locationInput = document.getElementById("income-location-input").value.trim();
  const locationSelect = document.getElementById("income-location").value.trim();
  const location = locationInput || locationSelect;

  if (locationInput) {
    await db.collection("locations").add({ name: location });
    await loadLocations(); // обновить список
  }

  const doc = {
    date: document.getElementById("income-date").value,
    timeFrom: document.getElementById("time-from").value,
    timeTo: document.getElementById("time-to").value,
    type: document.getElementById("income-type").value,
    amount: parseFloat(document.getElementById("income-amount").value.replace(',', '.')),
    tags: document.getElementById("income-tags").value.trim(),
    comment: document.getElementById("income-comment").value.trim(),
    location
  };

  await db.collection("tattoo_income").add(doc);
  alert("Доход сохранён");
  document.getElementById("income-form").reset();
  document.getElementById("income-date").valueAsDate = new Date();
});

// РАСХОДЫ
document.getElementById("expense-date").valueAsDate = new Date();

document.getElementById("expense-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const locationInput = document.getElementById("expense-location-input").value.trim();
  const locationSelect = document.getElementById("expense-location").value.trim();
  const location = locationInput || locationSelect;

  if (locationInput) {
    await db.collection("locations").add({ name: location });
    await loadLocations();
  }

  const doc = {
    date: document.getElementById("expense-date").value,
    category: document.getElementById("expense-category").value,
    amount: parseFloat(document.getElementById("expense-amount").value.replace(',', '.')),
    tags: document.getElementById("expense-tags").value.trim(),
    comment: document.getElementById("expense-comment").value.trim(),
    location
  };

  await db.collection("tattoo_expenses").add(doc);
  alert("Расход сохранён");
  document.getElementById("expense-form").reset();
  document.getElementById("expense-date").valueAsDate = new Date();
});

window.addEventListener("DOMContentLoaded", () => {
  loadLocations();
});


async function loadJournal() {
  const journal = [];

  const [incomeSnap, expenseSnap] = await Promise.all([
    db.collection("tattoo_income").orderBy("date", "desc").get(),
    db.collection("tattoo_expenses").orderBy("date", "desc").get()
  ]);

  incomeSnap.forEach(doc => journal.push({ type: "income", id: doc.id, ...doc.data() }));
  expenseSnap.forEach(doc => journal.push({ type: "expense", id: doc.id, ...doc.data() }));

  journal.sort((a, b) => b.date.localeCompare(a.date));

  const list = document.getElementById("journal-list");
  list.innerHTML = "";

  journal.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = entry.type === "income" ? "entry income" : "entry expense";

    const meta = entry.type === "income"
      ? `${entry.type} | ${entry.date} | ${entry.timeFrom}–${entry.timeTo} | ${entry.type || ""}`
      : `${entry.type} | ${entry.date} | ${entry.category}`;

    const desc = entry.comment ? `Комментарий: ${entry.comment}` : "";
    const loc = entry.location ? `Локация: ${entry.location}` : "";
    const tags = entry.tags ? `#${entry.tags}` : "";

    li.innerHTML = `
      <div><strong>€${Number(entry.amount).toFixed(2)}</strong></div>
      <div>${meta}</div>
      <div>${loc} ${tags}</div>
      <div>${desc}</div>
    `;
    list.appendChild(li);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadLocations();
  loadJournal();
});
