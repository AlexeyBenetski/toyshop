const API_URL = 'http://localhost:5000/api';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function addToCart(productId, quantity=1, token) {
  const res = await fetch(`${API_URL}/cart`, {
    method:'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({product_id: productId, quantity})
  });
  return res.json();
}

// Для регистрации и входа
export async function registerUser(name,email,password) {
  const res = await fetch(`${API_URL}/users/register`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name,email,password})
  });
  return res.json();
}

export async function loginUser(email,password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
  });
  return res.json();
}
