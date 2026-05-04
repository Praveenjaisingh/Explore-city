// src/Routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');  // Import the controller functions
const verifyToken = require('../Middleware/authMiddleware');  // Import the token verification middleware
const { createUserValidator, loginValidator, validate } = require('../Validators/userValidator');  // Validation middleware

// User Routes
router.post("/create", createUserValidator, validate, userController.userCreate);  // Route to create user
router.post("/login", loginValidator, validate, userController.userLogin);  // Route for user login
router.post("/logout", verifyToken, userController.logOut);  // Route for logout (requires token)
router.post("/forget-password", userController.forgetPassword);  // Route for forgot password
router.get("/reset-password/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/reset-password.html"));  // Serve the reset password page
});
router.post("/update-password/:token", userController.resetPassword);  // Route for updating password
router.post("/searchLoc", verifyToken, userController.searchLoc);  // Route for searching location (requires token)

module.exports = router;  // Export the routes to be used in app.js