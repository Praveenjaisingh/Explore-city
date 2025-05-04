const dummyUser = { email: "user@example.com", password: "123456" };

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email === dummyUser.email && password === dummyUser.password) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('homePage').classList.remove('hidden');
    } else {
        alert("Invalid credentials. Try user@example.com / 123456");
    }
}

let userLat, userLng;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            showPlaces();
        }, () => {
            alert("Location access denied.");
        });
    } else {
        alert("Geolocation not supported.");
    }
}

function useManualLocation() {
    const manualLoc = document.getElementById('manualLocation').value;
    if (manualLoc) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLoc)}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    userLat = parseFloat(data[0].lat);
                    userLng = parseFloat(data[0].lon);
                    showPlaces();
                } else {
                    alert("Location not found.");
                }
            })
            .catch(() => alert("Error fetching location."));
    }
}

const places = [
    { name: "Top Hotel", lat: 12.9716, lng: 77.5946 },
    { name: "Famous Temple", lat: 12.9721, lng: 77.5935 },
    { name: "City Mall", lat: 12.9730, lng: 77.5950 },
    { name: "General Hospital", lat: 12.9705, lng: 77.5960 },
    { name: "Main Bus Stand", lat: 12.9740, lng: 77.5920 },
    { name: "Supermarket", lat: 12.9750, lng: 77.5910 },
];

function showPlaces() {
    const list = document.getElementById('placesList');
    list.innerHTML = "";
    places.forEach(place => {
        const li = document.createElement('li');
        li.textContent = place.name;
        li.onclick = () => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${place.lat},${place.lng}`;
            window.open(mapsUrl, '_blank');
        };
        list.appendChild(li);
    });
}
