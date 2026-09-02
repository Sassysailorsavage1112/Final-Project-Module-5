/* =====================================================
   BLUEWATER YACHTS

   REAL SAILBOAT API
   BoatListing.com.au

   No API key required.
===================================================== */


/* =====================================================
   BOAT API
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
   STORE API BOATS
===================================================== */

let boats = [];



/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(boat) {

    if (
        boat.priceOnApplication ||
        boat.price === null ||
        boat.price === undefined
    ) {

        return "Price on Application";

    }


    return (
        boat.currency || "AUD"
    ) +
    " " +
    Number(boat.price).toLocaleString();

}



/* =====================================================
   CONVERT METERS TO FEET
===================================================== */

function metersToFeet(meters) {

    if (
        meters === null ||
        meters === undefined ||
        isNaN(meters)
    ) {

        return null;

    }


    return (
        Number(meters) * 3.28084
    );

}



/* =====================================================
   GET LOCATION
===================================================== */

function getBoatLocation(boat) {

    if (!boat.location) {

        return "Location unavailable";

    }


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


    if (parts.length === 0) {

        return "Location unavailable";

    }


    return parts.join(", ");

}



/* =====================================================
   GET BOAT IMAGE
===================================================== */

function getBoatImage(boat) {

    if (
        boat.photos &&
        boat.photos.length > 0
    ) {

        return boat.photos[0];

    }


    /*
       Backup image in case a listing
       does not contain a photograph.
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


        const image =
            getBoatImage(boat);


        const lengthFeet =
            metersToFeet(
                boat.length_m
            );


        const lengthText =
            lengthFeet !== null
                ? `${lengthFeet.toFixed(1)} ft`
                : "Length unavailable";


        const boatType =
            boat.boatType ||
            boat.category ||
            "Sailboat";


        const year =
            boat.year ||
            "Year unavailable";


        const location =
            getBoatLocation(boat);


        boatCard.innerHTML = `

            <img
                src="${image}"
                alt="${boat.title || "Sailboat"}"
                class="boat-image"
                loading="lazy"
                onerror="this.src='https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1000&q=80'"
            >


            <div class="boat-info">

                <h3>
                    ${boat.title || "Sailboat"}
                </h3>


                <p>
                    <strong>Type:</strong>
                    ${boatType}
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
                    boat.url
                        ? `
                            <a
                                href="${boat.url}"
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
   LOAD SAILBOATS FROM REAL API
===================================================== */

async function loadBoats(sortOption = "default") {

    boatStatus.textContent =
        "Loading real sailboats from BoatListing.com.au...";


    boatContainer.innerHTML = "";


    try {

        /*
            Build the API URL.

            category=Sail means we are specifically
            asking the boating API for sailboats.

            This is NOT our old hard-coded boat array.
        */

        const url =
            new URL(
                BOAT_API_URL
            );


        url.searchParams.set(
            "category",
            "Sail"
        );


        /*
            Ask the API for 12 real listings.
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

            /*
                REAL API SORT

                price_asc is provided by
                BoatListing.com's API.
            */

            url.searchParams.set(
                "sort",
                "price_asc"
            );

        }


        else if (
            sortOption === "price-high"
        ) {

            /*
                REAL API SORT
            */

            url.searchParams.set(
                "sort",
                "price_desc"
            );

        }


        else if (
            sortOption === "length-short"
        ) {

            /*
                REAL API SORT
            */

            url.searchParams.set(
                "sort",
                "length_asc"
            );

        }


        else if (
            sortOption === "length-long"
        ) {

            /*
                REAL API SORT
            */

            url.searchParams.set(
                "sort",
                "length_desc"
            );

        }



        /*
            Send request to the REAL boating API.
        */

        const response =
            await fetch(
                url.toString()
            );


        if (!response.ok) {

            throw new Error(
                "Boat API request failed."
            );

        }


        /*
            Convert API response to JSON.
        */

        const data =
            await response.json();


        /*
            Save the actual API results.

            This is what our sorting feature works with.
        */

        boats =
            data.boats || [];


        /*
            NAME SORT

            The API does not advertise an A-Z name
            sort, so we sort the real API results
            in JavaScript.
        */

        if (
            sortOption === "name"
        ) {

            boats.sort(
                function(a, b) {

                    return (
                        (a.title || "")
                            .localeCompare(
                                b.title || ""
                            )
                    );

                }
            );

        }


        /*
            Display the API results.
        */

        displayBoats(
            boats
        );


        /*
            Tell the user how many real listings
            came from the API.
        */

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
                    Sailboat listings are temporarily unavailable.
                </h3>

                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}



/* =====================================================
   SORT EVENT
===================================================== */

sortSelect.addEventListener(
    "change",
    function() {

        const selectedSort =
            sortSelect.value;


        /*
            IMPORTANT:

            We call the REAL API again whenever
            the user changes the sorting.

            Therefore the sorting feature is
            directly connected to the API.
        */

        loadBoats(
            selectedSort
        );

    }
);



/* =====================================================
   LOAD REAL SAILBOATS WHEN PAGE OPENS
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
   GET WEATHER FOR ANY LOCATION
===================================================== */

async function getWeatherForLocation(
    location
) {

    weatherStatus.textContent =
        "Finding location...";


    try {

        /*
            STEP 1:
            Open-Meteo Geocoding API
        */

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



        /*
            STEP 2:
            Open-Meteo Weather API
        */

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



        /* =================================================
           UPDATE WEATHER
        ================================================= */


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
   LOAD MIAMI WEATHER
===================================================== */

getWeatherForLocation(
    "Miami"
);