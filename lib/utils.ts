import * as cheerio from 'cheerio';
import { PriceHistoryItem, Product } from "@/types";

export function extractProductDetails(html: string): Product[] {
    const $ = cheerio.load(html);
    const products: Product[] = [];
    const storeUrl = 'https://www.lidl.es/es/';
    const currentDate = new Date().toISOString();

    $('.plp-product-grid-box-tile__wrapper').each((_, element) => {
        const href = $(element).find('a').attr('href');
        const url = href ? storeUrl + href : '';
        const title = $(element).find('.plp-product-grid-box-tile__title strong').text().trim();
        const image = $(element).find('img').attr('data-original') || '';
        const originalPrice = $(element).find('.price-pill__oldprice').text().trim() || null;
        const discountedPriceText = $(element).find('.price-pill__price').text().trim();
        const pricePerUnit = $(element).find('.baseprice').text().trim() || null;

        const discountedPrice = discountedPriceText ? parseFloat(discountedPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')) : null;

        if (title && discountedPrice) {
            const priceHistory: PriceHistoryItem[] = [
                {
                    price: discountedPrice,
                    date: currentDate,
                }
            ];

            products.push({
                url,
                title,
                image,
                originalPrice,
                discountedPrice : discountedPriceText,
                pricePerUnit,
                priceHistory,
            });
        }
    });

    return products;
}

const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    return Math.max(...priceList.map((item) => item.price));
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
    return Math.min(...priceList.map((item) => item.price));
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const total = priceList.reduce((sum, item) => sum + item.price, 0);
    return total / priceList.length;
}

export const getEmailNotifType = (
    scrapedProduct: Product,
    currentProduct: Product
) => {
    const lowestPrice = getLowestPrice(currentProduct.priceHistory);

    if (scrapedProduct.priceHistory[0].price < lowestPrice) {
        return Notification.LOWEST_PRICE as keyof typeof Notification;
    }
    return null;
};

export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};
