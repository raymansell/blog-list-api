const router = require('express').Router();
const Blog = require('../models/blog');

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const blogs = await Blog.find({});
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
      const blog = new Blog(req.body);
      const result = await blog.save();
      res.status(201).json(result);
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
