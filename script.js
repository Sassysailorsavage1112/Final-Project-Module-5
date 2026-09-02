/* =====================================================
   BLUEWATER YACHTS
   REAL BOATLISTING API
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const boatContainer =
    document.getElementById(
        "boat-container"
    );

const sortSelect =
    document.getElementById(
        "sort"
    );


/* =====================================================
   BOAT DATA
===================================================== */

let boats = [];


/* =====================================================
   GET BOAT TITLE
===================================================== */

function getBoatTitle(boat) {

    return (
        boat.title ||
        `${boat.year || ""} ${boat.make || ""} ${boat.model || ""}`.trim() ||
        "Boat Listing"
    );

}


/* =====================================================
   GET BOAT TYPE
===================================================== */

function getBoatType(boat) {

    return (
        boat.boatType ||
        boat.category ||
        "Boat"
    );

}


/* =====================================================
   GET BOAT LENGTH
===================================================== */

function getBoatLength(boat) {

    if (
        boat.length_m === null ||
        boat.length_m === undefined
    ) {

        return "N/A";

    }


    const feet =
        Number(
            boat.length_m
        ) * 3.28084;


    return (
        feet.toFixed(1) +
        " ft"
    );

}


/* =====================================================
   GET PRICE
===================================================== */

function getBoatPrice(boat) {

    if (
        boat.priceOnApplication === true
    ) {

        return "Price on Application";

    }


    if (
        boat.price === null ||
        boat.price === undefined
    ) {

        return "Price on Application";

    }


    return (
        boat.currency ||
        "AUD"
    ) +
    " $" +
    Number(
        boat.price
    ).toLocaleString();

}


/* =====================================================
   GET LOCATION
===================================================== */

function getBoatLocation(boat) {

    if (
        !boat.location
    ) {

        return "Location unavailable";

    }


    if (
        typeof boat.location === "string"
    ) {

        return boat.location;

    }


    const parts = [];


    if (
        boat.location.city
    ) {

        parts.push(
            boat.location.city
        );

    }


    if (
        boat.location.state
    ) {

        parts.push(
            boat.location.state
        );

    }


    if (
        boat.location.country
    ) {

        parts.push(
            boat.location.country
        );

    }


    return (
        parts.length
            ? parts.join(", ")
            : "Location unavailable"
    );

}


/* =====================================================
   GET IMAGE
===================================================== */

function getBoatImage(boat) {

    if (
        Array.isArray(
            boat.photos
        ) &&
        boat.photos.length > 0
    ) {

        return boat.photos[0];

    }


    return (
        "https://images.unsplash.com/" +
        "photo-1540946485063-a40da27545f8" +
        "?auto=format&fit=crop&w=1000&q=80"
    );

}


/* =====================================================
   DISPLAY BOATS
===================================================== */

