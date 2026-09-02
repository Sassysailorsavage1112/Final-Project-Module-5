/* =====================================================
   BLUEWATER YACHTS
   REAL SAILBOAT API
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const boatContainer =
    document.getElementById("boat-container");

const sortSelect =
    document.getElementById("sort");


/* =====================================================
   STORE BOATS
===================================================== */

let boats = [];


/* =====================================================
   GET BOAT TITLE
===================================================== */

function getBoatTitle(boat) {

    return (
        boat.title ||
        boat.name ||
        boat.model ||
        "Sailboat"
    );

}


/* =====================================================
   GET BOAT TYPE
===================================================== */

function getBoatType(boat) {

    return (
        boat.boatType ||
        boat.boat_type ||
        boat.type ||
        boat.category ||
        "Sailboat"
    );

}


/* =====================================================
   GET BOAT YEAR
===================================================== */

function getBoatYear(boat) {

    return (
        boat.year ||
        "N/A"
    );

}


/* =====================================================
   GET BOAT LENGTH
===================================================== */

function getBoatLength(boat) {

    const length =
        boat.length_m ??
        boat.length;

    if (
        length === null ||
        length === undefined ||
        length === ""
    ) {
        return "N/A";
    }

    const number =
        Number(length);

    if (isNaN(number)) {
        return "N/A";
    }

    /*
       BoatListing gives length in metres.

       Convert metres to feet.
    */

    return (
        (number * 3.28084).toFixed(1) +
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
        boat.price === undefined ||
        boat.price === ""
    ) {
        return "Price on Application";
    }

    const price =
        Number(boat.price);

    if (isNaN(price)) {
        return "Price on Application";
    }

    const currency =
        boat.currency ||
        "AUD";

    return (
        currency +
        " $" +
        price.toLocaleString()
    );

}


/* =====================================================
   GET LOCATION
===================================================== */

function getBoatLocation(boat) {

    if (
        typeof boat.location === "string"
    ) {
        return boat.location;
    }


    if (
        boat.location &&
        typeof boat.location === "object"
    ) {

        const locationParts = [];

        if (boat.location.city) {
            locationParts.push(
                boat.location.city
            );
        }

        if (boat.location.state) {
            locationParts.push(
                boat.location.state
            );
        }

        if (boat.location.country) {
            locationParts.push(
                boat.location.country
            );
        }

        if (
            locationParts.length > 0
        ) {
            return locationParts.join(
                ", "
            );
        }

    }


    return "Location unavailable";

}


/* =====================================================
   GET IMAGE
===================================================== */

function getBoatImage(boat) {

    /*
       BoatListing photos are normally
       provided as an array.
    */

    if (
        Array.isArray(boat.photos) &&
        boat.photos.length > 0
    ) {

        const photo =
            boat.photos[0];


        if (
            typeof photo === "string"
        ) {
            return photo;
        }


        if (
            photo &&
            photo.url
        ) {
            return photo.url;
        }

    }


    /*
       Other possible image fields.
    */

    if (
        boat.image &&
        typeof boat.image === "string"
    ) {
        return boat.image;
    }


    if (
        boat.image_url &&
        typeof boat.image_url === "string"
    ) {
        return boat.image_url;
    }


    /*
       Backup image.
    */

    return (
        "https://images.unsplash.com/" +
        "photo-1540946485063-a40da27545f8" +
        "?auto=format&fit=crop&w=1000&q=80"
    );

}


/* =====================================================
   DISPLAY BOATS
===================================================== */

function displayBoats(boatList) {

    boatContainer.innerHTML = "";


    if (
        !boatList ||
        boatList.length === 0
    ) {

        boatContainer.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
                background: white;
                border-radius: 15px;
            ">

                <h3>
                    No sailboats found
                </h3>

                <p>
                    The BoatListing API did not
                    return any current sailboat listings.
                </p>

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


            card.classList.add(
                "boat-card"
            );


            const title =
                getBoatTitle(boat);


            const type =
                getBoatType(boat);


            const year =
                getBoatYear(boat);


            const length =
                getBoatLength(boat);


            const price =
                getBoatPrice(boat);


            const location =
                getBoatLocation(boat);


            const image =
                getBoatImage(boat);


            const listingURL =
                boat.url || "#";


            card.innerHTML = `

                <img
                    src="${image}"
                    alt="${title}"
                    class="boat-image"
                    loading="lazy"
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
                            Year:
                        </strong>
                        ${year}
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
                        ? `
                            <a
                                href="${listingURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="
                                    display: inline-block;
                                    margin-top: 10px;
                                    padding: 10px 15px;
                                    background: #0b6e99;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 6px;
                                    font-weight: bold;
                                "
                            >
                                View Real Listing
                            </a>
                        `
                        : ""
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
   LOAD BOATS FROM OUR VERCEL API
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
                Loading real sailboats...
            </h3>

            <p>
                Connecting to BoatListing.com.au
            </p>

        </div>

    `;


    try {

        /*
           IMPORTANT:

           We are NOT calling BoatListing directly
           from the browser anymore.

           We call our own Vercel API route:

           /api/boats

           Vercel then contacts BoatListing.
        */

        let url =
            "/api/boats";


        /*
           Tell our Vercel function
           which sort option was selected.
        */

        if (
            sort !== "default"
        ) {

            url +=
                "?sort=" +
                encodeURIComponent(
                    sort
                );

        }


        console.log(
            "Website requesting:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Our Vercel API returned " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Real BoatListing data:",
            data
        );


        /*
           BoatListing's documented response
           contains a "boats" array.
        */

        if (
            Array.isArray(data.boats)
        ) {

            boats =
                data.boats;

        }

        else if (
            Array.isArray(data)
        ) {

            boats =
                data;

        }

        else {

            boats = [];

        }


        /*
           Name sorting is performed
           on the real API results.
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
            `Loaded ${boats.length} real sailboats.`
        );

    }


    catch (error) {

        console.error(
            "Sailboat API Error:",
            error
        );


        boatContainer.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px;
                background: white;
                border-radius: 15px;
            ">

                <h3>
                    Sailboat listings are
                    currently unavailable.
                </h3>

                <p>
                    Please refresh the page
                    and try again.
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
   LOAD REAL SAILBOATS
===================================================== */

loadBoats();



/* =====================================================
   WEATHER
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
   GET WEATHER
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
            encodeURIComponent(location) +
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
            ) + "°F";


        document.getElementById(
            "wind-speed"
        ).textContent =
            Math.round(
                current.wind_speed_10m
            ) + " knots";


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
            ) + " knots";


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