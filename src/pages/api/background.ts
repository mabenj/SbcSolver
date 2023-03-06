import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Log.info("Starting price update");
        for (let i = 0; i < 15; i++) {
            console.log("loop " + i);
            // await sleep(2000);
        }
        // const updateService = new PriceUpdateService();
        // await updateService.updateRatingPrices();
        res.status(204).send("moi");
        // Log.info("Success");
    } catch (error) {
        // Log.error(`Error updating rating prices: $${getErrorMessage(error)}`);
        res.status(500).send("error");
    }
};

export default handler;

export const config = {
    type: "experimental-scheduled",
    schedule: "* * * * *"
};
