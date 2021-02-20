const router = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

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
  .post(async (req, res, next) => {
    if (!req.body.title && !req.body.url) {
      return res.status(400).end();
    }

    try {
      const user = await User.findOne({});
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
  .delete(async (req, res, next) => {
    try {
      const blog = await Blog.findByIdAndDelete();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