function displayBoats(
    boatList
) {

    boatContainer.innerHTML = "";


    if (
        !boatList ||
        boatList.length === 0
    ) {

        boatContainer.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                background: white;
                padding: 40px;
                border-radius: 15px;
                text-align: center;
            ">

                <h3>
                    No boat listings found.
                </h3>

            </div>

        `;

        return;

    }


    boatList.forEach(
        function(boat) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "boat-card";


            const title =
                getBoatTitle(
                    boat
                );


            const type =
                getBoatType(
                    boat
                );


            const length =
                getBoatLength(
                    boat
                );


            const price =
                getBoatPrice(
                    boat
                );


            const location =
                getBoatLocation(
                    boat
                );


            const image =
                getBoatImage(
                    boat
                );


            const listingURL =
                boat.url ||
                "#";


            card.innerHTML = `

                <img
                    src="${image}"
                    alt="${title}"
                    class="boat-image"
                    loading="lazy"
                    onerror="
                        this.src='https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1000&q=80'
                    "
                >


                <div class="boat-info">

                    <h3>
                        ${title}
                    </h3>


                    <p>
                        <strong>
                            Type:
                        </strong>
                        ${type}
                    </p>


                    <p>
                        <strong>
                            Length:
                        </strong>
                        ${length}
                    </p>


                    <p>
                        <strong>
                            Location:
                        </strong>
                        ${location}
                    </p>


                    <p class="price">
                        ${price}
                    </p>


                    ${
                        listingURL !== "#"
                        ?
                        `
                            <a
                                href="${listingURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="boat-link"
                            >
                                View Real Listing
                            </a>
                        `
                        :
                        ""
                    }

                </div>

            `;


            boatContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   LOAD REAL BOATS
===================================================== */

async function loadBoats(
    sort = "default"
) {

    boatContainer.innerHTML = `

        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
        ">

            <h3>
                Loading real boat listings...
            </h3>

            <p>
                Connecting to BoatListing.com.au
            </p>

        </div>

    `;


    try {

        let apiURL =
            "/api/boats";


        /*
            Tell our Vercel function
            what sorting the user selected.
        */

        if (
            sort !== "default"
        ) {

            apiURL +=
                "?sort=" +
                encodeURIComponent(
                    sort
                );

        }


        console.log(
            "Requesting:",
            apiURL
        );


        /*
            CONTACT OUR VERCEL FUNCTION
        */

        const response =
            await fetch(
                apiURL
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Our API returned HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "REAL BOAT DATA:",
            data
        );


        /*
            BoatListing returns:

            {
                boats: [...]
            }
        */

        if (
            Array.isArray(
                data.boats
            )
        ) {

            boats =
                data.boats;

        }


        else if (
            Array.isArray(
                data
            )
        ) {

            boats =
                data;

        }


        else {

            boats = [];

        }


        /*
            Name sorting happens on the
            real API results.
        */

        if (
            sort === "name"
        ) {

            boats.sort(
                function(a, b) {

                    return getBoatTitle(a)
                        .localeCompare(
                            getBoatTitle(b)
                        );

                }
            );

        }


        displayBoats(
            boats
        );


        console.log(
            "Loaded real boats:",
            boats.length
        );

    }


    catch (error) {

        console.error(
            "Boat API Error:",
            error
        );


        boatContainer.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                background: white;
                padding: 40px;
                border-radius: 15px;
                text-align: center;
            ">

                <h3>
                    Boat listings are currently unavailable.
                </h3>

                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}


/* =====================================================
   SORTING
===================================================== */

sortSelect.addEventListener(
    "change",
    function() {

        loadBoats(
            sortSelect.value
        );

    }
);


/* =====================================================
   START BOAT API
===================================================== */

loadBoats();


/* =====================================================
   WEATHER API
===================================================== */

const locationInput =
    document.getElementById(
        "location-input"
    );


const locationButton =
    document.getElementById(
        "location-button"
    );


const weatherStatus =
    document.getElementById(
        "weather-status"
    );


const weatherLocation =
    document.getElementById(
        "weather-location"
    );


/* =====================================================
   WIND DIRECTION
===================================================== */

function getWindDirection(
    degrees
) {

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


    const index =
        Math.round(
            degrees / 45
        ) % 8;


    return directions[index];

}


/* =====================================================
   WEATHER DESCRIPTION
===================================================== */

function getWeatherDescription(
    code
) {

    const descriptions = {

        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Light Drizzle",
        53: "Drizzle",
        55: "Heavy Drizzle",
        61: "Light Rain",
        63: "Rain",
        65: "Heavy Rain",
        71: "Light Snow",
        73: "Snow",
        75: "Heavy Snow",
        80: "Rain Showers",
        81: "Rain Showers",
        82: "Heavy Rain Showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Thunderstorm"

    };


    return (
        descriptions[code] ||
        "Unknown"
    );

}


/* =====================================================
   WEATHER FUNCTION
===================================================== */

async function getWeatherForLocation(
    location
) {

    weatherStatus.textContent =
        "Finding location...";


    try {

        const geocodingURL =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" +
            encodeURIComponent(
                location
            ) +
            "&count=1" +
            "&language=en" +
            "&format=json";


        const geocodingResponse =
            await fetch(
                geocodingURL
            );


        if (
            !geocodingResponse.ok
        ) {

            throw new Error(
                "Location search failed."
            );

        }


        const geocodingData =
            await geocodingResponse.json();


        if (
            !geocodingData.results ||
            geocodingData.results.length === 0
        ) {

            throw new Error(
                "Location not found."
            );

        }


        const place =
            geocodingData.results[0];


        const latitude =
            place.latitude;


        const longitude =
            place.longitude;


        weatherStatus.textContent =
            "Loading sailing conditions...";


        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&current=" +
            "temperature_2m," +
            "weather_code," +
            "wind_speed_10m," +
            "wind_direction_10m," +
            "wind_gusts_10m" +
            "&temperature_unit=fahrenheit" +
            "&wind_speed_unit=kn" +
            "&timezone=auto";


        const weatherResponse =
            await fetch(
                weatherURL
            );


        if (
            !weatherResponse.ok
        ) {

            throw new Error(
                "Weather request failed."
            );

        }


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        document.getElementById(
            "temperature"
        ).textContent =
            Math.round(
                current.temperature_2m
            ) +
            "°F";


        document.getElementById(
            "wind-speed"
        ).textContent =
            Math.round(
                current.wind_speed_10m
            ) +
            " knots";


        document.getElementById(
            "wind-direction"
        ).textContent =
            getWindDirection(
                current.wind_direction_10m
            );


        document.getElementById(
            "wind-gusts"
        ).textContent =
            Math.round(
                current.wind_gusts_10m
            ) +
            " knots";


        document.getElementById(
            "conditions"
        ).textContent =
            getWeatherDescription(
                current.weather_code
            );


        weatherLocation.textContent =
            "📍 " +
            place.name +
            ", " +
            place.country;


        weatherStatus.textContent =
            "Live sailing data retrieved from Open-Meteo.";

    }


    catch (error) {

        console.error(
            "Weather API Error:",
            error
        );


        weatherStatus.textContent =
            "We couldn't find that location. Please try another city or country.";

    }

}


/* =====================================================
   WEATHER BUTTON
===================================================== */

locationButton.addEventListener(
    "click",
    function() {

        const location =
            locationInput.value.trim();


        if (
            location === ""
        ) {

            weatherStatus.textContent =
                "Please enter a location.";

            return;

        }


        getWeatherForLocation(
            location
        );

    }
);


/* =====================================================
   ENTER KEY
===================================================== */

locationInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            const location =
                locationInput.value.trim();


            if (
                location === ""
            ) {

                weatherStatus.textContent =
                    "Please enter a location.";

                return;

            }


            getWeatherForLocation(
                location
            );

        }

    }
);


/* =====================================================
   INITIAL WEATHER
===================================================== */

getWeatherForLocation(
    "Miami"
);