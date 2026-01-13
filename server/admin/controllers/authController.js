const jwt = require("jsonwebtoken");
const { adminConnection } = require("../../../config/database");
const adminSchema = require("../models/Admin");

const Admin = adminConnection.model("Admin", adminSchema);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined; // Remove password from output

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide name, email, and password",
      });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role,
    });

    createSendToken(newAdmin, 201, res);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    createSendToken(admin, 200, res);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};
