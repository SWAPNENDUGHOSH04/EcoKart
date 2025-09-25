const WISHLIST_KEY = 'ecokart-wishlist';

function getWishlist() {
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function addToWishlist(productId) {
  let wishlist = getWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    saveWishlist(wishlist);
    alert("Added to wishlist!");
  } else {
    alert("Already in wishlist!");
  }
}

function removeFromWishlist(productId) {
  let wishlist = getWishlist().filter(id => id !== productId);
  saveWishlist(wishlist);
  renderWishlist();
}

async function renderWishlist() {
  const container = document.getElementById('wishlist-summary');
  const products = await loadProducts();
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  container.innerHTML = "";
  wishlist.forEach(id => {
    const product = products.find(p => p.id === id);
    if (product) {
      container.innerHTML += `
        <div class="border p-4 rounded mb-4 flex justify-between items-center">
          <div>
            <h3 class="font-bold">${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
          </div>
          <div class="flex gap-2">
            <button onclick="addToCart(${product.id})" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">Add to Cart</button>
            <button onclick="removeFromWishlist(${product.id})" class="text-red-500 text-sm">Remove</button>
          </div>
        </div>
      `;
    }
  });
}
