const { body, validationResult } = require("express-validator");

exports.createUserValidator = [

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .bail(),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .notEmpty()
        .withMessage("Password required")
        .bail()
        .isLength({ min: 6 }, { max: 16 })
        .withMessage("Password must be at least 6 characters and not more than 15 characters"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword required")
        .bail()
        .isLength({ min: 6 }, { max: 16 })
        .withMessage("confirmPassword must be at least 6 characters and not more than 15 characters")

];

exports.loginValidator = [

    body("email")
        .notEmpty()
        .withMessage("Email required")
        .bail()
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .notEmpty()
        .withMessage("Password required")
        .bail()

];

exports.validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            status: false,
            errors: errors.array().map(err => err.msg)
        });

    }

    next();

};