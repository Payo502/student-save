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
                            ¡Empieza a ahorrar hoy! Nunca te pierdas las mejores ofertas de supermercados cerca de ti.
                            <Image
                                src="/assets/icons/arrow-right.svg"
                                alt="arrow-right"
                                width={16}
                                height={16}
                            />
                        </p>

                        <h1 className="head-text">
                            ¿Por qué pagar el precio completo? deja que <span className="text-primary">StudentSave</span> te ayude a encontrar las mejores ofertas
                            en un solo lugar.
                        </h1>
                        <p className="mt-6">
                            Ahorra más, gasta menos. ¡Descubre las mejores ofertas para estudiantes, actualizadas a diario!
                        </p>
                        <Searchbar/>
                    </div>
                </div>
            </section>


            {searchQuery && (
                <section className="search-section">
                    <h2 className="section-text">Resultados para  "{searchQuery}"</h2>
                    <div className="flex flex-wrap gap-x-8 gap-y-16">
                        {searchResults && searchResults.length > 0 ? (
                            searchResults?.map((product) => (
                                <ProductCard key={product._id} product={product}/>
                            ))
                        ) : (
                            <p className="text-gray-500">No hay resultados para "{searchQuery}"</p>
                        )}
                    </div>
                    <div className="flex justify-center my-5">
                        <PaginationUI currentPage={searchPage} totalPages={totalSearchPages} isSearchPagination={true}/>
                    </div>

                </section>
            )}

            <section className="trending-section">
                <h2 className="section-text">
                    Todas las promociones
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
