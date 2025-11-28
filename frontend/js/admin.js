import { API_URL } from './api.js';

const adminContainer = document.getElementById('adminProducts');
const addProductBtn = document.getElementById('addProductBtn');
let products = [];

async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  products = await res.json();
  renderProducts();
}

function renderProducts() {
  adminContainer.innerHTML = '';
  products.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-3';
    div.innerHTML = `
      <div class="card p-2">
        <h5>${p.name}</h5>
        <p>${p.price} ₽</p>
        <p>${p.description}</p>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${p.id}">Редактировать</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}">Удалить</button>
      </div>
    `;
    adminContainer.appendChild(div);
  });

  document.querySelectorAll('.delete-btn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/products/${btn.dataset.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      alert('Редактирование товара пока через форму не реализовано');
    });
  });
}

if(addProductBtn){
  addProductBtn.addEventListener('click', ()=>{
    alert('Добавление товара пока через форму не реализовано');
  });
}

fetchProducts();
