const User = require("../../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


function createToken(user){
  const payload = {
    ...user
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}

exports.signup = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const newUser = await User.create(req.body)
    const token = createToken(newUser)
    console.log("creating")
    res.status(201).json({token});
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res) => {
  try {
    const token = createToken(req.user)
    return res.status(201).json({token})
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
