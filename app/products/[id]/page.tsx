import {getProductById, getSimilarProducts} from "@/lib/actions";
import {redirect} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {Product} from "@/types";
import {formatNumber} from "@/lib/utils";
import ProductCard from "@/app/components/ProductCard";

type Props = {
    params: {
        id: string;
    }
}


const ProductDetails = async ({params: {id}}: Props) => {
    const product: Product = await getProductById(id);

    if (!product) redirect('/');

    const similarProducts = await getSimilarProducts(id);

    return (
        <div className="product-container">
            <div className="flex gap-28 xl:flex-row flex-col">
                <div className="product-image">
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={580}
                        height={400}
                        className="mx-auto"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] text-secondary font-semibold">
                                {product.title}
                            </p>
                        </div>
                        <Link href={product.url}
                              target="_blank"
                              className="text-base text-black opacity-50 underline"
                        >
                            Visit Product Page
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="product-hearts">
                            <Image
                                src="/assets/icons/red-heart.svg"
                                alt="heart"
                                width={20}
                                height={20}
                            />

                            <p className="text-base font-semibold text-[#D46F77]">
                            </p>
                        </div>
                        <div className="p-2 bg-white-200 rounded-10">
                            <Image
                                src="/assets/icons/bookmark.svg"
                                alt="bookmark"
                                width={20}
                                height={20}
                            />
                        </div>
                        <div className="p-2 bg-white-200 rounded-10">
                            <Image
                                src="/assets/icons/share.svg"
                                alt="share"
                                width={20}
                                height={20}
                            />
                        </div>
                    </div>

                    <div className="product-info">
                        <div className="flex flex-col gap-2">
                            <p className="text-[34] text-secondary font-bold">
                                €{product.discountedPrice}
                            </p>
                            <p className="text-[21] text-black opacity-50 line-through">
                                €{product.originalPrice}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-16">
                <button className="btn w-fit mx-auto flex items-center
                justify-center gap-3 min-w-[200px]">
                    <Image src="/assets/icons/bag.svg" alt="check" width={22} height={22}/>
                    <Link href="/" className="text-base text-white"/>
                    Buy Now
                </button>
            </div>
            {similarProducts && similarProducts?.length > 0 && (
                <div className="py-14 flex flex-col gap-2 w-full">
                    <p className="section-text">Similar Products</p>

                    <div className="flex flex-wrap gap-10 mt-7 w-full">
                        {similarProducts.map((product) => (
                        <ProductCard key={product._id} product={product}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails
