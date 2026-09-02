/* =====================================================
   BLUEWATER YACHTS
   BOAT DATA
===================================================== */

const boats = [
    {
        name: "Ocean Breeze 42",
        price: 450000,
        length: 42,
        type: "Catamaran",
        image: "https://yatcowpmedialibrary.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2023/06/catamaran-guide-72-dixon-catamaran-2017.jpg"
    },

    {
        name: "Blue Horizon 50",
        price: 725000,
        length: 50,
        type: "Catamaran",
        image: "https://www.davidwaltersyachts.com/hs-fs/hubfs/Hammer.jpg?height=2248&name=Hammer.jpg&width=3000"
    },

    {
        name: "Sea Voyager 38",
        price: 325000,
        length: 38,
        type: "Sailboat",
        image: "https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/21/2021/10/YAW265.best_multihull.seawind_1600_3-630x394.jpg"
    },

    {
        name: "Atlantic Explorer 55",
        price: 950000,
        length: 55,
        type: "Sailboat",
        image: "https://www.dreamyachtsales.com/app/uploads/2024/08/MAIN-dream-performance-program.jpg"
    },

    {
        name: "Coral Dream 46",
        price: 575000,
        length: 46,
        type: "Catamaran",
        image: "https://www.catlante-catamarans.com/sites/default/files/bloc/home/catlante%20neo-Sailing%20%281%29.jpg"
    },

    {
        name: "Pacific Star 60",
        price: 1200000,
        length: 60,
        type: "Sailboat",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Sunset_with_sail_boat_on_water_%28Unsplash%29.jpg"
    }
];


/* =====================================================
   DISPLAY BOATS
===================================================== */

const boatContainer =
    document.getElementById("boat-container");


function displayBoats(boatList) {

    boatContainer.innerHTML = "";

    boatList.forEach(function(boat) {

        const boatCard =
            document.createElement("div");

        boatCard.classList.add("boat-card");

        boatCard.innerHTML = `

            <img
                src="${boat.image}"
                alt="${boat.name}"
                class="boat-image"
            >

            <div class="boat-info">

                <h3>${boat.name}</h3>

                <p>
                    <strong>Type:</strong>
                    ${boat.type}
                </p>

                <p>
                    <strong>Length:</strong>
                    ${boat.length} ft
                </p>

                <p class="price">
                    $${boat.price.toLocaleString()}
                </p>

            </div>

        `;

        boatContainer.appendChild(boatCard);
    });
}


/* =====================================================
   SORTING
===================================================== */

const sortSelect =
    document.getElementById("sort");


sortSelect.addEventListener(
    "change",
    function() {

        const sortValue =
            sortSelect.value;

        let sortedBoats =
            [...boats];


        if (sortValue === "price-low") {

            sortedBoats.sort(
                function(a, b) {
                    return a.price - b.price;
                }
            );

        }


        else if (sortValue === "price-high") {

            sortedBoats.sort(
                function(a, b) {
                    return b.price - a.price;
                }
            );

        }


        else if (sortValue === "length-short") {

            sortedBoats.sort(
                function(a, b) {
                    return a.length - b.length;
                }
            );

        }


        else if (sortValue === "length-long") {

            sortedBoats.sort(
                function(a, b) {
                    return b.length - a.length;
                }
            );

        }


        else if (sortValue === "name") {

            sortedBoats.sort(
                function(a, b) {
                    return a.name.localeCompare(b.name);
                }
            );

        }


        displayBoats(sortedBoats);
    }
);


/*
    IMPORTANT:
    Display the boats immediately.

    This happens BEFORE the weather API runs,
    so the boats will still appear even if
    the API has an error.
*/

displayBoats(boats);


/* =====================================================
   WEATHER ELEMENTS
===================================================== */

const locationInput =
    document.getElementById("location-input");

const locationButton =
    document.getElementById("location-button");

const weatherStatus =
    document.getElementById("weather-status");

const weatherLocation =
    document.getElementById("weather-location");


/* =====================================================
   WIND DIRECTION
===================================================== */

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

    const index =
        Math.round(degrees / 45) % 8;

    return directions[index];
}


/* =====================================================
   WEATHER DESCRIPTION
===================================================== */

function getWeatherDescription(code) {

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

    return descriptions[code] || "Unknown";
}


/* =====================================================
   GET WEATHER FOR ANY LOCATION
===================================================== */

async function getWeatherForLocation(location) {

    weatherStatus.textContent =
        "Finding location...";


    try {

        /*
            STEP 1:
            Use Open-Meteo's geocoding API
            to find the latitude and longitude.
        */

        const geocodingURL =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" +
            encodeURIComponent(location) +
            "&count=1" +
            "&language=en" +
            "&format=json";


        const geocodingResponse =
            await fetch(geocodingURL);


        if (!geocodingResponse.ok) {

            throw new Error(
                "Location search failed."
            );

        }


        const geocodingData =
            await geocodingResponse.json();


        /*
            Make sure the API found something.
        */

        if (
            !geocodingData.results ||
            geocodingData.results.length === 0
        ) {

            throw new Error(
                "Location not found."
            );

        }


        /*
            Get the first matching location.
        */

        const place =
            geocodingData.results[0];


        const latitude =
            place.latitude;

        const longitude =
            place.longitude;


        /*
            STEP 2:
            Use those coordinates with the
            Open-Meteo weather API.
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
            await fetch(weatherURL);


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
           UPDATE THE WEATHER CARDS
        ================================================= */


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


        /*
            Display the location the user searched.
        */

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
   CHECK CONDITIONS BUTTON
===================================================== */

locationButton.addEventListener(
    "click",
    function() {

        const location =
            locationInput.value.trim();


        if (location === "") {

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
   PRESS ENTER TO SEARCH
===================================================== */

locationInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            const location =
                locationInput.value.trim();


            if (location === "") {

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
   LOAD MIAMI WHEN THE PAGE OPENS
===================================================== */

getWeatherForLocation("Miami");