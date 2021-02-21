const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'incorrect username or password',
    });
  }

  const payloadForToken = { username: user.username, id: user._id };
  const accessToken = jwt.sign(
    payloadForToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  res.json({ accessToken, user: user._id });
});

module.exports = router;
