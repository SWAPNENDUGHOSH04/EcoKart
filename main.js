document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (document.getElementById('product-grid')) {
    renderProducts();
  }
  if (document.getElementById('product-details')) {
    renderProductDetails();
  }
  if (document.getElementById('cart-summary')) {
    renderCartSummary();
  }
  if (document.getElementById('order-number')) {
    showOrderNumber();
  }
});
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartSummary();
  checkEmptyCart(); 
});


function showOrderNumber() {
  const number = localStorage.getItem('ecokart-order') || 'N/A';
  document.getElementById('order-number').textContent = number;
}
async function renderProducts(filterCategory = "All") {
  const grid = document.getElementById('products');
  grid.innerHTML = ""; // 
  const products = await loadProducts();

  const filteredProducts = filterCategory === "All"
    ? products
    : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className =
      "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" 
           class="w-full h-48 object-contain">
      <div class="p-4">
        <h2 class="text-lg font-bold text-gray-800 truncate">${product.name}</h2>
        <p class="text-green-700 font-semibold mt-1">$${product.price.toFixed(2)}</p>
        <div class="mt-4 flex gap-2">
          <a href="product.html?id=${product.id}" 
             class="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
             View
          </a>
          <button onclick='addToCart(${product.id})' 
             class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
             Add to Cart
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.getAttribute('data-category');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const categoryButtons = document.querySelectorAll('.category-btn');

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      
      categoryButtons.forEach(b => {
        b.classList.remove('bg-green-600', 'text-white');
        b.classList.add('hover:bg-green-100');
      });
      btn.classList.add('bg-green-600', 'text-white');
      btn.classList.remove('hover:bg-green-100');

      
      const category = btn.dataset.category;
      renderProducts(category);
    });
  });

  
  const defaultBtn = document.querySelector('[data-category="All"]');
  if (defaultBtn) {
    defaultBtn.classList.add('bg-green-600', 'text-white');
    defaultBtn.classList.remove('hover:bg-green-100');
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const searchToggle = document.getElementById('search-toggle');
  const searchInput = document.getElementById('navbar-search');

  if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput.classList.contains('w-0')) {
        // Expand input (to the left of the search icon)
        searchInput.classList.remove('w-0', 'opacity-0');
        searchInput.classList.add('w-48', 'opacity-100');
        searchInput.focus();
      } else {
        // Collapse input
        searchInput.classList.add('w-0', 'opacity-0');
        searchInput.classList.remove('w-48', 'opacity-100');
        searchInput.value = "";
      }
    });

    // Collapse when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
        searchInput.classList.add('w-0', 'opacity-0');
        searchInput.classList.remove('w-48', 'opacity-100');
        searchInput.value = "";
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  renderProducts("All");
    });
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carousel-track");
  let slides = document.querySelectorAll("#carousel-track > div");
  const dots = document.querySelectorAll(".dot");
  let index = 1; // start from the "first real slide"
  let autoSlideInterval;

  // Clone first and last slide
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  firstClone.id = "first-clone";
  lastClone.id = "last-clone";

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = document.querySelectorAll("#carousel-track > div");
  const slideCount = slides.length;
  const slideWidth = 100; // because we used min-w-full

  // Initial position
  track.style.transform = `translateX(-${index * slideWidth}%)`;

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.remove("bg-white");
      dot.classList.add("bg-white/50");
      if (i === (index - 1 + dots.length) % dots.length) {
        dot.classList.add("bg-white");
        dot.classList.remove("bg-white/50");
      }
    });
  }

  function moveToSlide(i) {
    track.style.transition = "transform 0.7s ease-in-out";
    index = i;
    track.style.transform = `translateX(-${index * slideWidth}%)`;
    updateDots();
  }

  function nextSlide() {
    if (index >= slideCount - 1) return; // wait for transitionend
    index++;
    moveToSlide(index);
  }

  function prevSlide() {
    if (index <= 0) return;
    index--;
    moveToSlide(index);
  }

  // Transition end event → reset when hitting clones
  track.addEventListener("transitionend", () => {
    if (slides[index].id === "first-clone") {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
    }
    if (slides[index].id === "last-clone") {
      track.style.transition = "none";
      index = slideCount - 2;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
    }
  });

  // Controls
  document.getElementById("next").addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  document.getElementById("prev").addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      moveToSlide(i + 1); // because index=1 is first real
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Init
  updateDots();
  startAutoSlide();
});
