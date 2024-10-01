import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeDiscountedItems } from "@/lib/scraper";
import { NextResponse } from "next/server";

export const maxDuration = 60 * 60 * 24; // 24 hours
export const dynamic = "force-dynamic";
export const revalidate = 0;

const storeUrl = 'https://www.lidl.es/es/ofertas-semanales-alimentacion/c3327'; // Store URL to scrape

export async function GET(request: Request) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Scrape the store URL for products
        const scrapedProducts = await scrapeDiscountedItems(storeUrl);

        if (!scrapedProducts || scrapedProducts.length === 0) {
            throw new Error('No products scraped from the store');
        }

        // Update the scraped products in the database
        const updatedProducts = await Promise.all(
            scrapedProducts.map(async (scrapedProduct) => {
                const productUpdate = {
                    ...scrapedProduct,
                    updatedAt: new Date(), // Update the timestamp for the product
                };

                // Update existing product or insert a new one (upsert)
                const updatedProduct = await Product.findOneAndUpdate(
                    { url: scrapedProduct.url },
                    productUpdate,
                    { upsert: true, new: true }
                );

                return updatedProduct;
            })
        );

        return NextResponse.json({
            message: "Scraping successful",
            data: updatedProducts,
        });
    } catch (error: any) {
        console.error(`Error scraping store: ${error.message}`);
        return NextResponse.json({
            message: "Error scraping store",
            error: error.message,
        });
    }
}
