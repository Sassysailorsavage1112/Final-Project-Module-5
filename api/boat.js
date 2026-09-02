export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://boatlisting.com.au/api/v1/boats?category=Sail&limit=12",
            {
                headers: {
                    "User-Agent": "Bluewater-Yachts-School-Project"
                }
            }
        );

        const text = await response.text();

        console.log("BoatListing status:", response.status);
        console.log("BoatListing response:", text);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "BoatListing API error",
                status: response.status,
                details: text
            });
        }

        const data = JSON.parse(text);

        return res.status(200).json(data);

    } catch (error) {

        console.error("Server error:", error);

        return res.status(500).json({
            error: "Vercel could not connect to BoatListing",
            details: error.message
        });
    }
}