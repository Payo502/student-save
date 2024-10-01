"use client"

import {FormEvent, useState} from "react"
import {scrapeAndStoreProduct} from "@/lib/actions";

function Searchbar() {
    const [productName, setProductName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!productName.trim()) return alert("Please enter a valid product name");

        try {
            setIsLoading(true)

            // Fetch data from the API
            const product = await scrapeAndStoreProduct(productName)

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
        </form>
    )
}

export default Searchbar
