// BUG INTENCIONAL: Mezcla de estilos de código
const API_URL = 'http://localhost:3000/api';

// BUG INTENCIONAL: Variable global
var currentUser = null;
let cart = [];

// BUG INTENCIONAL: No maneja errores de localStorage
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cartData) {
    // BUG INTENCIONAL: No valida tamaño de localStorage
    localStorage.setItem('cart', JSON.stringify(cartData));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

// BUG INTENCIONAL: Fetch sin manejo de errores de red
async function loadProducts(search = '', category = '') {
    try {
        let url = `${API_URL}/products?`;
        if (search) url += `search=${search}&`;
        if (category) url += `category=${category}`;

        const response = await fetch(url);
        const products = await response.json();

        renderProducts(products);
    } catch (error) {
        // BUG INTENCIONAL: Error silencioso
        console.log('Error loading products');
    }
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');

    if (!grid) return;

    // BUG INTENCIONAL: No limpia event listeners anteriores
    grid.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="/uploads/thumbnails/${product.thumbnail}" 
           alt="${product.name}" 
           class="product-thumbnail"
           onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">$${product.price}</span>
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">
            Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('');

    // BUG INTENCIONAL: Event listener que causa memory leak
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-add-cart')) {
                const productId = card.dataset.id;
                // TODO: Abrir modal de video
            }
        });
    });
}

async function addToCart(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();

        const cart = getCart();
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            // BUG INTENCIONAL: No verifica stock
            existingItem.quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: 1
            });
        }

        saveCart(cart);
        updateCartCount();
        showToast('Producto agregado al carrito');

        // BUG INTENCIONAL: Abre el drawer pero puede causar problemas
        openCartDrawer();
    } catch (error) {
        showToast('Error al agregar producto');
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();

    // BUG INTENCIONAL: No actualiza UI automáticamente en todas las páginas
    if (typeof renderCartDrawer === 'function') {
        renderCartDrawer();
    }
}

function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.add('open');
        renderCartDrawer();
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.remove('open');
    }
}

function renderCartDrawer() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Carrito vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="/uploads/thumbnails/${item.thumbnail}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-item-price">$${item.price} x ${item.quantity}</p>
      </div>
      <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">🗑️</button>
    </div>
  `).join('');

    // BUG INTENCIONAL: Cálculo puede dar NaN
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = '$' + total.toFixed(2);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    // BUG INTENCIONAL: No limpia timeout anterior
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Theme toggle
function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
}

// BUG INTENCIONAL: Event listeners duplicados
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartCount();

    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) {
        // BUG INTENCIONAL: No debounce en búsqueda
        searchInput.addEventListener('input', (e) => {
            const search = e.target.value;
            const category = categoryFilter?.value || '';
            loadProducts(search, category);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const category = e.target.value;
            const search = searchInput?.value || '';
            loadProducts(search, category);
        });
    }

    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartDrawer);
    }

    // BUG INTENCIONAL: Carga inicial sin verificar página
    if (document.getElementById('products-grid')) {
        loadProducts();
    }
});

// BUG INTENCIONAL: Función global que puede causar conflictos
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.showToast = showToast;
window.getCart = getCart;
window.saveCart = saveCart;
window.updateCartCount = updateCartCount;

// BUG INTENCIONAL: Infinite scroll roto
let isLoadingMore = false;
let currentPage = 1;

window.addEventListener('scroll', () => {
    // BUG INTENCIONAL: No verifica si estamos en la página correcta
    if (isLoadingMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 100;

    if (scrollPosition >= threshold) {
        isLoadingMore = true;
        currentPage++;

        // BUG INTENCIONAL: No hay endpoint de paginación
        setTimeout(() => {
            isLoadingMore = false;
        }, 1000);
    }
});

// BUG INTENCIONAL: Console logs olvidados
console.log('App initialized');
console.log('TODO: Implementar paginación');
console.log('FIXME: Memory leaks en event listeners');
console.log('DEBUG: Cart:', getCart());
