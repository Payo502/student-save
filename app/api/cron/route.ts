import {connectToDatabase} from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import {scrapeDiscountedItems} from "@/lib/scraper";
import {NextResponse} from "next/server";

export const maxDuration = 60 * 60 * 24; // 24 hours
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request : Request) {
    try{
        connectToDatabase()
        const products = await Product.find({})

        if(!products) throw new Error('No products found')

        // Scrape latest products from the store
        const updatedProducts = await Promise.all(
            products.map(async(currentProduct) => {
                const scrapedProduct = await scrapeDiscountedItems(currentProduct.url)

                if(!scrapedProduct) return;

                const product = {
                    ...scrapedProduct,
                }


                // Update the product in the database
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        url: product.url,
                    },
                    product
                )

                return updatedProduct
            })
        )
        return NextResponse.json({
            message: "OK", data: updatedProducts
        })
    } catch (error: any) {
        throw new Error(`Error scraping product page: ${error.message}`);
    }
}