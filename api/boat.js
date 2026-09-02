export default async function handler(req, res) {

    try {

        const sort =
            req.query.sort || "default";


        const apiURL =
            new URL(
                "https://boatlisting.com.au/api/v1/boats"
            );


        /*
            REAL BOATLISTING API

            We are intentionally NOT filtering
            by Sail because the live API currently
            has Power listings available.
        */

        apiURL.searchParams.set(
            "limit",
            "12"
        );


        /*
            API CONNECTED SORTING
        */

        if (
            sort === "price-low"
        ) {

            apiURL.searchParams.set(
                "sort",
                "price_asc"
            );

        }


        else if (
            sort === "price-high"
        ) {

            apiURL.searchParams.set(
                "sort",
                "price_desc"
            );

        }


        else if (
            sort === "length-short"
        ) {

            apiURL.searchParams.set(
                "sort",
                "length_asc"
            );

        }


        else if (
            sort === "length-long"
        ) {

            apiURL.searchParams.set(
                "sort",
                "length_desc"
            );

        }


        console.log(
            "BoatListing API:",
            apiURL.toString()
        );


        /*
            CONTACT THE REAL BOATING API
        */

        const response =
            await fetch(
                apiURL.toString()
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "BoatListing API returned HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        /*
            Send the real API response
            back to our website.
        */

        return res.status(200).json(
            data
        );

    }


    catch (error) {

        console.error(
            "BoatListing API Error:",
            error
        );


        return res.status(500).json({

            error:
                "Unable to reach BoatListing API.",

            message:
                error.message

        });

    }

}