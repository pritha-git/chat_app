const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Protected route
router.get("/me", verifyToken, authController.getProfile);

module.exports = router;
