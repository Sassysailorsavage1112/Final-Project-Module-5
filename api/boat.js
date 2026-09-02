export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://boatlisting.com.au/api/v1/boats?category=Sail&limit=12"
        );

        if (!response.ok) {
            throw new Error(`BoatListing returned ${response.status}`);
        }

        const data = await response.json();

        res.status(200).json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Boat API failed",
            message: error.message
        });
    }
}