export default {
    async fetch(request) {

        try {

            const incomingURL = new URL(request.url);

            const apiURL = new URL(
                "https://boatlisting.com.au/api/v1/boats"
            );

            // Send the parameters from your website
            // to the real BoatListing API.

            incomingURL.searchParams.forEach((value, key) => {
                apiURL.searchParams.set(key, value);
            });


            // Default to sailboats if no category
            // was provided.

            if (!apiURL.searchParams.has("category")) {
                apiURL.searchParams.set("category", "Sail");
            }


            // Default to 12 boats.

            if (!apiURL.searchParams.has("limit")) {
                apiURL.searchParams.set("limit", "12");
            }


            const response = await fetch(
                apiURL.toString()
            );


            const data = await response.json();


            return new Response(
                JSON.stringify(data),
                {
                    status: response.status,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


        } catch (error) {

            return new Response(
                JSON.stringify({
                    error: "Could not connect to BoatListing",
                    message: error.message
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }

    }
};