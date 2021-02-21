const router = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { requireAuth } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
      });
      res.json(blogs);
    } catch (error) {
      next(error);
    }
  })
  .post(requireAuth, async (req, res, next) => {
    if (!req.body.title && !req.body.url) {
      return res.status(400).json({ error: 'Please include a title and url' });
    }

    try {
      const user = await User.findById(req.user.id);
      const blog = new Blog({ ...req.body, user: user._id });
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
      res.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id);
      res.json(blog);
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    const { id, ...blog } = req.body;
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
        new: true,
      });
      res.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  })
  .delete(requireAuth, async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id);
      const user = await User.findById(req.user.id);
      if (blog.user.toString() === req.user.id.toString()) {
        await blog.deleteOne();
        user.blogs = user.blogs.filter(
          (blog) => blog.toString() !== blog._id.toString()
        );
        await user.save();
        return res.status(204).end();
      } else {
        return res.status(401).json({ error: 'unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
