const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'a',
    author: 'b',
    url: 'c',
    likes: 1,
  },

  {
    title: 'd',
    author: 'e',
    url: 'f',
    likes: 2,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find();
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { initialBlogs, blogsInDb };
