let productsData = {};
let currentSection = '';
let cart = [];

async function loadProducts() {
  const res = await fetch("products.json");
  productsData = await res.json();
}

function openSection(section) {
  currentSection = section;
  document.getElementById("home").classList.add("hidden");
  document.getElementById("products-page").classList.remove("hidden");
  showProducts(section);
}

function showProducts(section) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  productsData[section].forEach((p) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toFixed(2)}</p>
      <button class="add-btn" onclick="addToCart('${section}', '${p.name}')">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

function goHome() {
  document.getElementById("products-page").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

function addToCart(section, name) {
  const product = productsData[section].find((p) => p.name === name);
  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

function updateCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-price");
  const countEl = document.getElementById("cart-count");
  container.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong><br>
        $${item.price.toFixed(2)} × ${item.quantity}
      </div>
      <div class="cart-item-actions">
        <button onclick="removeItem(${index})">−</button>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
  countEl.textContent = count;
}

function removeItem(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}


function toggleCart() {
  document.getElementById("cart").classList.toggle("active");
}

function orderViaWhatsApp() {
  if (cart.length === 0) return alert("Cart is empty!");
  let message = "Hello! I would like to order:\n";
  cart.forEach((item) => {
    message += `${item.name} (x${item.quantity}) - $${item.price * item.quantity}\n`;
  });
  const total = document.getElementById("total-price").textContent;
  message += `\nTotal: $${total}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
}

// Search bar filter
document.getElementById("search-bar").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = productsData[currentSection].filter(p => p.name.toLowerCase().includes(term));
  const container = document.getElementById("products");
  container.innerHTML = "";
  filtered.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button class="add-btn" onclick="addToCart('${currentSection}', '${p.name}')">Add to Cart</button>
    `;
    container.appendChild(div);
  });
});

loadProducts();
