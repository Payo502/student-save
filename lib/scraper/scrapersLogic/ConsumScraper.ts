import {PriceHistoryItem, Product} from "@/types";
import * as cheerio from "cheerio";
import {getAveragePrice, getHighestPrice, getLowestPrice} from "@/lib/utils";

export function extractConsumProductDetails(products: any[]): Product[] {
    const currentDate = new Date().toISOString();
    const extractedProducts: Product[] = [];

    if (!Array.isArray(products)) {
        throw new Error('Products data is not an array');
    }

    products.forEach((product: any) => {
        const {productData, media, priceData, offers} = product;

        const noImageAvailable = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

        const url = productData?.url || 'No URL available';
        const title = productData?.name || 'Unknown';
        const image = media?.length > 0 ? media[0]?.url : noImageAvailable;
        const originalPrice = priceData?.prices?.find((price: any) => price.id === "PRICE")?.value?.centAmount || 0;
        const discountedPrice = offers?.[0]?.amount || 0;
        const pricePerUnit = null;


        if (title && discountedPrice) {
            const mainPrice = originalPrice || discountedPrice;

            const priceHistory: PriceHistoryItem[] = [
                {
                    discountPrice: discountedPrice,
                    mainPrice: mainPrice,
                    date: currentDate,
                }
            ];

            extractedProducts.push({
                url,
                title,
                image: image,
                originalPrice: originalPrice.toString() || null,
                discountedPrice: discountedPrice.toString() || null,
                pricePerUnit,
                priceHistory,
                highestPrice: getHighestPrice(priceHistory),
                lowestPrice: getLowestPrice(priceHistory),
                averagePrice: getAveragePrice(priceHistory),
            });
        }

    });

    return extractedProducts;
}
