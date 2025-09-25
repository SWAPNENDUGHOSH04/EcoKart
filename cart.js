const CART_KEY = 'ecokart-cart';

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function addToCart(productId, quantity = 1) {
  quantity = parseInt(quantity);
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity: quantity });
  }
  saveCart(cart);
  updateCartCount();
  showCartToast(); 
}


function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
  renderCartSummary();
}

function updateCartItem(productId, quantity) {
  quantity = parseInt(quantity);
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
    updateCartCount();
    renderCartSummary();
  }
}

async function renderCartSummary() {
  const container = document.getElementById('cart-summary');
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  const products = await loadProducts();
  let subtotal = 0;
  container.innerHTML = "";
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    container.innerHTML += `
      <div class="mb-4 border-b pb-2">
        <h3 class="font-bold">${product.name}</h3>
        <p>$${product.price.toFixed(2)} × 
          <input type="number" value="${item.quantity}" min="1" class="w-16 border rounded p-1" onchange="updateCartItem(${product.id}, this.value)">
        </p>
        <p>Total: $${itemTotal.toFixed(2)}</p>
        <button onclick="removeFromCart(${product.id})" class="text-red-500 text-sm">Remove</button>
      </div>
    `;
  });
  const shipping = 5.00;
  const tax = subtotal * 0.05;  
  let discount = 0;
  if (appliedCoupon){
    if (appliedCoupon.type === 'percentage'){
      discount = subtotal*(appliedCoupon.value /100);
    }
    else if (appliedCoupon.type === 'fixed'){
      discount = appliedCoupon.value;
    }
  }
  const total = subtotal + shipping + tax - discount;
  container.innerHTML += `
    <hr class="my-4">
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
     <p>Shipping: $${shipping.toFixed(2)}</p>
    <p>Tax (5%): $${tax.toFixed(2)}</p>
    ${appliedCoupon ? `<p>Discount (${appliedCoupon.type === 'percentage' ? appliedCoupon.value + '%': '$'+ appliedCoupon.value}): -$${discount.toFixed(2)}</p>`: ''}
    <p class="font-bold">Total: $${total.toFixed(2)}</p>
  `;
}
function checkEmptyCart() {
  const cart = getCart();
  if (cart.length === 0) {
    showEmptyCartModal();
  }
}
let orderTimeout;

function showOrderPlacedModal() {
  console.log()
  const modal = document.getElementById('order-successful-modal');
  modal.classList.remove('hidden');

  // Auto-close after 3 seconds
  orderTimeout = setTimeout(() => {
    closeOrderPlacedModal();
  }, 3000);
}

function closeOrderPlacedModal() {
  const modal = document.getElementById('order-successful-modal');
  modal.classList.add('hidden');

  if (orderTimeout) {
    clearTimeout(orderTimeout);
    orderTimeout = null;
  }
}

function showCartToast() {
  const toast = document.getElementById('cart-toast');

  // Show and slide down
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.remove('-translate-y-full');
    toast.classList.add('translate-y-0');
  }, 10); // slight delay ensures transition runs

  // Auto-hide after 2.5s
  setTimeout(() => {
    toast.classList.remove('translate-y-0');
    toast.classList.add('-translate-y-full');
    setTimeout(() => toast.classList.add('hidden'), 300); // wait for animation to finish
  }, 1700);
}
