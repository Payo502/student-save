import { PriceHistoryItem, Product } from "@/types";
import * as cheerio from "cheerio";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/lib/utils";

export function extractLidlProductDetails(html: string): Product[] {
    const $ = cheerio.load(html);
    const products: Product[] = [];
    const storeUrl = 'https://www.lidl.es/es/';
    const imageBaseUrl = 'https://www.lidl.es';
    const currentDate = new Date().toISOString();

    $('.plp-product-grid-box-tile__wrapper').each((_, element) => {
        const href = $(element).find('a').attr('href');
        const url = href ? storeUrl + href : '';
        const title = $(element).find('.plp-product-grid-box-tile__title strong').text().trim();
        const extractedImage = $(element).find('img').attr('data-original') || '';
        const image = extractedImage ? imageBaseUrl + extractedImage : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'; // fallback image

        const originalPriceText = $(element).find('.price-pill__oldprice').text().trim();
        const originalPrice = originalPriceText ? parseFloat(originalPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')) : NaN;

        const discountedPriceText = $(element).find('.price-pill__price').text().trim();
        const discountedPrice = discountedPriceText ? parseFloat(discountedPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')) : NaN;

        const pricePerUnitText = $(element).find('.baseprice').text().trim() || null;

        const finalOriginalPrice = isNaN(originalPrice) ? 0 : originalPrice;
        const finalDiscountedPrice = isNaN(discountedPrice) ? 0 : discountedPrice;

        if (title && (finalOriginalPrice !== 0 || finalDiscountedPrice !== 0)) {
            const mainPrice = finalOriginalPrice || finalDiscountedPrice;

            const priceHistory: PriceHistoryItem[] = [
                {
                    discountPrice: finalDiscountedPrice,
                    mainPrice: mainPrice,
                    date: currentDate,
                }
            ];

            console.log("Price History:", priceHistory);

            if (priceHistory[0].discountPrice === null || priceHistory[0].discountPrice === undefined) {
                console.error(`Error: Missing discounted price for product "${title}"`);
            }

            products.push({
                url,
                title,
                image,
                originalPrice: finalOriginalPrice.toString(),
                discountedPrice: finalDiscountedPrice.toString(),
                pricePerUnit: pricePerUnitText,
                priceHistory,
                highestPrice: getHighestPrice(priceHistory),
                lowestPrice: getLowestPrice(priceHistory),
                averagePrice: getAveragePrice(priceHistory),
            });
        } else {
            console.warn(`Skipping product "${title}" due to missing price.`);
        }
    });

    return products;
}
