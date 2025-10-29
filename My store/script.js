async function fetchProducts() {
  const response = await fetch('products.json');
  return await response.json();
}

let products = {};
let cart = [];

fetchProducts().then(data => products = data);

function showProducts(category) {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("products-page").classList.remove("hidden");
  document.getElementById("category-title").innerText = category;

  const container = document.getElementById("products-container");
  container.innerHTML = "";

  products[category].forEach(item => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Rs. ${item.price}</p>
      <button class="add-btn" onclick="addToCart('${item.name}', ${item.price}, '${item.img}')">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function goHome() {
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("products-page").classList.add("hidden");
}

function addToCart(name, price, img) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity += 1;
  else cart.push({ name, price, img, quantity: 1 });
  updateCart();
}

function updateCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  const countBadge = document.getElementById("cart-count");

  cartContainer.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.img}" alt="${item.name}">
        <div><h4>${item.name}</h4><p>Rs. ${item.price} x ${item.quantity}</p></div>
      </div>
      <div class="cart-item-actions">
        <button onclick="changeQuantity('${item.name}', 1)">+</button>
        <button onclick="changeQuantity('${item.name}', -1)">-</button>
      </div>`;
    cartContainer.appendChild(itemDiv);
    total += item.price * item.quantity;
    count += item.quantity;
  });

  totalElement.innerText = `Total: Rs. ${total}`;
  countBadge.innerText = count > 0 ? count : "";
}

function changeQuantity(name, change) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
  updateCart();
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("active");
}

function orderWhatsApp() {
  if (cart.length === 0) return alert("Your cart is empty!");

  let message = "Hello! I'd like to order:\n\n";
  cart.forEach(i => message += `${i.name} - Rs.${i.price} x ${i.quantity}\n`);
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  message += `\nTotal: Rs.${total}`;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
