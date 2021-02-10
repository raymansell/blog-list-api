// to only run this test file, run 'npm test -- tests/blog_api.test.js'

const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });

const mongoose = require('mongoose');
const Blog = require('../models/blog');
const supertest = require('supertest');
const { initialBlogs, blogsInDb } = require('./blog_api_test_helper');
const app = require('../app');

const api = supertest(app);

describe('routes - blog api', () => {
  beforeEach(async () => {
    await Blog.deleteMany();
    const blogObjects = initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200) // didn't send this explicitly in the API
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    // here's we're testing our api's capability of correctly
    // fetching the blogs from the database with the .get() implementation we wrote
    // in the controller
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test(`unique identifier is named 'id' instead of '_id'`, async () => {
    // here, we're not using the api to interact with the db,
    // but rather a helper function (that needs no testing and we already know works fine)
    // that is only concerned about fetching the current blogs thru the mongoose ODM
    const blogs = await blogsInDb();
    const blogToTest = blogs[0];

    expect(blogToTest.id).toBeDefined();
  });

  test('blogs can be added correctly', async () => {
    const newBlog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      likes: 3,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain('test title');
  });

  test(`missing 'likes' property gets defaulted to 0`, async () => {
    const blogMissingLikes = {
      title: 'this blog is missing likes',
      author: 'author',
      url: 'url',
    };
    const response = await api.post('/api/blogs').send(blogMissingLikes);
    expect(response.body.likes).toBe(0);
  });

  test('blogs without title and url are not added', async () => {
    const incompleteBlog = {
      author: 'an author',
      likes: 100,
    };
    await api.post('/api/blogs').send(incompleteBlog).expect(400);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
