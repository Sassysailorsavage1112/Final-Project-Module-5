export default async function handler(request) {

    try {

        const apiURL =
            "https://boatlisting.com.au/api/v1/boats?category=Sail&limit=12";

        const response = await fetch(apiURL);

        const data = await response.json();

        return new Response(
            JSON.stringify(data),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "s-maxage=300"
                }
            }
        );

    } catch (error) {

        console.error("Boat API Error:", error);

        return new Response(
            JSON.stringify({
                error: "BoatListing API connection failed",
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