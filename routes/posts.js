const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken } = require('../middleware/auth');

// POST /api/posts - создать новый пост
router.post('/', verifyToken, postController.createPost);

// GET /api/posts - получить все посты (лента)
router.get('/', verifyToken, postController.getPosts);

// GET /api/posts/:id - получить конкретный пост
router.get('/:id', verifyToken, postController.getPost);

// PUT /api/posts/:id - обновить пост
router.put('/:id', verifyToken, postController.updatePost);

// DELETE /api/posts/:id - удалить пост (только автор или админ)
router.delete('/:id', verifyToken, postController.deletePost);
router.post('/:id/like', verifyToken, postController.likePost);
router.delete('/:id/like', verifyToken, postController.unlikePost);
router.post('/:id/comment', verifyToken, postController.addComment);


module.exports = router;
