const GST_RATE = 0.05;
const SERVICE_RATE = 0.05;

let cart = [];

// ================= RENDER BILL =================
function renderBill() {
  const emptyBill = document.getElementById('emptyBill');
  const container = document.getElementById("billItemsContainer");
  const subtotalEl = document.getElementById("subtotalAmount");
  const taxEl = document.getElementById("taxAmount");
  const serviceEl = document.getElementById("serviceAmount");
  const totalEl = document.getElementById("totalAmount");

  if (cart.length === 0) {
    emptyBill.style.display = 'block';
  } else {
    emptyBill.style.display = 'none';
  }

  container.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    const row = document.createElement("div");
    row.className = "bill-item";
    row.dataset.id = item.id;

    row.innerHTML = `
      <div class="bill-left">
        <strong>${item.name}</strong>
        <div class="qty-controls">
          <button class="qty-btn minus">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn plus">+</button>
        </div>
      </div>
      <div class="bill-right">
        <span>₹${lineTotal}</span>
        <button class="remove-btn">×</button>
      </div>
    `;

    container.appendChild(row);
  });

  const tax = subtotal * GST_RATE;
  const service = subtotal * SERVICE_RATE;
  const total = subtotal + tax + service;

  subtotalEl.textContent = `₹${subtotal}`;
  taxEl.textContent = `₹${tax.toFixed(0)}`;
  serviceEl.textContent = `₹${service.toFixed(0)}`;
  totalEl.textContent = `₹${total.toFixed(0)}`;

  totalEl.style.transform = 'scale(1.05)';
  setTimeout(() => {
    totalEl.style.transform = 'scale(1)';
  }, 120);
}

// ================= CART OPERATIONS =================
function addToCart(id, name, price) {
  const found = cart.find(item => item.id === id);
  if (found) {
    found.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  renderBill();
}

function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  renderBill();
}

function decreaseQty(id) {
  const index = cart.findIndex(i => i.id === id);
  if (index !== -1) {
    cart[index].qty--;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }
  renderBill();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderBill();
}

// ================= MENU BUTTONS =================
document.querySelectorAll(".add-to-bill").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".menu-card");
    addToCart(
      card.dataset.id,
      card.dataset.name,
      parseInt(card.dataset.price)
    );
  });
});

// ================= BILL EVENTS =================
document.getElementById("billItemsContainer").addEventListener("click", e => {
  const row = e.target.closest(".bill-item");
  if (!row) return;

  const id = row.dataset.id;

  if (e.target.classList.contains("plus")) {
    increaseQty(id);
  }

  if (e.target.classList.contains("minus")) {
    decreaseQty(id);
  }

  if (e.target.classList.contains("remove-btn")) {
    removeItem(id);
  }
});

// ================= PRINT BILL =================
document.querySelector(".print-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("No items to print");
    return;
  }
  window.print();
});

// ================= PAYMENT =================
document.querySelector(".btn-primary").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("No items in bill");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();

  if (!customerName || !customerPhone) {
    alert("Please enter customer details");
    return;
  }

  const billData = {
    customerName,
    customerPhone,
    items: cart,
    subtotal: document.getElementById("subtotalAmount").textContent,
    tax: document.getElementById("taxAmount").textContent,
    service: document.getElementById("serviceAmount").textContent,
    total: document.getElementById("totalAmount").textContent,
    time: new Date().toLocaleString()
  };

  const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
  savedBills.push(billData);
  localStorage.setItem("bills", JSON.stringify(savedBills));

  alert("Payment Successful & Bill Saved!");

  cart = [];
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  renderBill();
});

// ================= CATEGORY FILTER =================
const chips = document.querySelectorAll(".chip");
const menuCards = document.querySelectorAll(".menu-card");

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;

    menuCards.forEach(card => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.classList.remove("hide");
        card.classList.add("show");
      } else {
        card.classList.remove("show");
        card.classList.add("hide");
      }
    });
  });
});
