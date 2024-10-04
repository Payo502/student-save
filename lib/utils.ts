import * as cheerio from 'cheerio';
import { PriceHistoryItem, Product } from "@/types";

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
