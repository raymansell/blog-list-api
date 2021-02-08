const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.log('Error connecting to MongoDB:', error.messagse);
    process.exit(1);
  }
};

module.exports = connectDB;
