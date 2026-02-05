let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

const transactionList = document.getElementById("transactionList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const filterType = document.getElementById("filterType");

document.getElementById("transactionForm").addEventListener("submit", addTransaction);
filterType.addEventListener("change", renderTransactions);

function addTransaction(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type
  };

  transactions.push(transaction);
  saveAndRender();
  e.target.reset();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  calculateTotals();
  updateChart();
}

function renderTransactions() {
  transactionList.innerHTML = "";

  const filtered = transactions.filter(t => 
    filterType.value === "all" || t.type === filterType.value
  );

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.classList.add("transaction", t.type);

    li.innerHTML = `
      ${t.description} - ₹${t.amount}
      <span class="delete" onclick="deleteTransaction(${t.id})">✖</span>
    `;

    transactionList.appendChild(li);
  });
}

function calculateTotals() {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
}

function updateChart() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  if (chart) chart.destroy();

  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["green", "red"]
      }]
    }
  });
}

// Initial Load
renderTransactions();
calculateTotals();
updateChart();
