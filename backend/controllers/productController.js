import Product from "../models/productSchema.js";


export const addProduct = async (req, res) => {
  try {
    const {
      vehicleType,
      vehicleBrand,
      vehicleModel,
      partType,
      spareBrand,
      productId,
      productName,
      price,
      stockQuantity,
      description,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    if (!vehicleType) return res.status(400).json({ error: "Vehicle type is required" });
    if (!vehicleBrand) return res.status(400).json({ error: "Vehicle brand is required" });
    if (!vehicleModel) return res.status(400).json({ error: "Vehicle model is required" });
    if (!partType) return res.status(400).json({ error: "Part type is required" });
    if (!spareBrand) return res.status(400).json({ error: "Spare brand is required" });
    if (!productId) return res.status(400).json({ error: "Product ID is required" });
    if (!productName) return res.status(400).json({ error: "Product name is required" });
    if (!price || isNaN(price)) return res.status(400).json({ error: "Valid price is required" });
    if (!stockQuantity || isNaN(stockQuantity)) return res.status(400).json({ error: "Valid stock quantity is required" });

    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new Product({
      vehicleType,
      vehicleBrand,
      vehicleModel,
      partType,
      spareBrand,
      productId,
      productName,
      description,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      images: imageUrls, // Store image URLs
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const showProduct = async(req,res)=>{
  try {
    const productdetails = await Product.find()
    res.status(200).json({
      message:"product get success",
      productdetails
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"product showing error"})
    
  }
}
