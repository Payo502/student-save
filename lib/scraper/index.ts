import axios from 'axios';
import * as cheerio from 'cheerio';
import {extractLidlProductDetails} from "@/lib/scraper/scrapersLogic/LidlScraper";
import {extractConsumProductDetails} from "@/lib/scraper/scrapersLogic/ConsumScraper";
import type {Product} from "@/types";


function setupBrightSpaceConnection() {
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

    return options;
}

const options = setupBrightSpaceConnection()

export async function scrapeDiscountedItemsLidl(storeUrl: string) {
    if (!storeUrl) return

    try {
        const response = await axios.get(storeUrl, options);
        const $ = cheerio.load(response.data);

        return extractLidlProductDetails(response.data);

    } catch (error: any) {
        throw new Error(`Error scraping product: ${error.message}`);
    }
}

export async function scrapeDiscountedItemsConsum(storeUrl: string) {
    const allProducts: Product[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const itemsPerPage = 20;
    let offset = 0;
    const limit = 100;

    while (hasMorePages && currentPage <= limit) {
        try {
            const url = new URL(storeUrl);

            url.searchParams.set('page', currentPage.toString());
            url.searchParams.set('limit', itemsPerPage.toString());
            url.searchParams.set('offset', ((currentPage - 1) * itemsPerPage).toString());

            const urlWithPagination = url.toString();

            const response = await axios.get(urlWithPagination);
            const { products } = response.data;

            if (!Array.isArray(products) || products.length === 0) {
                hasMorePages = false;
                console.log(`No more products found on page ${currentPage}. Stopping.`);
                break;
            }

            const productsDetails = extractConsumProductDetails(products);
            allProducts.push(...productsDetails);

            currentPage += 1;
            offset += itemsPerPage;

        } catch (error: any) {
            hasMorePages = false;
            console.error(`Error scraping page ${currentPage}: ${error.message}`);
            throw new Error(`Error scraping product: ${error.message}`);
        }
    }

    return allProducts;
}

