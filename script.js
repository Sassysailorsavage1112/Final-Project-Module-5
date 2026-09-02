// ==========================================
// BLUEWATER YACHTS - JAVASCRIPT
// ==========================================

// ------------------------------
// BOAT API
// ------------------------------

const BOAT_API = "/api/boats";


// ------------------------------
// WEATHER API
// ------------------------------

const locationInput = document.getElementById("location-input");
const locationButton = document.getElementById("location-button");


// Convert wind direction degrees into a compass direction
function getWindDirection(degrees) {
    const directions = [
        "N", "NE", "E", "SE",
        "S", "SW", "W", "NW"
    ];

    const index = Math.round(degrees / 45) % 8;

    return directions[index];
}


// Convert weather code into readable conditions
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


// Get weather for a location
async function getWeather(location) {

    const status = document.getElementById("weather-status");

    status.textContent = "Finding location...";

    try {

        // Find the location
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found.");
        }

        const place = geoData.results[0];

        const latitude = place.latitude;
        const longitude = place.longitude;

        const city = place.name;
        const country = place.country;

        status.textContent = "Loading current sailing conditions...";


        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&wind_speed_unit=kn`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // Update location
        document.getElementById("weather-location").textContent =
            `📍 ${city}, ${country}`;


        // Update temperature
        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°F`;


        // Update wind speed
        document.getElementById("wind-speed").textContent =
            `${Math.round(current.wind_speed_10m)} knots`;


        // Update wind direction
        document.getElementById("wind-direction").textContent =
            `${getWindDirection(current.wind_direction_10m)} (${Math.round(current.wind_direction_10m)}°)`;


        // Update wind gusts
        document.getElementById("wind-gusts").textContent =
            `${Math.round(current.wind_gusts_10m)} knots`;


        // Update conditions
        document.getElementById("conditions").textContent =
            getWeatherDescription(current.weather_code);


        status.textContent = "Current conditions loaded.";

    } catch (error) {

        console.error("Weather error:", error);

        status.textContent =
            "Unable to find weather for that location.";

    }
}


// ------------------------------
// BOAT FLEET
// ------------------------------

const boatContainer = document.getElementById("boat-container");
const sortSelect = document.getElementById("sort");


// Display boats
function displayBoats(boats) {

    boatContainer.innerHTML = "";


    if (!boats || boats.length === 0) {

        boatContainer.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
                font-size: 18px;
            ">
                No boat listings found.
            </p>
        `;

        return;
    }


    boats.forEach((boat) => {

        // Get the first available photo
        const image =
            boat.photos && boat.photos.length > 0
                ? boat.photos[0]
                : "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=900&q=80";


        // Price
        let price = "Price on Application";

        if (
            boat.price !== null &&
            boat.price !== undefined &&
            boat.price !== ""
        ) {
            price = `${boat.currency || "$"} ${Number(boat.price).toLocaleString()}`;
        }


        // Length
        let length = "Length unavailable";

        if (boat.length_m) {
            length = `${boat.length_m} m`;
        }


        // Boat name
        const boatName =
            boat.title ||
            `${boat.make || ""} ${boat.model || ""}`.trim() ||
            "Bluewater Sailboat";


        // Create card
        const card = document.createElement("div");

        card.className = "boat-card";


        card.innerHTML = `
            <img
                class="boat-image"
                src="${image}"
                alt="${boatName}"
                onerror="this.src='https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=900&q=80'"
            >

            <div class="boat-info">

                <h3>${boatName}</h3>

                <p>
                    <strong>Make:</strong>
                    ${boat.make || "N/A"}
                </p>

                <p>
                    <strong>Model:</strong>
                    ${boat.model || "N/A"}
                </p>

                <p>
                    <strong>Year:</strong>
                    ${boat.year || "N/A"}
                </p>

                <p>
                    <strong>Length:</strong>
                    ${length}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${boat.location || "Location unavailable"}
                </p>

                <p class="price">
                    ${price}
                </p>

                ${
                    boat.url
                        ? `
                        <a
                            href="${boat.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="
                                display: inline-block;
                                margin-top: 10px;
                                color: #0b6e99;
                                font-weight: bold;
                                text-decoration: none;
                            "
                        >
                            View Listing →
                        </a>
                        `
                        : ""
                }

            </div>
        `;


        boatContainer.appendChild(card);

    });

}


// ------------------------------
// LOAD BOATS
// ------------------------------

async function loadBoats(sortValue = "default") {

    boatContainer.innerHTML = `
        <p style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
        ">
            Loading real boat listings...
        </p>
    `;


    try {

        let apiUrl =
            `${BOAT_API}?category=Sail&limit=12`;


        // Tell the real API how to sort the boats
        if (sortValue === "price-low") {
            apiUrl += "&sort=price_asc";
        }

        else if (sortValue === "price-high") {
            apiUrl += "&sort=price_desc";
        }

        else if (sortValue === "length-short") {
            apiUrl += "&sort=length_asc";
        }

        else if (sortValue === "length-long") {
            apiUrl += "&sort=length_desc";
        }


        console.log("Loading boats from:", apiUrl);


        const response = await fetch(apiUrl);


        if (!response.ok) {
            throw new Error(
                `Boat API returned ${response.status}`
            );
        }


        const data = await response.json();


        console.log("Boat API data:", data);


        // API returns the boats inside data.boats
        let boats = data.boats || [];


        // Name sorting isn't provided by the API,
        // so we sort those alphabetically here.
        if (sortValue === "name") {

            boats.sort((a, b) => {

                const nameA =
                    a.title ||
                    `${a.make || ""} ${a.model || ""}`;

                const nameB =
                    b.title ||
                    `${b.make || ""} ${b.model || ""}`;

                return nameA.localeCompare(nameB);

            });

        }


        displayBoats(boats);


    } catch (error) {

        console.error("Boat API error:", error);


        boatContainer.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
            ">

                <h3>Boat listings are currently unavailable.</h3>

                <p style="margin-top: 10px;">
                    Please try again in a moment.
                </p>

            </div>
        `;

    }

}


// ------------------------------
// BUTTON EVENTS
// ------------------------------

locationButton.addEventListener("click", () => {

    const location = locationInput.value.trim();

    if (location) {
        getWeather(location);
    }

});


// Allow pressing Enter in the location box
locationInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const location = locationInput.value.trim();

        if (location) {
            getWeather(location);
        }

    }

});


// Sorting
sortSelect.addEventListener("change", () => {

    loadBoats(sortSelect.value);

});


// ------------------------------
// INITIAL PAGE LOAD
// ------------------------------

// Load Miami weather
getWeather("Miami");

// Load real sailboat listings
loadBoats("default");