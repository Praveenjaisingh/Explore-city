const userRepository = require("../Repositories/userRepository");
const AppError = require("../Helpers/Apperror");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../Helpers/sendmail");
const forgetMail = require("../Helpers/forgetMail");


class userService { 
    async userCreate(data) {

        const { name, email, password, confirmPassword } = data;

        const existingUser = await userRepository.userLogin(email);

        if (existingUser) {
            throw new AppError(["Email already exists"]);
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userRepository.userCreate({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword

        });
        const loginUrl = `${process.env.APP_URL}`;
        await sendMail({
            to: email,
            subject: "Welcome! Your Account Details",
            replacements: {
                name,
                email,
                password,
                loginUrl
            }
        });
        return user;
    }
    async userLogin(data) {

        const { email, password } = data;

        const user = await userRepository.userLogin(email);

        if (!user) {
            throw new AppError("User not found");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new AppError("Invalid password");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            user,
            token
        };

    }
    async logOut(token) {

        if (!token) {
            throw new AppError("Token missing");
        }

        return {
            message: "Logout successful"
        };

    }

    async forgetPassword(data) {
        const { email } = data;

        const user = await userRepository.userLogin(email);

        if (!user) {
            throw new AppError("User not found");
        }
        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetURL = `${process.env.APP_URL}/api/users/reset-password/${resetToken}`;

        await forgetMail({
            to: user.email,
            subject: "Reset Your Password - Smart Agri-Connect",
            replacements: {
                name: user.name,
                RESET_LINK: resetURL
            }
        });

        return true;
    }

    async resetPassword(token, data) {

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await userRepository.findUserByResetToken(hashedToken);

        if (!user) {
            throw new AppError("Invalid or expired token");
        }

        if (user.resetTokenExpiry < Date.now()) {
            throw new AppError("Token expired");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await userRepository.updatePassword(user, hashedPassword);

        return true;
    }

    async searchLoc(data)
    { 
        // const { loc } = data;
        return await userRepository.searchLoc(data);
    }

}
module.exports = new userService();