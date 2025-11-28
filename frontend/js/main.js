import { fetchProducts, fetchCategories, addToCart } from './api.js';

let products = [];
let categories = [];

const container = document.getElementById('productsContainer');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

async function init() {
  products = await fetchProducts();
  categories = await fetchCategories();
  renderCategories();
  renderProducts(products);
}

function renderCategories() {
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    categoryFilter.appendChild(option);
  });
}

function renderProducts(list) {
  container.innerHTML = '';
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card h-100">
        <img src="images/${p.id}.jpg" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.description}</p>
          <p><strong>${p.price} ₽</strong> | ${p.age_limit}+ лет</p>
          <button class="btn btn-primary w-100 add-to-cart" data-id="${p.id}">В корзину</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const token = localStorage.getItem('token');
      if(!token){ alert('Войдите, чтобы добавить в корзину'); return; }
      addToCart(btn.dataset.id,1,token).then(res=>{
        alert('Товар добавлен в корзину');
      });
    });
  });
}

// фильтры
categoryFilter.addEventListener('change',()=>{
  const filtered = products.filter(p => !categoryFilter.value || p.category_id==categoryFilter.value);
  renderProducts(filtered);
});

searchInput.addEventListener('input',()=>{
  const term = searchInput.value.toLowerCase();
  const filtered = products.filter(p=>p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

init();
