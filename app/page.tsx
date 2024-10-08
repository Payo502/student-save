import Image from "next/image";
import Searchbar from "@/app/components/Searchbar";
import {getAllProducts, getProductByTitle} from "@/lib/actions";
import ProductCard from "@/app/components/ProductCard";
import PaginationUI from "@/app/components/PaginationUI";
import Product from "@/lib/models/product.model";


const Home = async ({searchParams}: any) => {
    const searchQuery = searchParams.query || "";
    const searchPage = Number(searchParams.searchPage) || 1;
    const dealsPage = Number(searchParams.dealsPage) || 1;
    const dealsLimit = 20;
    const searchLimit = 8;

    const allProducts = await getAllProducts(dealsPage, dealsLimit);
    const totalDealsCount = await Product.countDocuments({available: true});
    const totalDealsPages = Math.ceil(totalDealsCount/dealsLimit);

    const searchResults = searchQuery ? await getProductByTitle(searchQuery, searchPage, searchLimit) : [];
    const totalSearchCount = searchQuery ? await Product.countDocuments({
        title: {$regex: searchQuery, $options: "i"},
        available: true
    }) : 0;
    const totalSearchPages = Math.ceil(totalSearchCount/searchLimit);

    return (
        <>
            <section className="px-6 md:px-20 py-24">
                <div className="flex max-xl:flex-col gap-16">
                    <div className="flex flex-col justify-center">
                        <p className="small-text">
                            Start saving today! Sign up for free and never miss out on the best grocery deals near you.
                            <Image
                                src="/assets/icons/arrow-right.svg"
                                alt="arrow-right"
                                width={16}
                                height={16}
                            />
                        </p>

                        <h1 className="head-text">
                            Why pay full price? Let <span className="text-primary">StudentSave</span> help you find the
                            best grocery deals, all in one app.
                        </h1>
                        <p className="mt-6">
                            Save more, spend less. Discover the best grocery deals for students, updated daily!
                        </p>
                        <Searchbar/>
                    </div>
                </div>
            </section>


            {searchQuery && (
                <section className="search-section">
                    <h2 className="section-text">Search Results for "{searchQuery}"</h2>
                    <div className="flex flex-wrap gap-x-8 gap-y-16">
                        {searchResults && searchResults.length > 0 ? (
                            searchResults?.map((product) => (
                                <ProductCard key={product._id} product={product}/>
                            ))
                        ) : (
                            <p className="text-gray-500">No results for "{searchQuery}"</p>
                        )}
                    </div>
                    <div className="flex justify-center my-5">
                        <PaginationUI currentPage={searchPage} totalPages={totalSearchPages} isSearchPagination={true}/>
                    </div>

                </section>
            )}

            <section className="trending-section">
                <h2 className="section-text">
                    All Deals
                </h2>
                <div className="flex flex-wrap gap-x-8 gap-y-16">
                    {allProducts?.map((product) => (
                        <ProductCard key={product._id} product={product}/>
                    ))}
                </div>

                <div className="flex justify-center my-5">
                    <PaginationUI totalPages={totalDealsPages} currentPage={dealsPage}/>
                </div>
            </section>
        </>
    )
}

export default Home
