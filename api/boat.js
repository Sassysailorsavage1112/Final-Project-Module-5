export default async function handler(req, res) {
    try {
        const sort = req.query.sort || "default";

        const apiURL = new URL(
            "https://boatlisting.com.au/api/v1/boats"
        );

        // We specifically want real sailboat listings
        apiURL.searchParams.set("category", "Sail");

        // Number of boats to retrieve
        apiURL.searchParams.set("limit", "12");

        // Send sorting request to the real boating API
        if (sort === "price-low") {
            apiURL.searchParams.set("sort", "price_asc");
        }

        else if (sort === "price-high") {
            apiURL.searchParams.set("sort", "price_desc");
        }

        else if (sort === "length-short") {
            apiURL.searchParams.set("sort", "length_asc");
        }

        else if (sort === "length-long") {
            apiURL.searchParams.set("sort", "length_desc");
        }

        console.log(
            "Requesting BoatListing API:",
            apiURL.toString()
        );

        const response = await fetch(
            apiURL.toString()
        );

        if (!response.ok) {
            throw new Error(
                `BoatListing API returned ${response.status}`
            );
        }

        const data = await response.json();

        // Send the real API data back to our website
        res.status(200).json(data);

    }

    catch (error) {

        console.error(
            "Boat API Error:",
            error
        );

        res.status(500).json({
            error: "Unable to reach the BoatListing API.",
            message: error.message
        });
    }
}