document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const adminCode = document.getElementById('adminCode').value; // новое поле
  
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, adminCode })
    });
    const data = await res.json();
    alert(data.message);
    if (res.status === 201) {
      window.location.href = 'login.html';
    }
  } catch (err) {
    console.error(err);
    alert('Ошибка при регистрации');
  }
});

  