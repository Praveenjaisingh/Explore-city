const userService = require("../Services/userService");

exports.userCreate = async (req, res, next) => {

    try {
        const data = await userService.userCreate(req.body);
        return res.status(201).json({
            status: true,
            message: "user sign in success"

        });

    } catch (error) {
        next(error);
    }

};

exports.userLogin = async (req, res, next) => {

    try {
        const data = await userService.userLogin(req.body);
        return res.status(200).json({
            status: true,
            message: "Login successful",
            token: data.token,
            user: data.user
        });

    } catch (error) {
        next(error);
    }

};

exports.logOut = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const data = await userService.logOut(token);
        return res.status(200).json({
            status: true,
            message: "Logout successful"
        });

    } catch (error) {
        next(error);
    }

};

exports.forgetPassword = async (req, res, next) => {
    try {
        const data = await userService.forgetPassword(req.body);
        return res.status(201).json({
            status: true,
            message: "verfication mail sended successfully"
        });
    } catch (error) {
        next(error);
    }

}

exports.resetPassword = async (req, res, next) => {
    try {
        const data = await userService.resetPassword(
            req.params.token,
            req.body
        );

        return res.status(200).json({
            status: true,
            message: "Password reset successful"
        });

    } catch (error) {
        next(error);
    }
};

exports.searchLoc = async (req, res, next) => {
    try {
        const data = await userService.searchLoc(req.body);

        return res.status(200).json({
            status: true,
            message: "Location fetched successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};