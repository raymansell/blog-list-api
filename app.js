const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const connectDB = require('./config/db');

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;
