/* ===== Data ===== */
const products = [
  { id: "c1", name: "Strawberry Dream Cake", category: "Cakes", price: 32, image: "cake.jpg", description: "Vanilla sponge layered with fresh strawberry cream." },
  { id: "c2", name: "Pink Velvet Cake", category: "Cakes", price: 36, image: "cake.jpg", description: "Soft pink velvet with cream cheese frosting." },
  { id: "c3", name: "Rose Cupcakes (6)", category: "Cakes", price: 18, image: "cake.jpg", description: "Buttercream rose-topped cupcakes." },
  { id: "h1", name: "Truffle Box", category: "Chocolates", price: 24, image: "chocolate.jpg", description: "12 hand-rolled dark chocolate truffles." },
  { id: "h2", name: "Pink Praline Bar", category: "Chocolates", price: 9, image: "chocolate.jpg", description: "Ruby chocolate with caramelised hazelnuts." },
  { id: "h3", name: "Cocoa Bonbons", category: "Chocolates", price: 16, image: "chocolate.jpg", description: "Assorted filled bonbons in a gift tin." },
  { id: "b1", name: "Butter Shortbreads", category: "Biscuits", price: 8, image: "biscuits.jpg", description: "Crumbly all-butter shortbread fingers." },
  { id: "b2", name: "Heart Sablés", category: "Biscuits", price: 10, image: "biscuits.jpg", description: "Heart-shaped vanilla sablés dusted with sugar." },
  { id: "b3", name: "Choco-Dipped Cookies", category: "Biscuits", price: 12, image: "biscuits.jpg", description: "Chewy cookies half-dipped in dark chocolate." },
];

/* ===== State ===== */
let cartItems = JSON.parse(localStorage.getItem("sweethome_cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("sweethome_user") || "null");

/* ===== DOM refs ===== */
const loginPage = document.getElementById("login-page");
const homePage = document.getElementById("home-page");
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const userBtn = document.getElementById("user-btn");
const userDropdown = document.getElementById("user-dropdown");
const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const bagBtn = document.getElementById("bag-btn");
const bagCount = document.getElementById("bag-count");
const cartOverlay = document.getElementById("cart-overlay");
const cartSidebar = document.getElementById("cart-sidebar");
const cartClose = document.getElementById("cart-close");
const cartBody = document.getElementById("cart-body");
const cartFooter = document.getElementById("cart-footer");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const toastContainer = document.getElementById("toast-container");

/* ===== Helpers ===== */
function saveCart() {
  localStorage.setItem("sweethome_cart", JSON.stringify(cartItems));
}

function saveUser() {
  localStorage.setItem("sweethome_user", JSON.stringify(currentUser));
}

function showPage(name) {
  if (name === "login") {
    loginPage.classList.remove("hidden");
    homePage.classList.add("hidden");
  } else {
    loginPage.classList.add("hidden");
    homePage.classList.remove("hidden");
  }
}

function toast(message, type = "success") {
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.textContent = message;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-10px)";
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

function formatPrice(n) {
  return "$" + n.toFixed(2);
}

/* ===== Cart ===== */
function addToCart(product) {
  const existing = cartItems.find((i) => i.product.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ product, qty: 1 });
  }
  saveCart();
  renderCart();
  toast(`${product.name} added to bag`);
}

function removeFromCart(id) {
  cartItems = cartItems.filter((i) => i.product.id !== id);
  saveCart();
  renderCart();
}

function setQty(id, qty) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  cartItems = cartItems.map((i) => (i.product.id === id ? { ...i, qty } : i));
  saveCart();
  renderCart();
}

function clearCart() {
  cartItems = [];
  saveCart();
  renderCart();
}

