const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connect = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB database ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};
module.exports = connect;
