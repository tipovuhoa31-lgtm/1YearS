// ===== DATA =====
const PRODUCTS = {
  'work': { id: 'work', name: 'MASTERING AI for WORK', price: 1290000, oldPrice: 5900000 },
  'media': { id: 'media', name: 'MASTERING AI for MEDIA', price: 1790000, oldPrice: 6900000 },
  'combo': { id: 'combo', name: 'COMBO: WORK & MEDIA', price: 1990000, oldPrice: 12800000 }
};

// ===== STATE =====
let currentUser = JSON.parse(localStorage.getItem('plusai_user')) || null;

// ===== UTILS =====
const formatVND = (n) => n.toLocaleString('vi-VN') + 'đ';
const saveUser = () => localStorage.setItem('plusai_user', JSON.stringify(currentUser));

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

// ===== DIRECT BUY LOGIC =====
function buyNow(productId) {
  if (!PRODUCTS[productId]) return;
  
  // Save selected product for checkout
  sessionStorage.setItem('selected_product', JSON.stringify(PRODUCTS[productId]));
  
  // Redirect directly to checkout
  window.location.href = 'checkout.html';
}

// ===== RENDER CHECKOUT PAGE =====
function renderCheckoutPage() {
  const container = document.getElementById('checkoutOrderItems');
  const totalEl = document.getElementById('checkoutTotal');
  if (!container || !totalEl) return;

  const selectedProduct = JSON.parse(sessionStorage.getItem('selected_product'));
  if (!selectedProduct) {
    window.location.href = 'courses.html';
    return;
  }

  // Check login — đưa về trang đăng ký trước, đăng ký xong mới vào checkout
  if (!currentUser) {
    sessionStorage.setItem('redirect_after_login', 'checkout.html');
    window.location.href = 'register.html';
    return;
  }

  // Pre-fill user data
  const form = document.getElementById('checkoutForm');
  if (form) {
    if(form.fullName) form.fullName.value = currentUser.name || '';
    if(form.email) form.email.value = currentUser.email || '';
    if(form.phone) form.phone.value = currentUser.phone || '';
  }

  container.innerHTML = `
    <div class="order-item">
      <span>${selectedProduct.name}</span>
      <span style="font-weight:600">${formatVND(selectedProduct.price)}</span>
    </div>
  `;
  
  totalEl.textContent = formatVND(selectedProduct.price);
}

// ===== HANDLE CHECKOUT =====
function handleCheckout(e) {
  e.preventDefault();
  const selectedProduct = JSON.parse(sessionStorage.getItem('selected_product'));
  if (!selectedProduct) return;
  
  const orderId = '1YS' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  const orderData = {
    id: orderId,
    items: [selectedProduct],
    total: selectedProduct.price,
    date: new Date().toISOString()
  };
  
  sessionStorage.setItem('last_order', JSON.stringify(orderData));
  sessionStorage.removeItem('selected_product'); // Clear after order
  
  window.location.href = 'success.html';
}

// ===== RENDER SUCCESS PAGE =====
function renderSuccessPage() {
  const orderIdEl = document.getElementById('successOrderId');
  const amountEl = document.getElementById('successAmount');
  const itemsEl = document.getElementById('successItems');
  
  if (!orderIdEl) return;
  
  const orderData = JSON.parse(sessionStorage.getItem('last_order'));
  if (!orderData) {
    window.location.href = 'index.html';
    return;
  }
  
  orderIdEl.textContent = orderData.id;
  amountEl.textContent = formatVND(orderData.total);
  itemsEl.innerHTML = orderData.items.map(i => `<div>• ${i.name}</div>`).join('');
}

// ===== AUTH LOGIC =====
function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value;
  
  currentUser = { name, email, phone };
  saveUser();
  
  const redirect = sessionStorage.getItem('redirect_after_login') || 'index.html';
  sessionStorage.removeItem('redirect_after_login');
  window.location.href = redirect;
}

function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  
  currentUser = { name: 'Học viên PlusAI', email: email, phone: '090xxxxxxx' };
  saveUser();
  
  const redirect = sessionStorage.getItem('redirect_after_login') || 'index.html';
  sessionStorage.removeItem('redirect_after_login');
  window.location.href = redirect;
}

function handleLogout() {
  currentUser = null;
  saveUser();
  window.location.href = 'index.html';
}

function updateAuthUI() {
  const authLinks = document.querySelectorAll('.auth-link');
  if (authLinks.length === 0) return;
  
  authLinks.forEach(link => {
    if (currentUser) {
      link.innerHTML = `<a href="#" onclick="handleLogout()" class="nav-link" style="color:var(--body);font-size:0.9rem">Xin chào, ${currentUser.name.split(' ').pop()}</a>
        <a href="#" onclick="handleLogout()" class="nav-link" style="color:var(--danger)">Đăng xuất</a>`;
    } else {
      link.innerHTML = `<a href="login.html" class="nav-link">Đăng nhập</a>
        <a href="register.html" class="btn btn-outline" style="padding:8px 16px; font-size:0.9rem">Đăng ký</a>`;
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  renderCheckoutPage();
  renderSuccessPage();
});
