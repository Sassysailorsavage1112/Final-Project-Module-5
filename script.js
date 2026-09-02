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


// Find the HTML elements we need
const boatContainer = document.getElementById("boat-container");
const sortSelect = document.getElementById("sort");


// Display the boats
function displayBoats(boatList) {

    boatContainer.innerHTML = "";

    boatList.forEach(function(boat) {

        const boatCard = document.createElement("div");

        boatCard.classList.add("boat-card");

        boatCard.innerHTML = `
            <img 
                src="${boat.image}" 
                alt="${boat.name}" 
                class="boat-image"
            >

            <div class="boat-info">

                <h3>${boat.name}</h3>

                <p><strong>Type:</strong> ${boat.type}</p>

                <p><strong>Length:</strong> ${boat.length} ft</p>

                <p class="price">
                    $${boat.price.toLocaleString()}
                </p>

            </div>
        `;

        boatContainer.appendChild(boatCard);
    });
}


// Sort the boats when the dropdown changes
sortSelect.addEventListener("change", function() {

    const sortValue = sortSelect.value;

    let sortedBoats = [...boats];

    if (sortValue === "price-low") {

        sortedBoats.sort(function(a, b) {
            return a.price - b.price;
        });

    } else if (sortValue === "price-high") {

        sortedBoats.sort(function(a, b) {
            return b.price - a.price;
        });

    } else if (sortValue === "length-short") {

        sortedBoats.sort(function(a, b) {
            return a.length - b.length;
        });

    } else if (sortValue === "length-long") {

        sortedBoats.sort(function(a, b) {
            return b.length - a.length;
        });

    } else if (sortValue === "name") {

        sortedBoats.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });

    }

    displayBoats(sortedBoats);

});


// Show the boats when the page first loads
displayBoats(boats);