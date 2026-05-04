const axios = require("axios");

exports.searchPlaces = async ({ loc, lat, lng }) => {
    if (!loc) {
        throw new Error("Location query is required");
    }

    let url = "";

    if (lat && lng) {
        const offset = 0.05;

        const left = lng - offset;
        const right = lng + offset;
        const top = lat + offset;
        const bottom = lat - offset;

        url = `https://nominatim.openstreetmap.org/search?q=${loc}&format=json&limit=10&viewbox=${left},${top},${right},${bottom}&bounded=1`;
    } else {
        url = `https://nominatim.openstreetmap.org/search?q=${loc}&format=json&limit=10`;
    }

    const response = await axios.get(url, {
        headers: {
            "User-Agent": "ExploreCityApp"
        }
    });

    return response.data;
};