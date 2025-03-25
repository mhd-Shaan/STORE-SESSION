import Product from "../models/productSchema.js";

export const addProduct = async (req, res) => {
  try {
    const storeid = req.storeid;

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

    if (!vehicleType)
      return res.status(400).json({ error: "Vehicle type is required" });
    if (!vehicleBrand)
      return res.status(400).json({ error: "Vehicle brand is required" });
    if (!vehicleModel)
      return res.status(400).json({ error: "Vehicle model is required" });
    if (!partType)
      return res.status(400).json({ error: "Part type is required" });
    if (!spareBrand)
      return res.status(400).json({ error: "Spare brand is required" });
    if (!productId)
      return res.status(400).json({ error: "Product ID is required" });
    if (!productName)
      return res.status(400).json({ error: "Product name is required" });
    if (!price || isNaN(price))
      return res.status(400).json({ error: "Valid price is required" });
    if (!stockQuantity || isNaN(stockQuantity))
      return res
        .status(400)
        .json({ error: "Valid stock quantity is required" });

    const imageUrls = req.files.map((file) => file.path);

    // const existingproduct = await Product.findOne({ storeid, productName });
    // if (existingproduct) {
    //   return res.status(400).json({ error: "This product name is already taken" }); // ✅ Stops execution
    // }

    const newProduct = new Product({
      storeid,
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

    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct }); // ✅ Single response
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json(error); // ✅ Single response
  }
};

export const showProduct = async (req, res) => {
  try {
    const storeidd = req.storeid;

    const {page=1,limit=10,search='',status='all'}=req.query    

    const skip =(page - 1)*limit;

    const searchFilter ={
      storeid: storeidd, 
      $or: [
        { productName: { $regex: search, $options: "i" } }, 
        { productId: { $regex: search, $options: "i" } }, 
      ],
    }

    

    if(status === 'block'){
      searchFilter.isBlock=true
    }
    else if(status === 'unblocked'){
      searchFilter.isBlock=false
    }

    const totalproduct = await Product.countDocuments(searchFilter)



    const productdetails = await Product.find(searchFilter).skip(skip).limit(Number(limit));

    res.status(200).json({
      totalproduct,
      currentPage: Number(page),
      totalPages: Math.ceil(totalproduct / limit),
      productdetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "product showing error" });
  }
};

export const Editproduct = async (req, res) => {
  try {
    const Productid = req.params.id;    

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
      existingImages, // JSON string of existing images from frontend
      deletedImages,  // JSON string of deleted images from frontend
    } = req.body;

    // Input Validations
    if (!vehicleType) return res.status(400).json({ error: "Vehicle type is required" });
    if (!vehicleBrand) return res.status(400).json({ error: "Vehicle brand is required" });
    if (!vehicleModel) return res.status(400).json({ error: "Vehicle model is required" });
    if (!partType) return res.status(400).json({ error: "Part type is required" });
    if (!spareBrand) return res.status(400).json({ error: "Spare brand is required" });
    if (!productId) return res.status(400).json({ error: "Product ID is required" });
    if (!productName) return res.status(400).json({ error: "Product name is required" });
    if (!price || isNaN(price)) return res.status(400).json({ error: "Valid price is required" });
    if (!stockQuantity || isNaN(stockQuantity)) return res.status(400).json({ error: "Valid stock quantity is required" });

    // Fetch existing product
    const product = await Product.findById(Productid);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Parse JSON strings
    let updatedImages = JSON.parse(existingImages || "[]");
    const deletedImagesArray = JSON.parse(deletedImages || "[]");

    // Remove deleted images
    updatedImages = updatedImages.filter(img => !deletedImagesArray.includes(img));

    // Add newly uploaded images
    const newImageUrls = req.files.map((file) => file.path);
    updatedImages = [...updatedImages, ...newImageUrls];

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      Productid,
      {
        vehicleType,
        vehicleBrand,
        vehicleModel,
        partType,
        spareBrand,
        stockQuantity,
        productId,
        productName,
        description,
        price,
        images: updatedImages, // Store final image list
      },
      { new: true }
    );

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while updating product" });
  }
};



export const DeleteProduct = async(req,res)=>{
try {
  const Productid = req.params.id;
  if (!Productid) return res.status(400).json({ error: 'Employee ID is required' });
  const product = await Product.findByIdAndDelete(Productid);
  if (!product) return res.status(404).json({ error: 'Employee not found' });

  res.status(200).json({ message: 'Product deleted successfully' });
  
} catch (error) {
  console.error('Error deleting product:', error);
  res.status(500).json({ error: 'Failed to delete product' });
}
}

export const blockunblockproduct = async(req,res)=>{
  try {
    
    const Productid = req.params.id;
    const productdetails = await Product.findById(Productid)
    if (!productdetails) {
      return res.status(404).json({ error: "product not found" });
    }
    productdetails.isBlock = !productdetails.isBlock
    await productdetails.save();
    
    res.status(200).json({
      success: true,
      message: `product ${productdetails.isBlock ? "Blocked" : "Unblocked"} successfully`,
      productdetails,
    });

  } catch (error) {
    console.error("Error in blockandunblockproduct:", error);
    res.status(500).json({error});
  }
}