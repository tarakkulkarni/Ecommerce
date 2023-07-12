const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const generatedPassword = await bcrypt.hash(password, 10);
    return generatedPassword;
  } catch (err) {
    console.log(err);
  }
};
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
module.exports = {
  hashPassword,
  comparePassword,
};
