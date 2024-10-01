import axios from 'axios';
import * as cheerio from 'cheerio';
import {extractProductDetails} from "@/lib/utils";


export async function scrapeDiscountedItems(storeUrl: string) {
    if (!storeUrl) return

    // BrightData proxy configuration
    const userName = String(process.env.BRIGHTDATA_USERNAME);
    const password = String(process.env.BRIGHTDATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${userName}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {
        // Fetch the store page
        const response = await axios.get(storeUrl, options);
        const $ = cheerio.load(response.data);

        // Extract product details
        return extractProductDetails(response.data);

    } catch (error: any) {
        throw new Error(`Error scraping product: ${error.message}`);
    }
}