const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// При загрузке страницы получаем текущий профиль
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/users/profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const user = await res.json();
    if (user.username) document.getElementById('username').value = user.username;
    if (user.email) document.getElementById('email').value = user.email;
  } catch (err) {
    console.error(err);
  }
});

// Обработка отправки формы обновления профиля
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const updateData = { username, email };
  if (password) updateData.password = password;
  
  try {
    const res = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    alert('Профиль обновлён!');
  } catch (err) {
    console.error(err);
    alert('Ошибка обновления профиля');
  }
});

// Функция выхода из системы
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
