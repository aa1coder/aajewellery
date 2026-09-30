// ---------------------------
// PRODUCT DATA
// ---------------------------
const products = [
  { 
    name: "Gold Ring", 
    image: "images/rings/ringtest2.jpg", 
    description: "18K gold band lined with micro-diamonds for timeless elegance.",
    price: 799,
    category: "rings"
  },
  { 
    name: "Silver Ring", 
    image: "images/rings/ringtest1.jpg", 
    description: "A smooth sterling silver band crafted for daily sophistication.",
    price: 199,
    category: "rings"
  },
  {
    name: "Another Ring",
    image: "images/rings/ringtest3.jpg",
    description: "A 14K rose gold ring with diamond halo polish",
    price: 499,
    category: "rings"
  },
  { 
    name: "Pink Ring", 
    image: "images/rings/ringtest4.jpg", 
    description: "A smooth sterling silver band crafted for daily sophistication.",
    price: 239,
    category: "rings"
  },
  {
    name: "Ring Again",
    image: "images/rings/ringtest.jpg",
    description: "A 14K rose gold ring with diamond halo polish",
    price: 250,
    category: "rings"
  },
  { 
    name: "Diamond Necklace", 
    image: "images/necklaces/necklacetest.jpg", 
    description: "Elegant 24K diamond necklace designed to capture every sparkle.",
    price: 1299,
    category: "necklaces"
  },
  { 
    name: "Pearl Necklace", 
    image: "images/necklaces/necklacetest1.jpg", 
    description: "A 10K pearl necklace that blends classic grace with modern charm.",
    price: 649,
    category: "necklaces"
  },
  { 
    name: "Diamond Necklace 2", 
    image: "images/necklaces/necklacetest2.jpg", 
    description: "Elegant 24K diamond necklace designed to capture every sparkle.",
    price: 1299,
    category: "necklaces"
  },
  { 
    name: "Diamond Necklace 3", 
    image: "images/necklaces/necklacetest3.jpg", 
    description: "Elegant 24K diamond necklace designed to capture every sparkle.",
    price: 1299,
    category: "necklaces"
  },
  { 
    name: "Diamond Necklace 4", 
    image: "images/necklaces/necklacetest4.jpg", 
    description: "Elegant 24K diamond necklace designed to capture every sparkle.",
    price: 1299,
    category: "necklaces"
  },
  { 
    name: "Diamond Necklace 5", 
    image: "images/necklaces/necklacetest5.jpg", 
    description: "Elegant 24K diamond necklace designed to capture every sparkle.",
    price: 1299,
    category: "necklaces"
  },
  { 
    name: "Gold Bracelet", 
    image: "images/bracelets/braceletstest.jpg", 
    description: "24K gold bracelet with a smooth, polished finish that complements any outfit.",
    price: 799,
    category: "bracelets"
  },
  { 
    name: "Silver Bracelet", 
    image: "images/bracelets/braceletstest1.jpg", 
    description: "10K silver bracelet with a clean modern design, ideal for daily wear.",
    price: 299,
    category: "bracelets"
  },
  { 
    name: "Diamond Charm Bracelet", 
    image: "images/bracelets/braceletstest2.jpg", 
    description: "A diamond-studded charm bracelet crafted for timeless elegance.",
    price: 999,
    category: "bracelets"
  },
  { 
    name: "Diamond Stud Earrings", 
    image: "images/earrings/earringstest1.jpg",
    description: "14K gold diamond studs that shine from every angle — classic and elegant.",
    price: 499,
    category: "earrings"
  },
  { 
    name: "Pearl Drop Earrings", 
    image: "images/earrings/earringstest.jpg",
    description: "10K pearl drop earrings designed for timeless sophistication.",
    price: 399,
    category: "earrings"
  },
  { 
    name: "Gold Hoop Earrings", 
    image: "images/earrings/earringstest2.jpg",
    description: "24K gold hoops with a smooth polished finish — a modern essential.",
    price: 299,
    category: "earrings"
  }
];

