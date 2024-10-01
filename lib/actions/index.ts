"use server"

import {revalidatePath} from "next/cache";
import {scrapeDiscountedItems} from "../scraper";
import {connectToDatabase} from "../mongoose";
import Product from "@/lib/models/product.model";
import {getHighestPrice, getLowestPrice, getAveragePrice} from "@/lib/utils";

const dummyStoreUrl = "https://www.lidl.es/es/ofertas-semanales-alimentacion/c3327";

export async function scrapeAndStoreProduct(storeUrl: string) {
    try {
        await connectToDatabase();

        const scrapedProducts = await scrapeDiscountedItems(dummyStoreUrl);

        console.log(scrapedProducts);

        if (!scrapedProducts) return;

        for (let scrapedProduct of scrapedProducts) {
            const existingProduct = await Product.findOne({url: scrapedProduct.url});

            if (existingProduct) {
                const updatePriceHistory: any = [
                    ...existingProduct.priceHistory,
                    {price: scrapedProduct.discountedPrice}
                ]
                scrapedProduct = {
                    ...scrapedProduct,
                    priceHistory: updatePriceHistory,
                    highestPrice: getHighestPrice(updatePriceHistory),
                    averagePrice: getAveragePrice(updatePriceHistory),
                    lowestPrice: getLowestPrice(updatePriceHistory),
                    pricePerUnit: scrapedProduct.pricePerUnit || existingProduct.pricePerUnit,
                }
            }

            const newProduct = await Product.findOneAndUpdate(
                {url: scrapedProduct.url},
                scrapedProduct,
                { upsert: true, new: true }
            )

            revalidatePath(`/products/${newProduct._id}`);
        }
    } catch (error: any) {
        throw new Error(`Error scraping product page: ${error.message}`);
    }
}

export async function getProductById(productId: string) {
    try {
        await connectToDatabase();

        const product = await Product.findOne({_id: productId});

        if(!product) return null;

        return product;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllProducts(){
    try {
        connectToDatabase()

        const products = await Product.find();

        return products;
    } catch (error) {
        console.log(error)
    }
}

export async function getSimilarProducts(productId: string) {
    try {
        connectToDatabase()

        const currentProduct = await Product.findById(productId);

        if (!currentProduct) return null;

        const similarProducts = await Product.find({
            _id: { $ne: productId },
        }).limit(3);

        return similarProducts;
    } catch (error) {
        console.log(error)
    }
}