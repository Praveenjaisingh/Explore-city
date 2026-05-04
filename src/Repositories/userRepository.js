const { User} = require("../Models");
const googleMaps = require("../Helpers/maps/googleMaps");

class userRepository { 

    async userCreate(data) {

        const user = await User.create(data);
        return user;
    }
    async userLogin(email) {
        return await User.findOne({ where: { email } })
    }
    async logOut(token) {

        if (!token) {
            throw new Error("Token required");
        }
        return {
            message: "Logout successful"
        };
    }

    async findUserByResetToken(hashedToken) {
        return await User.findOne({
            where: {
                resetToken: hashedToken
            }
        });
    }

    async updatePassword(user, hashedPassword) {
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        return await user.save();
    }

    async searchLoc(data = {}) {
        const { loc } = data;

        if (!loc) {
            throw new Error("loc is required");
        }

        const results = await googleMaps.searchPlaces(data);

        return results.map(place => {
            // 🟢 If OSM response
            if (place.lat && place.lon) {
                return {
                    name: place.display_name?.split(",")[0],
                    address: place.display_name,
                    lat: parseFloat(place.lat),
                    lng: parseFloat(place.lon)
                };
            }

            // 🔵 If Google response (fallback)
            return {
                name: place.name,
                address: place.formatted_address || place.vicinity,
                lat: place.geometry?.location?.lat,
                lng: place.geometry?.location?.lng
            };
        });
    }

}
module.exports = new userRepository();