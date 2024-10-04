import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url: { type: String, required: true , unique: true},
    title: { type: String, required: true },
    image: { type: String, required: true },
    originalPrice: { type: Number, required: false },
    discountedPrice: { type: Number, required: false },
    unitPrice: { type: Number, required: false },
    priceHistory: [
        {
            discountedPrice: { type: Number, required: false },
            mainPrice: { type: Number, required: false },
            date: { type: Date, required: true }
        }
    ],
    lowestPrice: { type: Number, required: true },
    highestPrice: { type: Number, required: true},
    averagePrice: { type: Number, required: true },
    users:[
        {email: {type: String, required: true}}
    ],default: [],
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;