// ---------------------------
// CART & WISHLIST STATE
// ---------------------------
let cart = JSON.parse(localStorage.getItem('aa-cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('aa-wishlist') || '[]');

function saveCart() {
  localStorage.setItem('aa-cart', JSON.stringify(cart));
  updateCartBadge();
}

function saveWishlist() {
  localStorage.setItem('aa-wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  if (!badge) return;
  badge.textContent = wishlist.length;
  badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
}

function addToCart(product) {
  const existing = cart.find(i => i.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showToast(`🛒 "${product.name}" added to cart!`);
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  renderCartItems();
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(name);
  else { saveCart(); renderCartItems(); }
}

function toggleWishlist(product) {
  const idx = wishlist.findIndex(i => i.name === product.name);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    saveWishlist();
    showToast(`💔 Removed from wishlist`);
  } else {
    wishlist.push({ ...product });
    saveWishlist();
    showToast(`❤️ Added to wishlist!`);
  }
  // Refresh heart icon in modal if open
  const heartBtn = document.getElementById('modal-wishlist-btn');
  if (heartBtn) {
    const inWishlist = wishlist.some(i => i.name === product.name);
    heartBtn.classList.toggle('active', inWishlist);
    heartBtn.textContent = inWishlist ? '❤️ Wishlisted' : '🤍 Wishlist';
  }
  // Refresh any heart icons on product cards
  document.querySelectorAll(`.item-heart[data-name="${product.name}"]`).forEach(btn => {
    btn.classList.toggle('active', wishlist.some(i => i.name === product.name));
  });
}

// ---------------------------
// TOAST NOTIFICATION
// ---------------------------
function showToast(message) {
  let toast = document.getElementById('aa-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'aa-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---------------------------
// RENDER PRODUCTS
// ---------------------------
function renderProducts(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const filtered = products.filter(p => p.category === category);

  filtered.forEach(product => {
    const inWishlist = wishlist.some(i => i.name === product.name);
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
      <div class="item-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="item-heart ${inWishlist ? 'active' : ''}" data-name="${product.name}" title="Add to Wishlist">
          ${inWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <h3>${product.name}</h3>
      <p class="item-desc">${product.description}</p>
      <p class="item-price"><strong>$${product.price}</strong></p>
      <button class="btn-add-cart">Add to Cart</button>
    `;

    // Heart toggle — stop propagation so modal doesn't open
    item.querySelector('.item-heart').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(product);
      const btn = e.currentTarget;
      const nowInWishlist = wishlist.some(i => i.name === product.name);
      btn.textContent = nowInWishlist ? '❤️' : '🤍';
      btn.classList.toggle('active', nowInWishlist);
    });

    // Add to cart — stop propagation so modal doesn't open
    item.querySelector('.btn-add-cart').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product);
    });

    // Click card to open modal
    item.addEventListener("click", () => openModal(product));
    container.appendChild(item);
  });
}

// ---------------------------
// MODAL LOGIC
// ---------------------------
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-description");
const closeModalBtn = document.querySelector(".close");

function openModal(product) {
  modal.style.display = "flex";
  modalImg.src = product.image;
  modalTitle.textContent = product.name;
  modalPrice.textContent = `$${product.price}`;
  modalDesc.textContent = product.description;

  // Inject action buttons into modal if not already there
  let modalActions = document.getElementById('modal-actions');
  if (!modalActions) {
    modalActions = document.createElement('div');
    modalActions.id = 'modal-actions';
    modalActions.innerHTML = `
      <button id="modal-cart-btn" class="btn-modal-cart">🛒 Add to Cart</button>
      <button id="modal-wishlist-btn" class="btn-modal-wish"></button>
    `;
    document.querySelector('.modal-info').appendChild(modalActions);
  }

  const inWishlist = wishlist.some(i => i.name === product.name);
  const wishBtn = document.getElementById('modal-wishlist-btn');
  wishBtn.textContent = inWishlist ? '❤️ Wishlisted' : '🤍 Wishlist';
  wishBtn.classList.toggle('active', inWishlist);

  document.getElementById('modal-cart-btn').onclick = () => addToCart(product);
  wishBtn.onclick = () => toggleWishlist(product);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => { modal.style.display = "none"; });
}
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// ---------------------------
// CART DRAWER
// ---------------------------
function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}

function renderCartItems() {
  const list = document.getElementById('cart-items-list');
  const total = document.getElementById('cart-total');
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    total.textContent = '';
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price}</p>
        <div class="cart-qty">
          <button onclick="changeQty('${item.name}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.name}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">✕</button>
    </div>
  `).join('');

  const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  total.innerHTML = `<span>Total:</span> <strong>$${sum.toLocaleString()}</strong>`;
}

// ---------------------------
// WISHLIST DRAWER
// ---------------------------
function openWishlist() {
  document.getElementById('wishlist-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  renderWishlistItems();
}

function closeWishlist() {
  document.getElementById('wishlist-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}

function renderWishlistItems() {
  const list = document.getElementById('wishlist-items-list');
  if (!list) return;

  if (wishlist.length === 0) {
    list.innerHTML = '<p class="cart-empty">Your wishlist is empty.</p>';
    return;
  }

  list.innerHTML = wishlist.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price}</p>
        <button class="btn-wish-to-cart" onclick="moveToCart('${item.name}')">Move to Cart</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromWishlist('${item.name}')">✕</button>
    </div>
  `).join('');
}

function removeFromWishlist(name) {
  wishlist = wishlist.filter(i => i.name !== name);
  saveWishlist();
  renderWishlistItems();
  document.querySelectorAll(`.item-heart[data-name="${name}"]`).forEach(btn => {
    btn.textContent = '🤍';
    btn.classList.remove('active');
  });
}

function moveToCart(name) {
  const item = wishlist.find(i => i.name === name);
  if (item) {
    addToCart(item);
    removeFromWishlist(name);
    renderWishlistItems();
  }
}

// ---------------------------
// SEARCH
// ---------------------------
function setupSearch() {
  const input = document.getElementById('search-input');
  const resultsBox = document.getElementById('search-results');
  if (!input || !resultsBox) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { resultsBox.style.display = 'none'; return; }

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      resultsBox.innerHTML = '<p class="search-no-result">No results found.</p>';
    } else {
      resultsBox.innerHTML = matches.map(p => `
        <div class="search-result-item" data-name="${p.name}">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <p class="sr-name">${p.name}</p>
            <p class="sr-price">$${p.price}</p>
          </div>
        </div>
      `).join('');

      resultsBox.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
          const product = products.find(p => p.name === el.dataset.name);
          if (product) {
            openModal(product);
            input.value = '';
            resultsBox.style.display = 'none';
          }
        });
      });
    }
    resultsBox.style.display = 'block';
  });

  // Hide on click outside
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
      resultsBox.style.display = 'none';
    }
  });
}

// ---------------------------
// INJECT HEADER UI (cart, wishlist, search icons)
// ---------------------------
function injectHeaderUI() {
  const header = document.querySelector('header');
  if (!header || document.getElementById('header-actions')) return;

  const actions = document.createElement('div');
  actions.id = 'header-actions';
  actions.innerHTML = `
    <div class="search-wrap">
      <input type="text" id="search-input" placeholder="Search jewellery…" autocomplete="off">
      <div id="search-results" class="search-results"></div>
    </div>
    <button class="header-icon-btn" id="wishlist-btn" title="Wishlist">
      🤍
      <span class="icon-badge" id="wishlist-badge" style="display:none">0</span>
    </button>
    <button class="header-icon-btn" id="cart-btn" title="Cart">
      🛒
      <span class="icon-badge" id="cart-badge" style="display:none">0</span>
    </button>
  `;
  header.appendChild(actions);

  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('wishlist-btn').addEventListener('click', openWishlist);

  updateCartBadge();
  updateWishlistBadge();
  setupSearch();
}

// ---------------------------
// INJECT DRAWERS INTO PAGE
// ---------------------------
function injectDrawers() {
  if (document.getElementById('cart-drawer')) return;

  const html = `
    <div id="drawer-overlay" class="drawer-overlay"></div>

    <!-- Cart Drawer -->
    <div id="cart-drawer" class="drawer">
      <div class="drawer-header">
        <h2>Your Cart</h2>
        <button class="drawer-close" onclick="closeCart()">✕</button>
      </div>
      <div id="cart-items-list" class="drawer-items"></div>
      <div id="cart-total" class="cart-total-row"></div>
      <button class="btn-checkout">Proceed to Checkout</button>
    </div>

    <!-- Wishlist Drawer -->
    <div id="wishlist-drawer" class="drawer">
      <div class="drawer-header">
        <h2>Your Wishlist</h2>
        <button class="drawer-close" onclick="closeWishlist()">✕</button>
      </div>
      <div id="wishlist-items-list" class="drawer-items"></div>
    </div>

    <!-- Toast -->
    <div id="aa-toast"></div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('drawer-overlay').addEventListener('click', () => {
    closeCart();
    closeWishlist();
  });
}

// ---------------------------
// INIT
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  injectDrawers();
  injectHeaderUI();

  [
    { category: "rings",     id: "rings-list" },
    { category: "necklaces", id: "necklaces-list" },
    { category: "bracelets", id: "bracelets-list" },
    { category: "earrings",  id: "earrings-list" }
  ].forEach(({ category, id }) => {
    if (document.getElementById(id)) renderProducts(category, id);
  });
});