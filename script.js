// Our boat data
const boats = [
    {
        name: "Ocean Breeze 42",
        price: 450000,
        length: 42,
        type: "Catamaran",
        image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a"
    },
    {
        name: "Blue Horizon 50",
        price: 725000,
        length: 50,
        type: "Catamaran",
        image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8"
    },
    {
        name: "Sea Voyager 38",
        price: 325000,
        length: 38,
        type: "Sailboat",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
    },
    {
        name: "Atlantic Explorer 55",
        price: 950000,
        length: 55,
        type: "Sailboat",
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7"
    },
    {
        name: "Coral Dream 46",
        price: 575000,
        length: 46,
        type: "Catamaran",
        image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f"
    },
    {
        name: "Pacific Star 60",
        price: 1200000,
        length: 60,
        type: "Sailboat",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
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