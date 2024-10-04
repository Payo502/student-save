"use client"

import {FormEvent, useState} from "react"
import {getProductById, getProductByTitle, scrapeAndStoreProducts} from "@/lib/actions";
import {useRouter} from "next/navigation";

function Searchbar() {
    const [productName, setProductName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!productName.trim()) return alert("Please enter a valid product name");

        try {
            setIsLoading(true)

            router.push(`/?query=${encodeURIComponent(productName)}`);


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
                {/*<button
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
                </button>*/}
        </form>


    )
}

export default Searchbar
