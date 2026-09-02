// ==========================================
// BLUEWATER YACHTS
// ==========================================

// ==========================================
// WEATHER API
// ==========================================

const locationInput = document.getElementById("location-input");
const locationButton = document.getElementById("location-button");

function getWindDirection(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(degrees / 45) % 8];
}

function getWeatherDescription(code) {
    if (code === 0) return "Clear Sky";
    if (code === 1 || code === 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 85 && code <= 86) return "Snow Showers";
    if (code >= 95) return "Thunderstorm";
    return "Unknown";
}

async function getWeather(location) {
    const status = document.getElementById("weather-status");

    status.textContent = "Finding location...";

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found");
        }

        const place = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&wind_speed_unit=kn`
        );

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        document.getElementById("weather-location").textContent =
            `📍 ${place.name}, ${place.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°F`;

        document.getElementById("wind-speed").textContent =
            `${Math.round(current.wind_speed_10m)} knots`;

        document.getElementById("wind-direction").textContent =
            `${getWindDirection(current.wind_direction_10m)} (${Math.round(current.wind_direction_10m)}°)`;

        document.getElementById("wind-gusts").textContent =
            `${Math.round(current.wind_gusts_10m)} knots`;

        document.getElementById("conditions").textContent =
            getWeatherDescription(current.weather_code);

        status.textContent = "Current conditions loaded.";

    } catch (error) {
        console.error(error);
        status.textContent = "Unable to find weather for that location.";
    }
}


// ==========================================
// YACHT DATA
// ==========================================

// These are the boats displayed on the website.
// The sorting feature below works with this data.

const boats = [
    {
        name: "Ocean Breeze 42",
        type: "Bluewater Catamaran",
        year: 2024,
        length: 42,
        price: 425000,
        location: "Miami, Florida",
        image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Blue Horizon 50",
        type: "Luxury Catamaran",
        year: 2025,
        length: 50,
        price: 685000,
        location: "Fort Lauderdale, Florida",
        image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Sea Voyager 38",
        type: "Bluewater Sailboat",
        year: 2023,
        length: 38,
        price: 295000,
        location: "San Diego, California",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Atlantic Explorer 55",
        type: "Bluewater Sailboat",
        year: 2025,
        length: 55,
        price: 875000,
        location: "Newport, Rhode Island",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Coral Dream 46",
        type: "Performance Catamaran",
        year: 2024,
        length: 46,
        price: 540000,
        location: "Key West, Florida",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Pacific Star 60",
        type: "Bluewater Sailboat",
        year: 2026,
        length: 60,
        price: 1250000,
        location: "Honolulu, Hawaii",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80"
    }
];


// ==========================================
// DISPLAY BOATS
// ==========================================

function displayBoats(boatList) {

    const boatContainer =
        document.getElementById("boat-container");

    boatContainer.innerHTML = "";

    boatList.forEach(boat => {

        const card = document.createElement("div");

        card.className = "boat-card";

        card.innerHTML = `
            <img
                class="boat-image"
                src="${boat.image}"
                alt="${boat.name}"
            >

            <div class="boat-info">

                <h3>${boat.name}</h3>

                <p>
                    <strong>Type:</strong>
                    ${boat.type}
                </p>

                <p>
                    <strong>Year:</strong>
                    ${boat.year}
                </p>

                <p>
                    <strong>Length:</strong>
                    ${boat.length} ft
                </p>

                <p>
                    <strong>Location:</strong>
                    ${boat.location}
                </p>

                <p class="price">
                    $${boat.price.toLocaleString()}
                </p>

            </div>
        `;

        boatContainer.appendChild(card);
    });
}


// ==========================================
// SORTING
// ==========================================

const sortSelect =
    document.getElementById("sort");

sortSelect.addEventListener("change", function () {

    const sortedBoats = [...boats];

    switch (this.value) {

        case "price-low":
            sortedBoats.sort((a, b) => a.price - b.price);
            break;

        case "price-high":
            sortedBoats.sort((a, b) => b.price - a.price);
            break;

        case "length-short":
            sortedBoats.sort((a, b) => a.length - b.length);
            break;

        case "length-long":
            sortedBoats.sort((a, b) => b.length - a.length);
            break;

        case "name":
            sortedBoats.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;
    }

    displayBoats(sortedBoats);
});


// ==========================================
// LOCATION SEARCH
// ==========================================

locationButton.addEventListener("click", function () {

    const location =
        locationInput.value.trim();

    if (location) {
        getWeather(location);
    }
});


locationInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const location =
            locationInput.value.trim();

        if (location) {
            getWeather(location);
        }
    }
});


// ==========================================
// START WEBSITE
// ==========================================

getWeather("Miami");

displayBoats(boats);