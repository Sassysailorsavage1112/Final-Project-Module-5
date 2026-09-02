// ==========================================
// BLUEWATER YACHTS
// ==========================================

// ==========================================
// WEATHER
// ==========================================

const locationInput = document.getElementById("location-input");
const locationButton = document.getElementById("location-button");

function getWindDirection(degrees) {
    const directions = [
        "N", "NE", "E", "SE",
        "S", "SW", "W", "NW"
    ];

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

        console.error("Weather error:", error);

        status.textContent =
            "Unable to find weather for that location.";

    }
}


// ==========================================
// REAL BOAT API
// ==========================================

// IMPORTANT:
// Your file is api/boat.js
// Therefore the Vercel endpoint is /api/boat

const BOAT_API = "/api/boat";

const boatContainer =
    document.getElementById("boat-container");

const sortSelect =
    document.getElementById("sort");


// ==========================================
// DISPLAY REAL BOATS
// ==========================================

function displayBoats(boats) {

    boatContainer.innerHTML = "";

    if (!boats || boats.length === 0) {

        boatContainer.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
            ">
                No sailboats were found.
            </p>
        `;

        return;
    }

    boats.forEach((boat) => {

        const card =
            document.createElement("div");

        card.className = "boat-card";


        const boatName =
            boat.title ||
            `${boat.make || ""} ${boat.model || ""}`.trim() ||
            "Sailboat";


        let imageHTML = "";

        if (
            boat.photos &&
            Array.isArray(boat.photos) &&
            boat.photos.length > 0
        ) {

            imageHTML = `
                <img
                    class="boat-image"
                    src="${boat.photos[0]}"
                    alt="${boatName}"
                >
            `;

        } else {

            imageHTML = `
                <div
                    class="boat-image"
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#e9eef1;
                        color:#52636d;
                    "
                >
                    Photo unavailable
                </div>
            `;

        }


        let price = "Price on Application";

        if (
            boat.price !== null &&
            boat.price !== undefined &&
            boat.price !== ""
        ) {

            price =
                `${boat.currency || ""} ${Number(
                    boat.price
                ).toLocaleString()}`;

        }


        const length =
            boat.length_m
                ? `${boat.length_m} m`
                : "N/A";


        card.innerHTML = `

            ${imageHTML}

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
                    ${boat.location || "N/A"}
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
                                    display:inline-block;
                                    margin-top:10px;
                                    color:#0b6e99;
                                    font-weight:bold;
                                    text-decoration:none;
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


// ==========================================
// LOAD BOATS FROM REAL API
// ==========================================

async function loadBoats(sortValue = "default") {

    boatContainer.innerHTML = `

        <p style="
            grid-column:1 / -1;
            text-align:center;
            padding:40px;
        ">
            Loading real sailboat listings...
        </p>

    `;


    try {

        const params =
            new URLSearchParams();

        params.set("category", "Sail");
        params.set("limit", "12");


        // These values are sent to
        // the REAL BoatListing API.

        if (sortValue === "price-low") {
            params.set("sort", "price_asc");
        }

        if (sortValue === "price-high") {
            params.set("sort", "price_desc");
        }

        if (sortValue === "length-short") {
            params.set("sort", "length_asc");
        }

        if (sortValue === "length-long") {
            params.set("sort", "length_desc");
        }


        const response =
            await fetch(
                `${BOAT_API}?${params.toString()}`
            );


        if (!response.ok) {

            throw new Error(
                `Boat API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "REAL BOAT API:",
            data
        );


        displayBoats(
            data.boats || []
        );


    } catch (error) {

        console.error(
            "Boat API error:",
            error
        );


        boatContainer.innerHTML = `

            <div style="
                grid-column:1 / -1;
                text-align:center;
                padding:40px;
            ">

                <h3>
                    Boat listings are currently unavailable.
                </h3>

                <p style="margin-top:10px;">
                    ${error.message}
                </p>

            </div>

        `;

    }
}


// ==========================================
// LOCATION SEARCH
// ==========================================

locationButton.addEventListener(
    "click",
    () => {

        const location =
            locationInput.value.trim();

        if (location) {
            getWeather(location);
        }

    }
);


locationInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            const location =
                locationInput.value.trim();

            if (location) {
                getWeather(location);
            }

        }

    }
);


// ==========================================
// SORTING
// ==========================================

sortSelect.addEventListener(
    "change",
    () => {

        loadBoats(
            sortSelect.value
        );

    }
);


// ==========================================
// START WEBSITE
// ==========================================

getWeather("Miami");

loadBoats("default");