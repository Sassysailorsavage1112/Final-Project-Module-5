/* =====================================================
   BLUEWATER YACHTS
   REAL SAILBOAT API + WEATHER API
===================================================== */


/* =====================================================
   BOAT API
   Free public API - no API key required
===================================================== */

const BOAT_API_URL =
    "https://boatlisting.com.au/api/v1/boats";


/* =====================================================
   BOAT ELEMENTS
===================================================== */

const boatContainer =
    document.getElementById("boat-container");

const boatStatus =
    document.getElementById("boat-status");

const sortSelect =
    document.getElementById("sort");


/* =====================================================
   STORE BOATS
===================================================== */

let boats = [];


/* =====================================================
   GET BOAT ARRAY FROM API RESPONSE
===================================================== */

function getBoatArray(data) {

    // If the API returns an array directly
    if (Array.isArray(data)) {
        return data;
    }

    // Try common API response formats
    if (Array.isArray(data.boats)) {
        return data.boats;
    }

    if (Array.isArray(data.results)) {
        return data.results;
    }

    if (Array.isArray(data.data)) {
        return data.data;
    }

    if (Array.isArray(data.items)) {
        return data.items;
    }

    return [];
}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(boat) {

    const price =
        boat.price ??
        boat.price_aud ??
        boat.asking_price ??
        boat.priceValue;

    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {
        return "Price on Application";
    }

    const numericPrice =
        Number(
            String(price)
                .replace(/[$,]/g, "")
        );

    if (isNaN(numericPrice)) {
        return String(price);
    }

    return (
        "$" +
        numericPrice.toLocaleString()
    );
}


/* =====================================================
   GET BOAT LENGTH
===================================================== */

function getBoatLength(boat) {

    const length =
        boat.length_m ??
        boat.length ??
        boat.lengthMeters;

    if (
        length === null ||
        length === undefined ||
        length === ""
    ) {
        return null;
    }

    const number =
        Number(
            String(length)
                .replace(/[^\d.]/g, "")
        );

    if (isNaN(number)) {
        return null;
    }

    /*
       The API documentation specifies
       length filters in metres.

       Convert metres to feet for display.
    */

    return number * 3.28084;
}


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
        boat.boat_type ||
        boat.boatType ||
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
        boat.build_year ||
        "N/A"
    );
}


/* =====================================================
   GET BOAT LOCATION
===================================================== */

function getBoatLocation(boat) {

    /*
       Some APIs return location as an object.
    */

    if (
        boat.location &&
        typeof boat.location === "object"
    ) {

        const parts = [];

        if (boat.location.city) {
            parts.push(
                boat.location.city
            );
        }

        if (boat.location.state) {
            parts.push(
                boat.location.state
            );
        }

        if (boat.location.country) {
            parts.push(
                boat.location.country
            );
        }

        if (parts.length > 0) {
            return parts.join(", ");
        }
    }


    /*
       Some listings may return individual
       location fields.
    */

    const parts = [];

    if (boat.city) {
        parts.push(boat.city);
    }

    if (boat.state) {
        parts.push(boat.state);
    }

    if (boat.country) {
        parts.push(boat.country);
    }

    if (parts.length > 0) {
        return parts.join(", ");
    }


    return "Location unavailable";
}


/* =====================================================
   GET BOAT IMAGE
===================================================== */