function renderCart() {
  const count = cartItems.reduce((s, i) => s + i.qty, 0);
  const total = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0);

  bagCount.textContent = count;
  bagCount.classList.toggle("hidden", count === 0);

  if (cartItems.length === 0) {
    cartBody.innerHTML = `<p class="cart-empty">Your bag is empty — go pick something sweet.</p>`;
    cartFooter.classList.add("hidden");
  } else {
    cartBody.innerHTML = cartItems
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.product.image}" alt="${item.product.name}" />
          <div class="cart-item-info">
            <h4>${item.product.name}</h4>
            <p>${formatPrice(item.product.price)}</p>
            <div class="cart-qty-row">
              <button class="qty-btn" data-action="minus" data-id="${item.product.id}">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.product.id}">+</button>
              <button class="btn-remove" data-action="remove" data-id="${item.product.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 5 21 19 21 19 6 21 6"/><line x1="18" y1="6" x2="6" y2="6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </div>
        </div>
      `
      )
      .join("");
    cartFooter.classList.remove("hidden");
    cartTotalEl.textContent = formatPrice(total);
  }
}

/* ===== Product Grid ===== */
function renderProducts() {
  const cats = ["Cakes", "Chocolates", "Biscuits"];
  cats.forEach((cat) => {
    const grid = document.getElementById(cat.toLowerCase() + "-grid");
    if (!grid) return;
    const items = products.filter((p) => p.category === cat);
    grid.innerHTML = items
      .map(
        (p) => `
        <article class="product-card">
          <div class="product-img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="product-row">
              <span class="product-price">${formatPrice(p.price)}</span>
              <button class="btn-add" data-id="${p.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  });
}

/* ===== Login ===== */
function handleLogin(e) {
  e.preventDefault();
  const id = document.getElementById("lg-id").value.trim();
  const name = document.getElementById("lg-name").value.trim();
  const email = document.getElementById("lg-email").value.trim();
  const phone = document.getElementById("lg-phone").value.trim();
  const address = document.getElementById("lg-addr").value.trim();

  if (!id || id.length < 6) {
    toast("ID must be at least 6 characters", "error");
    return;
  }
  if (!name) { toast("Name is required", "error"); return; }
  if (!email || !email.includes("@")) { toast("Invalid email", "error"); return; }
  if (!phone) { toast("Phone is required", "error"); return; }
  if (!address) { toast("Address is required", "error"); return; }

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in…";

  setTimeout(() => {
    currentUser = { id, full_name: name, email, phone, address };
    saveUser();
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
    toast("Welcome to SweetHome!");
    enterApp();
  }, 600);
}

function enterApp() {
  if (!currentUser) {
    showPage("login");
    return;
  }
  showPage("home");
  userEmail.textContent = currentUser.email;
  renderProducts();
  renderCart();
  document.getElementById("year").textContent = new Date().getFullYear();
}

function logout() {
  currentUser = null;
  saveUser();
  userDropdown.classList.add("hidden");
  showPage("login");
}

/* ===== Cart UI ===== */
function openCart() {
  cartOverlay.classList.remove("hidden");
  cartSidebar.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay.classList.add("hidden");
  cartSidebar.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ===== Event Delegation ===== */
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".btn-add");
  if (addBtn) {
    const id = addBtn.dataset.id;
    const product = products.find((p) => p.id === id);
    if (product) addToCart(product);
    return;
  }

  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn) {
    const id = qtyBtn.dataset.id;
    const action = qtyBtn.dataset.action;
    const item = cartItems.find((i) => i.product.id === id);
    if (!item) return;
    if (action === "plus") setQty(id, item.qty + 1);
    if (action === "minus") setQty(id, item.qty - 1);
    return;
  }

  const removeBtn = e.target.closest(".btn-remove");
  if (removeBtn) {
    removeFromCart(removeBtn.dataset.id);
    return;
  }

  if (e.target === userBtn) {
    userDropdown.classList.toggle("hidden");
    return;
  }
  if (!e.target.closest(".user-menu")) {
    userDropdown.classList.add("hidden");
  }
});

/* ===== Listeners ===== */
loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", logout);
bagBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
checkoutBtn.addEventListener("click", () => {
  if (cartItems.length === 0) return;
  alert("Thank you! Your order is on its way 🎀");
  clearCart();
  closeCart();
});

/* ===== Init ===== */
enterApp();
