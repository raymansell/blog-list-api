const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: './config/.env' });

connectDB();

const app = require('./app');
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
