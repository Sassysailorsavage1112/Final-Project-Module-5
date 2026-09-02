export default async function handler(req, res) {
    const sort = req.query.sort || "";

    let url =
        "https://boatlisting.com.au/api/v1/boats" +
        "?category=Sail" +
        "&limit=12";

    if (sort) {
        url += "&sort=" + encodeURIComponent(sort);
    }

    try {
        const response = await fetch(url);

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