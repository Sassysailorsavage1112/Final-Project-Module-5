export default {
    async fetch(request) {

        try {

            const response = await fetch(
                "https://boatlisting.com.au/api/v1/boats?category=Sail&limit=12"
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