const jwt = require('jsonwebtoken');

const secretKey = "mysecretkey";

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    username:user.username
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); 
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log("error :::", error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};