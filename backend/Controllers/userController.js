const bcrypt = require("bcrypt");
const User = require("../Models/User");
const authMiddleware = require("../Middleware/Auth");


const signup = async (req, res) => {
    try {
      const { email, password, username } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });
  
      const saved = await newUser.save();
      if (saved) {
        const token = authMiddleware.generateToken(newUser);
        return res
          .status(201)
          .json({ message: "User registered successfully", token });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" + error });
    }
  };
  
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (isPasswordValid) {
        const token = authMiddleware.generateToken(user);
        return res.status(200).json({ message: "Login successful", token, user });
      }
  
      return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  module.exports = {
    signup,
    login,
  };