const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const verifyToken = require('../Middleware/authMiddleware');
const { createUserValidator, loginValidator, validate } = require('../Validators/userValidator');

router.post("/create", createUserValidator, validate, userController.userCreate);
router.post("/login", loginValidator, validate, userController.userLogin);
router.post("/logout", verifyToken, userController.logOut);
router.post("/forget-password", userController.forgetPassword);
router.get("/reset-password/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/reset-password.html"));
});
router.post("/update-password/:token", userController.resetPassword);
router.post("/searchLoc", verifyToken, userController.searchLoc);

module.exports = router;