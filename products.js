  async function loadProducts() {
    const res = await fetch('data/products.json');
    const products = await res.json();
    return products;
  }

  async function renderProducts() {
    const grid = document.getElementById('products');
    const products = await loadProducts();
    console.log(products)
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = "bg-white/90 border border-green-300 p-4 rounded shadow";
      card.innerHTML = `
  <div class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
    
    <!-- Wishlist Button (top-right) -->
    <button onclick="addToWishlist(${product.id})" 
            class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 hover:text-white">
      ♥
    </button>

    <!-- Product Image -->
    <div class="aspect-w-1 aspect-h-1">
      <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300">
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h2>
      <p class="text-gray-600 mb-4">$${product.price.toFixed(2)}</p>
      <div class="flex justify-between items-center">
        <a href="product.html?id=${product.id}" class="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm">View</a>
        <button onclick="addToCart(${product.id})" class="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-sm">Add to Cart</button>
      </div>
    </div>
  </div>
`;


      grid.appendChild(card);
    });
  }

async function renderProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const products = await loadProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    document.getElementById('product-details').innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.getElementById('product-details').innerHTML = `
    <div class="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow">
      <img src="${product.image}" alt="${product.name}" class="w-full h-60 object-contain rounded mb-4">
      <h1 class="text-2xl font-bold mb-2">${product.name}</h1>
      <p class="text-gray-700 mb-4">${product.description}</p>
      <p class="font-bold mb-4">$${product.price.toFixed(2)}</p>
      <div class="flex gap-2 items-center">
        <input type="number" id="quantity" value="1" min="1" class="border rounded w-20 p-2">
        <button onclick="addToCart(${product.id}, document.getElementById('quantity').value)" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add to Cart</button>
      </div>
    </div>
  `;
}
