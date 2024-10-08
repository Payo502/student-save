"use client"

import {FormEvent, useState} from "react"
import {getProductById, getProductByTitle, scrapeAndStoreProducts} from "@/lib/actions";
import {useRouter, useSearchParams} from "next/navigation";
import {searchParamsToUrlQuery} from "next/dist/shared/lib/router/utils/querystring";

function Searchbar() {
    const [productName, setProductName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!productName.trim()) return alert("Please enter a valid product name");

        try {
            setIsLoading(true)

            const currentDealsPage = searchParams.get("dealsPage") || "1";

            const queryParams = new URLSearchParams({
                query: encodeURIComponent(productName),
                dealsPage: currentDealsPage,
                searchPage: "1"
            });

            router.push(`/?${queryParams.toString()}`);


        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
            <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter a product"
                className="searchbar-input"/>

            <button type="submit"
                    className="searchbar-btn"
                    disabled={productName === ""}>
                {isLoading ? "Loading..." : "Enter"}
            </button>
                {/*{<button
                    type="button"
                    className="dev-button"
                    onClick={async () => {
                        try {
                            setIsLoading(true)
                            await scrapeAndStoreProducts();
                            alert('Scraping completed!')
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setIsLoading(false)
                        }
                    }}
                >
                    {isLoading ? "Scraping..." : "Scrape Websites"}
                </button>}*/}
        </form>


    )
}

export default Searchbar
