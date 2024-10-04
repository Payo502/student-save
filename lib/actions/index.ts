"use server"

import {revalidatePath} from "next/cache";
import {scrapeDiscountedItemsLidl, scrapeDiscountedItemsConsum} from "../scraper";
import {connectToDatabase} from "../mongoose";
import Product from "@/lib/models/product.model";
import {getHighestPrice, getLowestPrice, getAveragePrice} from "@/lib/utils";
import {storeUrls} from "@/lib/scrapperURL'S";

export async function scrapeAndStoreProducts() {
    try {
        await connectToDatabase();

        const currentTimeStamp = new Date();

        const lidlScrapedProducts = await scrapeDiscountedItemsLidl(storeUrls.lidl);
        const consumScrapedProducts = await scrapeDiscountedItemsConsum(storeUrls.consum);

        const scrapedProducts = [...lidlScrapedProducts || [], ...consumScrapedProducts || []];

        if (!scrapedProducts) return;

        const scrapedUrls = scrapedProducts.map((product) => product.url);

        for (let scrapedProduct of scrapedProducts) {
            if (!scrapedProduct.url || !scrapedProduct.discountedPrice || !scrapedProduct.title) {
                console.log("Skipping product due to missing data", scrapedProduct);
                continue;
            }

            let existingProduct = await Product.findOne({url: scrapedProduct.url});

            if (existingProduct) {

                console.log(`Product already exists in database: ${scrapedProduct.title}. Updating price history.`);

                const updatePriceHistory: any = [
                    ...existingProduct.priceHistory,
                    {price: scrapedProduct?.discountedPrice}
                ]
                scrapedProduct = {
                    ...scrapedProduct,
                    priceHistory: updatePriceHistory,
                    highestPrice: getHighestPrice(updatePriceHistory),
                    averagePrice: getAveragePrice(updatePriceHistory),
                    lowestPrice: getLowestPrice(updatePriceHistory),
                    pricePerUnit: scrapedProduct.pricePerUnit || existingProduct.pricePerUnit,
                }

                existingProduct = await Product.findOneAndUpdate(
                    {url: scrapedProduct.url},
                    {...scrapedProduct, lastScraped: currentTimeStamp, available: true},
                    {upsert: true, new: true}
                )
            } else {
                const newProduct = await Product.create({
                    ...scrapedProduct,
                    lastScraped: currentTimeStamp,
                    available: true,
                });

                revalidatePath(`/products/${newProduct._id}`);

            }
        }

        await Product.updateMany(
            {url: {$nin: scrapedUrls}},
            {available: false},
        )

    } catch
        (error: any) {
        throw new Error(`Error scraping product page: ${error.message}`);
    }
}

export async function getProductById(productId: string) {
    try {
        await connectToDatabase();

        const product = await Product.findOne({_id: productId});

        if (!product) return null;

        return product;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllProducts() {
    try {
        await connectToDatabase()

        const products = await Product.find({available: true});

        return products;
    } catch (error) {
        console.log(error)
    }
}

export async function getSimilarProducts(productId: string) {
    try {
        await connectToDatabase()

        const currentProduct = await Product.findById(productId);

        if (!currentProduct || !currentProduct.available) return null;

        const similarProducts = await Product.find({
            _id: {$ne: productId},
            available: true,
        }).limit(3);

        return similarProducts;
    } catch (error) {
        console.log(error)
    }
}

export async function getProductByTitle(title: string) {
    try {
        await connectToDatabase();

        const products = await Product.find({
            title: {$regex: title, $options: "i"},
            available: true,
        });

        if (!products) return null;

        return products;
    } catch (error: any) {
        console.log(error)
        throw new Error(`Error scraping product page: ${error.message}`);
    }
}