import {Product} from "@/types";
import Link from "next/link";
import Image from "next/image";
import PriceInfoCard from "@/app/components/PriceInfoCard";

interface Props {
    product: Product
}

function ProductCard({product}: Props) {
    return (
        <Link href={`/products/${product._id}`} className="product-card">
            <div className="product-card_img-container">
                <Image
                    src={product.image}
                    alt={product.title}
                    width={200}
                    height={200}
                    className="product-card_img"
                />
            </div>
            <div className="position: absolute
                            bottom: 10px
                            right: 10px
                            background: white
                            border-radius: 50%
                            padding: 5px">
                <Image src={product.image} alt={product.title} width={80} height={80}/>
            </div>
            <div className="flex flex-col gap-2 p-4">
                <h3 className="product-title">{product.title}</h3>
                <div className="flex justify-between items-center">
                    <p className="text-black opacity-50 text-sm capitalize line-through">
                        {product.originalPrice} €
                    </p>
                    <p className="text-black text-lg font-semibold">
                        {product.discountedPrice} €
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="product-stars">
                            <Image
                                src="/assets/icons/star.svg"
                                alt="star"
                                width={16}
                                height={16}
                            />
                            <p className="text-sm text-primary-orange font-semibold">
                                {"21"}
                            </p>
                        </div>
                    </div>
                    <div className="my-7 flex flex-col gap-5">
                        <div className="flex gap-5 flex-wrap">
                            <PriceInfoCard
                                title="Current Price"
                                iconSrc="/assets/icons/price-tag.svg"
                                value={`${product.discountedPrice} €`}
                            />
                            <PriceInfoCard
                                title="Average Price"
                                iconSrc="/assets/icons/chart.svg"
                                value={`${product.averagePrice} €`}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </Link>
    )
}

export default ProductCard
