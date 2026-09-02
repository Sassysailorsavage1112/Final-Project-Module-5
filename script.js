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
// This is the REAL BoatListing API.
// No fake boat data is being used.

const BOAT_API =
    "https://boatlisting.com.au/api/v1/boats";

const boatContainer =
    document.getElementById("boat-container");

const sortSelect =
    document.getElementById("sort");


// ==========================================
// DISPLAY BOATS
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

        let image =
            "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=900&q=80";


        if (boat.photos && boat.photos.length > 0) {
            image = boat.photos[0];
        }


        let price = "Price on Application";

        if (
            boat.price !== null &&
            boat.price !== undefined &&
            boat.price !== ""
        ) {

            price =
                `${boat.currency || "AU$"} ${Number(
                    boat.price
                ).toLocaleString()}`;
        }


        let length = "N/A";

        if (boat.length_m) {
            length = `${boat.length_m} m`;
        }


        const boatName =
            boat.title ||
            `${boat.make || ""} ${boat.model || ""}`.trim() ||
            "Bluewater Sailboat";


        const card =
            document.createElement("div");

        card.className = "boat-card";


        card.innerHTML = `

            <img
                class="boat-image"
                src="${image}"
                alt="${boatName}"
                onerror="
                    this.src='https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=900&q=80'
                "
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
// LOAD REAL SAILBOATS
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

        let url =
            `${BOAT_API}?category=Sail&limit=12`;


        if (sortValue === "price-low") {
            url += "&sort=price_asc";
        }

        if (sortValue === "price-high") {
            url += "&sort=price_desc";
        }

        if (sortValue === "length-short") {
            url += "&sort=length_asc";
        }

        if (sortValue === "length-long") {
            url += "&sort=length_desc";
        }


        console.log("REAL BOAT API:", url);


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Boat API returned ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "REAL BOAT API RESPONSE:",
            data
        );


        let boats =
            data.boats || [];


        // Name sorting
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

        console.error(
            "REAL BOAT API ERROR:",
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
                    API Error: ${error.message}
                </p>

            </div>

        `;

    }
}


// ==========================================
// BUTTONS
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