const http = require('http');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

const app = require('./app');
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
