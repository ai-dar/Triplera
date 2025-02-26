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
  
      // Calculate number of likes
      const likeCount = post.likes ? post.likes.length : 0;
      
      // Create base content with author, post text, and like count
      postEl.innerHTML = `
        <strong>${post.author.username}</strong>: ${post.content}<br>
        <small>Likes: ${likeCount}</small>
      `;
  
      // Like/Unlike button logic based on whether the current user already liked the post
      const likeBtn = document.createElement('button');
      likeBtn.classList.add('like-btn');
      if (post.likes && post.likes.includes(getUserIdFromToken())) {
        likeBtn.textContent = 'Unlike';
        likeBtn.onclick = () => unlikePost(post._id);
      } else {
        likeBtn.textContent = 'Like';
        likeBtn.onclick = () => likePost(post._id);
      }
      postEl.appendChild(likeBtn);
  
      // Comment button to add a new comment
      const commentBtn = document.createElement('button');
      commentBtn.classList.add('comment-btn');
      commentBtn.textContent = 'Comment';
      commentBtn.onclick = () => addComment(post._id);
      postEl.appendChild(commentBtn);
  
      // Display existing comments (if any)
      if (post.comments && post.comments.length > 0) {
        const commentsDiv = document.createElement('div');
        commentsDiv.classList.add('comments');
        const commentsHeader = document.createElement('strong');
        commentsHeader.textContent = 'Comments:';
        commentsDiv.appendChild(commentsHeader);
        
        post.comments.forEach(comment => {
          const commentEl = document.createElement('div');
          commentEl.classList.add('comment');
          // If comment.author is populated with a username, use it. Otherwise, fallback to "User".
          const commentAuthor = comment.author && comment.author.username ? comment.author.username : 'User';
          commentEl.innerHTML = `<em>${commentAuthor}</em>: ${comment.content}`;
          commentsDiv.appendChild(commentEl);
        });
        postEl.appendChild(commentsDiv);
      }
      if (userRole === 'admin' || post.author._id === getUserIdFromToken()) {
        // Кнопка редактирования
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => updatePost(post._id, post.content);
        postEl.appendChild(editBtn);
        
        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deletePost(post._id);
        postEl.appendChild(deleteBtn);
      }
      
      // Append the post element to the posts container
      postsDiv.appendChild(postEl);
    });
  }
  
  
  async function likePost(postId) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      alert(data.message);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }
  
  async function unlikePost(postId) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      alert(data.message);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }
  
  async function addComment(postId) {
    const commentContent = prompt("Enter your comment:");
    if (!commentContent) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ content: commentContent })
      });
      const data = await res.json();
      alert(data.message);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
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
