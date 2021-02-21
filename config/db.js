const mongoose = require('mongoose');

const connectDB = async () => {
  let MONGODB_URI = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(
      `MongoDB connected: ${connection.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.messagse}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
