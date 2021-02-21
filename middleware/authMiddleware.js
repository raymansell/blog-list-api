const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const authHeader = req.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ error: 'token missing' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedPayload) => {
    if (err) {
      return res.status(403).json({ error: 'invalid token' });
    } else {
      req.user = decodedPayload;
      next(); // token has been authenticated
    }
  });
};
