document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        // Сохраняем токен и роль в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        // Перенаправляем на главную (дашборд)
        window.location.href = 'main.html';
      } else {
        alert(data.message || 'Ошибка входа');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при попытке входа');
    }
  });
  