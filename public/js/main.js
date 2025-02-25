const token = localStorage.getItem('token');
const userRole = localStorage.getItem('role');

if (!token) {
  window.location.href = 'login.html';
}

const postsDiv = document.getElementById('posts');
const postForm = document.getElementById('postForm');
const logoutBtn = document.getElementById('logout');
const filterSelect = document.getElementById('filterSelect');

// Получение постов с учетом выбранного фильтра
async function fetchPosts() {
  try {
    let url = '/api/posts';
    const filterValue = filterSelect.value;
    if (filterValue === 'own' || filterValue === 'others') {
      url += `?filter=${filterValue}`;
    }
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const posts = await res.json();
    displayPosts(posts);
  } catch (err) {
    console.error(err);
  }
}

// Отображение постов с кнопками редактирования и удаления
function displayPosts(posts) {
  postsDiv.innerHTML = '';
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `<strong>${post.author.username}</strong>: ${post.content}`;
    
    // Если пользователь является администратором или автором поста, показываем кнопки "Редактировать" и "Удалить"
    if (userRole === 'admin' || post.author._id === getUserIdFromToken()) {
      // Кнопка редактирования
      const editBtn = document.createElement('button');
      editBtn.classList.add('edit-btn');
      editBtn.textContent = 'Редактировать';
      editBtn.onclick = () => updatePost(post._id, post.content);
      postEl.appendChild(editBtn);
      
      // Кнопка удаления
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'Удалить';
      deleteBtn.onclick = () => deletePost(post._id);
      postEl.appendChild(deleteBtn);
    }
    postsDiv.appendChild(postEl);
  });
}

// Функция для обновления поста
async function updatePost(postId, currentContent) {
  const newContent = prompt('Введите новое содержание поста:', currentContent);
  if (!newContent) return;
  try {
    const res = await fetch('/api/posts/' + postId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ content: newContent })
    });
    const data = await res.json();
    if (data._id) {
      alert('Пост обновлён');
      fetchPosts();
    } else {
      alert(data.message || 'Ошибка обновления');
    }
  } catch (err) {
    console.error(err);
    alert('Ошибка обновления поста');
  }
}

// Функция для удаления поста
async function deletePost(postId) {
  if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;
  try {
    const res = await fetch('/api/posts/' + postId, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await res.json();
    alert(data.message);
    fetchPosts();
  } catch (err) {
    console.error(err);
  }
}

// Создание нового поста
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = document.getElementById('postContent').value;
  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ content })
    });
    const data = await res.json();
    if (data._id) {
      document.getElementById('postContent').value = '';
      fetchPosts();
    } else {
      alert(data.message || 'Ошибка публикации');
    }
  } catch (err) {
    console.error(err);
  }
});

// Обработчик для выхода из системы
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = 'login.html';
});

// Обработчик изменения фильтра
filterSelect.addEventListener('change', fetchPosts);

// Функция для извлечения userId из токена
function getUserIdFromToken() {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (err) {
    return null;
  }
}

// Инициализация: получение постов при загрузке страницы
fetchPosts();
