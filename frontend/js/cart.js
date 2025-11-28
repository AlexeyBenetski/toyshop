import { API_URL } from './api.js';

const cartContainer = document.getElementById('cartContainer');
const checkoutBtn = document.getElementById('checkoutBtn');

async function fetchCart() {
  const token = localStorage.getItem('token');
  if(!token) {
    cartContainer.innerHTML = '<p>Войдите, чтобы просмотреть корзину</p>';
    return;
  }

  const res = await fetch(`${API_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  renderCart(data);
}

function renderCart(items) {
  cartContainer.innerHTML = '';
  if(!items.length) {
    cartContainer.innerHTML = '<p>Корзина пуста</p>';
    return;
  }

  items.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'cart-item mb-3';
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5>${item.product_name}</h5>
          <p>${item.quantity} x ${item.price} ₽</p>
        </div>
        <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}">Удалить</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  document.querySelectorAll('.remove-btn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/cart/${btn.dataset.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCart();
    });
  });
}

if(checkoutBtn){
  checkoutBtn.addEventListener('click', ()=>{
    alert('Оформление заказа пока не реализовано');
  });
}

fetchCart();
