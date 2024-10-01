import * as cheerio from 'cheerio';
import { PriceHistoryItem, Product } from "@/types";

export function extractProductDetails(html: string): Product[] {
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
        const image = extractedImage ? imageBaseUrl + extractedImage : '';
        const originalPrice = $(element).find('.price-pill__oldprice').text().trim() || null;
        const discountedPriceText = $(element).find('.price-pill__price').text().trim();
        const pricePerUnitText = $(element).find('.baseprice').text().trim() || null;

        const discountedPrice = discountedPriceText ? parseFloat(discountedPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')) : null;

        if (title && discountedPrice) {
            const mainPrice = originalPrice || discountedPrice;

            const priceHistory: PriceHistoryItem[] = [
                {
                    discountPrice: discountedPrice,
                    mainPrice: mainPrice,
                    date: currentDate,
                }
            ];

            products.push({
                url,
                title,
                image,
                originalPrice,
                discountedPrice : discountedPriceText,
                pricePerUnit: pricePerUnitText,
                priceHistory,
                highestPrice: getHighestPrice(priceHistory),
                lowestPrice: getLowestPrice(priceHistory),
                averagePrice: getAveragePrice(priceHistory),
            });
        }
    });

    return products;
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    const validPrices = priceList
        .map((item) => item.mainPrice)
        .filter(price => typeof price === 'number' && !isNaN(price));

    if (validPrices.length === 0) return 0;

    return Math.max(...validPrices);
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
    const validPrices = priceList
        .map((item) => item.mainPrice)
        .filter(price => typeof price === 'number' && !isNaN(price));

    if (validPrices.length === 0) return 0;

    return Math.min(...validPrices);
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const validPrices = priceList
        .map((item) => item.mainPrice)
        .filter(price => typeof price === 'number' && !isNaN(price));

    if (validPrices.length === 0) return 0;

    const total = validPrices.reduce((sum, price) => sum + price, 0);
    return total / validPrices.length;
}

export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};
