const router = require('express').Router();
const Blog = require('../models/blog');

router
  .route('/')
  .get(async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
  })
  .post(async (req, res) => {
    if (!req.body.title && !req.body.url) {
      return res.status(400).end(); // return prevents further execution of function
    }
    const blog = new Blog(req.body);
    const result = await blog.save();
    res.status(201).json(result);
  });

module.exports = router;
