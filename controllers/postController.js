const Post = require('../models/Post');
const Joi = require('joi');

const postSchema = Joi.object({
  content: Joi.string().max(280).required()
});

exports.createPost = async (req, res, next) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { content } = req.body;
    const post = new Post({ content, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
    try {
      let posts;
      const filter = req.query.filter; // 'own' or 'others'
      if (filter === 'own') {
        posts = await Post.find({ author: req.user.id })
          .populate('author', 'username role')
          .populate('comments.author', 'username');
      } else if (filter === 'others') {
        posts = await Post.find({ author: { $ne: req.user.id } })
          .populate('author', 'username role')
          .populate('comments.author', 'username');
      } else {
        posts = await Post.find()
          .populate('author', 'username role')
          .populate('comments.author', 'username');
      }
      res.json(posts);
    } catch (error) {
      next(error);
    }
  };
  

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }
    // Обновлять может только автор поста или администратор
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для выполнения этого действия' });
    }
    post.content = req.body.content;
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }
    // Удалять может только автор поста или администратор
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для выполнения этого действия' });
    }
    await post.deleteOne();
    res.json({ message: 'Пост успешно удалён' });
  } catch (error) {
    next(error);
  }
};
exports.likePost = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      
      // Check if the user has already liked the post
      if (post.likes.includes(req.user.id)) {
        return res.status(400).json({ message: 'Post already liked' });
      }
      
      post.likes.push(req.user.id);
      await post.save();
      res.json({ message: 'Post liked', likes: post.likes });
    } catch (error) {
      next(error);
    }
  };
  
  exports.unlikePost = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      
      // Check if the user has liked the post
      if (!post.likes.includes(req.user.id)) {
        return res.status(400).json({ message: 'Post not liked yet' });
      }
      
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
      await post.save();
      res.json({ message: 'Post unliked', likes: post.likes });
    } catch (error) {
      next(error);
    }
  };
  
  const commentSchema = Joi.object({
    content: Joi.string().max(280).required()
  });
  
  exports.addComment = async (req, res, next) => {
    try {
      const { error } = commentSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
      
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      
      const comment = {
        content: req.body.content,
        author: req.user.id
      };
      post.comments.push(comment);
      await post.save();
      res.status(201).json({ message: 'Comment added', comments: post.comments });
    } catch (error) {
      next(error);
    }
  };