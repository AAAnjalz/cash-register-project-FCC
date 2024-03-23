let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const displayChangeDue = document.getElementById("change-due");
const priceScreen = document.getElementById("price-screen");
const cashDrawerDisplay = document.getElementById("cash-drawer-display");

const formatResult = (status, change) => {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
  change.map(
    (money) =>
      (displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
  );
  return;
};

const checkCashRegister = () => {
  if (Number(cash.value) < price) {
    alert("Customer does not have enough money to purchase the item");
    cash.value = "";
    return;
  }
  if (Number(cash.value) === price) {
    displayChangeDue.innerHTML =
      "No change due - customer paid with exact cash";
    cash.value = "";
    return;
  }
  let changeDue = Number(cash.value) - price;
  let reverseCid = [...cid].reverse();
  let denomination = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  let result = { status: "OPEN", change: [] };
  let totalCID = parseFloat(
    cid
      .map((total) => total[1])
      .reduce((prev, curr) => prev + curr)
      .toFixed(2)
  );
  if (totalCID < changeDue) {
    return (displayChangeDue.innerHTML = "Status: INSUFFICIENT_FUNDS");
  }
  if (totalCID === changeDue) {
    result.status = "CLOSED";
  }

  for (let i = 0; i <= reverseCid.length; i++) {
    if (changeDue > denomination[i] && changeDue > 0) {
      let count = 0;
      let total = reverseCid[i][1];
      while (total > 0 && changeDue >= denomination[i]) {
        total -= denomination[i];
        changeDue = parseFloat((changeDue -= denomination[i]).toFixed(2));
        count++;
      }
      if (count > 0) {
        result.change.push([reverseCid[i][0], count * denomination[i]]);
      }
    }
  }
  if (changeDue > 0) {
    return (displayChangeDue.innerHTML = "Status: INSUFFICIENT_FUNDS");
  }
  formatResult(result.status, result.change);
  updateUI(result.change);
};

const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkCashRegister();
};

const updateUI = (change) => {
  const currencyNameMap = {
    PENNY: "Pennies",
    NICKEL: "Nickels",
    DIME: "Dimes",
    QUARTER: "Quarters",
    ONE: "Ones",
    FIVE: "Fives",
    TEN: "Tens",
    TWENTY: "Twenties",
    "ONE HUNDRED": "Hundreds",
  };
  if (change) {
    change.forEach((changeArr) => {
      const targetArr = cid.find((cidArr) => cidArr[0] === changeArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
  }
  cash.value = "";
  priceScreen.textContent = `Total: $${price}`;
  cashDrawerDisplay.innerHTML = `<strong>Change in drawer:</strong>
  ${cid
    .map((money) => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`)
    .join("")}
  `;
  cashDrawerDisplay.style.backgroundColor = "bisque";
  displayChangeDue.style.backgroundColor = "black";
};

purchaseBtn.addEventListener("click", checkResults);
