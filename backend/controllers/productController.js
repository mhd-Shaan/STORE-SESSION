import Brands from "../models/BrandSchema.js";
import Category from "../models/CatgoerySchema.js";
import Product from "../models/productSchema.js";
import SubCategory from "../models/SubCatgoerySchema.js";

export const addProduct = async (req, res) => {
  try {
    const storeid = req.storeid;

    const {
      vehicleType,
      vehicleBrand,
      vehicleModel,
      category,
      subcategory,
      brandType,
      brand,
      productId,
      productName,
      description,
      price,
      mrp,
      discount,
      stock,
      warranty,
      features,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Field Validations
    if (!vehicleType) return res.status(400).json({ error: "Vehicle type is required" });
    if (!vehicleBrand) return res.status(400).json({ error: "Vehicle brand is required" });
    if (!vehicleModel) return res.status(400).json({ error: "Vehicle model is required" });
    if (!category) return res.status(400).json({ error: "Category is required" });
    if (!subcategory) return res.status(400).json({ error: "Subcategory is required" });
    if (!brandType) return res.status(400).json({ error: "Brand type is required" });
    if (!brand) return res.status(400).json({ error: "Brand is required" });
    if (!productId) return res.status(400).json({ error: "Product ID is required" });
    if (!productName) return res.status(400).json({ error: "Product name is required" });
    if (!price || isNaN(price)) return res.status(400).json({ error: "Valid price is required" });
    if (!mrp || isNaN(mrp)) return res.status(400).json({ error: "Valid MRP is required" });
    if (discount && isNaN(discount)) return res.status(400).json({ error: "Discount must be a number" });
    if (!stock || isNaN(stock)) return res.status(400).json({ error: "Valid stock quantity is required" });

    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new Product({
      storeid,
      vehicleType,
      vehicleBrand,
      vehicleModel,
      category,
      subcategory,
      brandType,
      brand,
      productId,
      productName,
      description,
      price: Number(price),
      mrp: Number(mrp),
      discount: discount ? Number(discount) : 0,
      stockQuantity: Number(stock),
      warranty: warranty || "",
      features: features || "",
      images: imageUrls,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ error: "Internal server error" });
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
      description,
      price,
      mrp,
      stockQuantity,
      warranty,
      features,
      existingImages, // JSON string of existing images from frontend
      deletedImages,  // JSON string of deleted images from frontend
    } = req.body;

    // Input Validations for required fields
    if (!productName) return res.status(400).json({ error: "Product name is required" });
    if (price && isNaN(price)) return res.status(400).json({ error: "Valid price is required" });
    if (stockQuantity && isNaN(stockQuantity)) return res.status(400).json({ error: "Valid stock quantity is required" });

    // Fetch existing product
    const product = await Product.findById(Productid);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create update object with only provided fields
    const updateData = {};
    
    if (vehicleType !== undefined) updateData.vehicleType = vehicleType;
    if (vehicleBrand !== undefined) updateData.vehicleBrand = vehicleBrand;
    if (vehicleModel !== undefined) updateData.vehicleModel = vehicleModel;
    if (partType !== undefined) updateData.partType = partType;
    if (spareBrand !== undefined) updateData.spareBrand = spareBrand;
    if (productId !== undefined) updateData.productId = productId;
    if (productName !== undefined) updateData.productName = productName;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (mrp !== undefined) updateData.mrp = mrp;
    if (stockQuantity !== undefined) updateData.stockQuantity = stockQuantity;
    if (warranty !== undefined) updateData.warranty = warranty;
    if (features !== undefined) updateData.features = features;

    // Handle images only if they are being updated
    if (existingImages !== undefined || deletedImages !== undefined || req.files?.length) {
      // Parse JSON strings
      let updatedImages = existingImages ? JSON.parse(existingImages) : [...product.images];
      const deletedImagesArray = deletedImages ? JSON.parse(deletedImages) : [];

      // Remove deleted images
      updatedImages = updatedImages.filter(img => !deletedImagesArray.includes(img));

      // Add newly uploaded images
      const newImageUrls = req.files?.map((file) => file.path) || [];
      updateData.images = [...updatedImages, ...newImageUrls];
    }

    // Update product with only the provided fields
    const updatedProduct = await Product.findByIdAndUpdate(
      Productid,
      updateData,
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



export const categoryshow = async (req, res) => {
  try {
    const category = await Category.find({ isBlocked: false });
    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error on fetching products" });
  }
};

export const brandsshow = async (req, res) => {
  try {
    // Check and parse limit from query params
    const oeslimit = req.query.oesLimit ? parseInt(req.query.oesLimit) : null;
    const oemlimit = req.query.oemLimit ? parseInt(req.query.oemLimit) : null;
    
    

  

    // Create base queries
    const oemQuery = Brands.find({ isBlocked: false, type: 'OEM' }).limit(Number(oemlimit));

    const oesQuery = Brands.find({ isBlocked: false, type: 'OES' }).limit(Number(oeslimit));
  

    const [oemBrands, oesBrands] = await Promise.all([
      oemQuery,
      oesQuery,
    ]);


    // Send response
    res.status(200).json({
      oem: oemBrands,
      oes: oesBrands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Error fetching brands" });
  }
};

export const SubCategoryShow = async (req, res) => {
  try {
    const SubCategoryId = req.query.id;
    

    const SubCategorydetails = await SubCategory.find({ CategoryId: SubCategoryId });
     
    return res.status(200).json({
      subCategories: SubCategorydetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

