import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: true,
     // enum: ["2-Wheeler", "4-Wheeler", "Commercial Vehicle"],
    },
    vehicleBrand: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    partType: {
      type: String,
      required: true,
    },
    spareBrand: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      unique: true,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Product = mongoose.model("Product", productSchema);

export default Product;
