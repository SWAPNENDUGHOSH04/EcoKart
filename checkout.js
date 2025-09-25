document.addEventListener('DOMContentLoaded', () => {
  renderCartSummary();

  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      placeOrder();
    }
  });
});

function validateForm() {
  let valid = true;

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const address = document.getElementById('address');

  
  if (!name.value.trim()) {
    showError('name-error');
    valid = false;
  } else {
    hideError('name-error');
  }

  // Email validationn
  if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
    showError('email-error');
    valid = false;
  } else {
    hideError('email-error');
  }

  // Phone validation
  if (!phone.value.trim()) {
    showError('phone-error');
    valid = false;
  } else {
    hideError('phone-error');
  }

  // Address validation
  if (!address.value.trim()) {
    showError('address-error');
    valid = false;
  } else {
    hideError('address-error');
  }

  return valid;
}

function showError(id) {
  document.getElementById(id).classList.remove('hidden');
}

function hideError(id) {
  document.getElementById(id).classList.add('hidden');
}
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


;

function showOrderPlacedModal() {
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

  // Clear timeout if modal is closed manually
  if (orderTimeout) {
    clearTimeout(orderTimeout);
    orderTimeout = null;
  }
}

function placeOrder() {
  const cart = getCart();
  if (cart.length === 0) {
    showEmptyCartModal();
    return;
  }

  const orderId = Math.floor(Math.random() * 1000000);
  localStorage.setItem('ecokart-order', orderId);

  // Show order placed modal
  showOrderPlacedModal();

  // Clear the cart
  localStorage.removeItem('ecokart-cart');
  updateCartCount();

  // Optionally redirect after closing the modal
  setTimeout(() => {
  }, 3500);
}
