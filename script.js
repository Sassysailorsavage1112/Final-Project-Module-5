// ===============================
// BLUEWATER YACHTS
// Real BoatListing API + Weather
// ===============================


// ===============================
// BOAT FLEET
// ===============================

const boatContainer = document.getElementById("boat-container");
const sortSelect = document.getElementById("sort");


// Convert API boat data into our website cards
function displayBoats(boats) {

    if (!boatContainer) return;

    if (!boats || boats.length === 0) {
        boatContainer.innerHTML = `
            <p class="no-boats">
                No boats were found for this selection.
            </p>
        `;
        return;
    }

    boatContainer.innerHTML = boats.map(boat => {

        const price = boat.price
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: boat.currency || "USD",
                maximumFractionDigits: 0
            }).format(boat.price)
            : "Price Upon Request";

        const location = boat.location
            ? [
                boat.location.city,
                boat.location.state,
                boat.location.country
            ].filter(Boolean).join(", ")
            : "Location unavailable";

        const image = boat.photos && boat.photos.length > 0
            ? boat.photos[0]
            : "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&q=80";

        return `
            <article class="boat-card">

                <img 
                    src="${image}" 
                    alt="${boat.title || "Sailboat"}"
                    class="boat-image"
                    onerror="this.src='https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&q=80'"
                >

                <div class="boat-info">

                    <h3>${boat.title || "Sailboat"}</h3>

                    <p class="boat-price">
                        ${price}
                    </p>

                    <div class="boat-details">

                        <span>
                            <strong>Year:</strong>
                            ${boat.year || "N/A"}
                        </span>

                        <span>
                            <strong>Length:</strong>
                            ${boat.length_m ? boat.length_m + " m" : "N/A"}
                        </span>

                        <span>
                            <strong>Type:</strong>
                            ${boat.boatType || "Sailboat"}
                        </span>

                        <span>
                            <strong>Location:</strong>
                            ${location}
                        </span>

                    </div>

                    <a 
                        href="${boat.url || "#"}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="boat-button"
                    >
                        View Listing
                    </a>

                </div>

            </article>
        `;

    }).join("");
}


// ===============================
// LOAD REAL BOATS FROM API
// ===============================

async function loadBoats(sort = "") {

    if (!boatContainer) return;

    boatContainer.innerHTML = `
        <p class="loading">
            Loading available yachts...
        </p>
    `;

    try {

        let url = "/api/boat?category=Sail&limit=12";

        // BoatListing API supports these sorting options
        if (sort === "price-low") {
            url += "&sort=price_asc";
        }

        if (sort === "price-high") {
            url += "&sort=price_desc";
        }

        if (sort === "length-short") {
            url += "&sort=length_asc";
        }

        if (sort === "length-long") {
            url += "&sort=length_desc";
        }

        if (sort === "year-new") {
            url += "&sort=year_desc";
        }

        if (sort === "year-old") {
            url += "&sort=year_asc";
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Boat API returned ${response.status}`);
        }

        const data = await response.json();

        displayBoats(data.boats);

    } catch (error) {

        console.error("Boat API Error:", error);

        boatContainer.innerHTML = `
            <div class="api-error">
                <h3>Fleet temporarily unavailable</h3>
                <p>
                    We couldn't load the current yacht inventory.
                    Please try again shortly.
                </p>
            </div>
        `;
    }
}


// ===============================
// SORTING
// ===============================

if (sortSelect) {

    sortSelect.addEventListener("change", function () {
        loadBoats(this.value);
    });

}


// Load real boats when page opens
loadBoats();


// ===============================
// WORLDWIDE WEATHER
// ===============================

const weatherForm = document.getElementById("weather-form");
const locationInput = document.getElementById("location-input");
const weatherResult = document.getElementById("weather-result");


async function getWeather(location) {

    if (!weatherResult) return;

    weatherResult.innerHTML = `
        <p>Finding weather for ${location}...</p>
    `;

    try {

        // Worldwide location search
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Location search failed");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found");
        }

        const place = geoData.results[0];

        const latitude = place.latitude;
        const longitude = place.longitude;

        // Worldwide weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn&temperature_unit=fahrenheit`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        const temperature = Math.round(current.temperature_2m);
        const windSpeed = Math.round(current.wind_speed_10m);
        const windGusts = Math.round(current.wind_gusts_10m);
        const windDirection = getWindDirection(
            current.wind_direction_10m
        );

        const condition = getWeatherDescription(
            current.weather_code
        );

        weatherResult.innerHTML = `
            <div class="weather-card">

                <h3>
                    ${place.name}${place.country ? ", " + place.country : ""}
                </h3>

                <p class="weather-condition">
                    ${condition}
                </p>

                <p class="weather-temperature">
                    ${temperature}°F
                </p>

                <div class="weather-details">

                    <span>
                        Wind:
                        <strong>${windSpeed} kn</strong>
                    </span>

                    <span>
                        Gusts:
                        <strong>${windGusts} kn</strong>
                    </span>

                    <span>
                        Direction:
                        <strong>${windDirection}</strong>
                    </span>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Weather Error:", error);

        weatherResult.innerHTML = `
            <p>
                We couldn't find weather for that location.
                Please try another city or country.
            </p>
        `;
    }
}


// Weather form
if (weatherForm) {

    weatherForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const location = locationInput
            ? locationInput.value.trim()
            : "";

        if (location) {
            getWeather(location);
        }

    });

}


// ===============================
// WEATHER HELPERS
// ===============================

function getWindDirection(degrees) {

    const directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"
    ];

    const index = Math.round(degrees / 45) % 8;

    return directions[index];
}


function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear sky",

        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",

        45: "Fog",
        48: "Depositing rime fog",

        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",

        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",

        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",

        66: "Light freezing rain",
        67: "Heavy freezing rain",

        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",

        77: "Snow grains",

        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",

        85: "Slight snow showers",
        86: "Heavy snow showers",

        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"

    };

    return weatherCodes[code] || "Weather conditions unavailable";
}