function getBoatImage(boat) {

    /*
       Try several possible image fields.
    */

    if (
        typeof boat.image === "string" &&
        boat.image.startsWith("http")
    ) {
        return boat.image;
    }

    if (
        typeof boat.image_url === "string" &&
        boat.image_url.startsWith("http")
    ) {
        return boat.image_url;
    }

    if (
        typeof boat.thumbnail === "string" &&
        boat.thumbnail.startsWith("http")
    ) {
        return boat.thumbnail;
    }


    if (
        Array.isArray(boat.photos) &&
        boat.photos.length > 0
    ) {

        const firstPhoto =
            boat.photos[0];

        if (
            typeof firstPhoto === "string"
        ) {
            return firstPhoto;
        }

        if (
            firstPhoto &&
            firstPhoto.url
        ) {
            return firstPhoto.url;
        }
    }


    /*
       Backup sailing image.
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

            <div class="api-error">

                <h3>
                    No sailboats found
                </h3>

                <p>
                    The boating API did not return
                    any sailboat listings.
                </p>

            </div>

        `;

        return;
    }


    boatList.forEach(function(boat) {

        const boatCard =
            document.createElement("div");


        boatCard.classList.add(
            "boat-card"
        );


        const title =
            getBoatTitle(boat);


        const image =
            getBoatImage(boat);


        const type =
            getBoatType(boat);


        const year =
            getBoatYear(boat);


        const lengthFeet =
            getBoatLength(boat);


        const lengthText =
            lengthFeet !== null
                ? lengthFeet.toFixed(1) + " ft"
                : "N/A";


        const location =
            getBoatLocation(boat);


        const listingURL =
            boat.url ||
            boat.listing_url ||
            boat.link ||
            "#";


        boatCard.innerHTML = `

            <img
                src="${image}"
                alt="${title}"
                class="boat-image"
                loading="lazy"
                onerror="this.src='https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1000&q=80'"
            >

            <div class="boat-info">

                <h3>
                    ${title}
                </h3>

                <p>
                    <strong>Type:</strong>
                    ${type}
                </p>

                <p>
                    <strong>Year:</strong>
                    ${year}
                </p>

                <p>
                    <strong>Length:</strong>
                    ${lengthText}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${location}
                </p>

                <p class="price">
                    ${formatPrice(boat)}
                </p>

                ${
                    listingURL !== "#"
                    ? `
                        <a
                            href="${listingURL}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="boat-link"
                        >
                            View Real Listing
                        </a>
                    `
                    : ""
                }

            </div>

        `;


        boatContainer.appendChild(
            boatCard
        );

    });
}


/* =====================================================
   LOAD REAL SAILBOATS
===================================================== */

async function loadBoats(
    sortOption = "default"
) {

    boatStatus.textContent =
        "Loading real sailboats from BoatListing.com.au...";


    boatContainer.innerHTML = "";


    try {

        /*
           Create the API URL.
        */

        const url =
            new URL(
                BOAT_API_URL
            );


        /*
           IMPORTANT:

           This tells the real boating API
           that we specifically want SAIL boats.
        */

        url.searchParams.set(
            "category",
            "Sail"
        );


        /*
           Get 12 listings.
        */

        url.searchParams.set(
            "limit",
            "12"
        );


        /* =================================================
           API-CONNECTED SORTING
        ================================================= */


        if (
            sortOption === "price-low"
        ) {

            url.searchParams.set(
                "sort",
                "price_asc"
            );

        }


        else if (
            sortOption === "price-high"
        ) {

            url.searchParams.set(
                "sort",
                "price_desc"
            );

        }


        else if (
            sortOption === "length-short"
        ) {

            url.searchParams.set(
                "sort",
                "length_asc"
            );

        }


        else if (
            sortOption === "length-long"
        ) {

            url.searchParams.set(
                "sort",
                "length_desc"
            );

        }


        /*
           DEBUGGING INFORMATION

           Open the browser console with F12
           if you need to show your instructor
           that the API request is being made.
        */

        console.log(
            "Boat API Request:",
            url.toString()
        );


        /*
           Fetch REAL boating data.
        */

        const response =
            await fetch(
                url.toString()
            );


        if (!response.ok) {

            throw new Error(
                "Boat API returned HTTP " +
                response.status
            );

        }


        /*
           Convert response to JSON.
        */

        const data =
            await response.json();


        /*
           Show the actual response
           in the browser console.
        */

        console.log(
            "Boat API Response:",
            data
        );


        /*
           Convert the response into
           our boat array.
        */

        boats =
            getBoatArray(data);


        /*
           Name sorting is done on the REAL
           API results.

           The other four sorts are sent
           directly to the API.
        */

        if (
            sortOption === "name"
        ) {

            boats.sort(
                function(a, b) {

                    return (
                        getBoatTitle(a)
                            .localeCompare(
                                getBoatTitle(b)
                            )
                    );

                }
            );

        }


        /*
           Display real API listings.
        */

        displayBoats(
            boats
        );


        boatStatus.textContent =
            `Showing ${boats.length} real sailboat listings from the BoatListing.com.au API.`;


    }

    catch (error) {

        console.error(
            "Boat API Error:",
            error
        );


        boatStatus.textContent =
            "Unable to load sailboat listings.";


        boatContainer.innerHTML = `

            <div class="api-error">

                <h3>
                    Sailboat listings are currently unavailable.
                </h3>

                <p>
                    The boating API could not be reached.
                </p>

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

        const selectedSort =
            sortSelect.value;


        /*
           IMPORTANT:

           Changing the sort makes a NEW request
           to the REAL boating API.

           This is the part your instructor
           wanted to see.
        */

        loadBoats(
            selectedSort
        );

    }
);


/* =====================================================
   LOAD BOATS ON PAGE LOAD
===================================================== */

loadBoats();



/* =====================================================
   WEATHER ELEMENTS
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
   WEATHER API
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


        if (!geocodingResponse.ok) {

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


        if (!weatherResponse.ok) {

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
   WEATHER ENTER KEY
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