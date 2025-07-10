rtxDiv.innerHTML += `
  <div style="background:#394a7a; margin:6px; padding:10px; border-radius:8px;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>${stock.name}</div>
      <div>${stock.price.toLocaleString()} เครดิต</div>
    </div>
    <div style="margin-top:6px; display:flex; gap:6px;">
      <input type="number" id="buy-count-rtx-${idx}" min="1" value="1" style="width:60px;">
      <button class="primary" onclick="buyStock('rtx', ${idx})">ซื้อ</button>
    </div>
  </div>`;
function buyStock(type, idx) {
  if (!currentUser) {
    alert('กรุณาเข้าสู่ระบบก่อนซื้อหุ้น');
    return;
  }

  const inputId = `buy-count-${type}-${idx}`;
  const count = parseInt(document.getElementById(inputId).value) || 1;
  const price = stocks[type][idx].price;
  const total = price * count;

  if (count < 1) {
    alert('จำนวนหุ้นต้องมากกว่า 0');
    return;
  }

  if (currentUser.credit < total) {
    alert('เครดิตไม่เพียงพอ');
    return;
  }

  if (!currentUser.stocks) currentUser.stocks = {};
  const key = `${type}-${idx}`;
  currentUser.stocks[key] = (currentUser.stocks[key] || 0) + count;
  currentUser.credit -= total;

  saveAll();
  alert(`ซื้อหุ้น ${stocks[type][idx].name} จำนวน ${count} หุ้น สำเร็จ`);
  renderProfile();
  renderUserStocks();
}
function applyDailyProfitOncePerDay() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastProfitDate = localStorage.getItem('lastProfitDate');

  if (today === lastProfitDate) return; // คำนวณแล้ว

  users.forEach(user => {
    let profit = getTodayProfit(user);
    user.credit += profit;
  });

  localStorage.setItem('lastProfitDate', today);
  saveAll();
}
init();
applyDailyProfitOncePerDay(); // <<< เพิ่มอันนี้เข้าไป
