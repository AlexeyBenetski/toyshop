import { registerUser, loginUser } from './api.js';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// ---------- Регистрация ----------
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const res = await registerUser(name, email, password);

      if (res.error) {
        alert('Ошибка: ' + res.error);
      } else {
        alert('Вы успешно зарегистрированы! Теперь войдите.');
        window.location.href = 'login.html';
      }
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка регистрации');
    }
  });
}

// ---------- Вход ----------
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const res = await loginUser(email, password);

      if (res.error) {
        alert('Ошибка: ' + res.error);
      } else if (res.token) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        alert('Вход выполнен успешно!');
        window.location.href = 'index.html'; // редирект на главную
      } else {
        alert('Неверный ответ сервера');
      }
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка входа');
    }
  });
}
