const router = require('express').Router();
const User = require('../models/user');

const handleErrors = (error) => {
  const errors = { username: '', password: '' };

  // duplicate document property
  if (error.code === 11000) {
    errors.username = 'That username already exists';
  }

  // validation errors
  if (error.name === 'ValidationError') {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

router
  .route('/')
  .get(async (req, res) => {
    const users = await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
    });
    res.json(users);
  })
  .post(async (req, res) => {
    const { username, name, password } = req.body;

    try {
      const savedUser = await User.create({
        username,
        name,
        password,
      });
      res.status(201).json(savedUser);
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  });

module.exports = router;
