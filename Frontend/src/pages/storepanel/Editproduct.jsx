import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Paper, Box, MenuItem, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import toast from "react-hot-toast";

export default function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.product;

  // Initialize state with selected product or empty values
  const [product, setProduct] = useState(selectedProduct || {
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    partType: "",
    spareBrand: "",
    productId: "",
    productName: "",
    price: "",
    stockQuantity: "",
    description: "",
    images: [],
  });

  // Track existing and new images separately
  const [existingImages, setExistingImages] = useState(selectedProduct?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]); // Track deleted images

  useEffect(() => {
    if (selectedProduct) {
      setProduct(selectedProduct);
      setExistingImages(selectedProduct.images || []);
    }
  }, [selectedProduct]);

  // Handle text field changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle new image selection (max 5 total)
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + selectedFiles.length - deletedImages.length;

    if (totalImages > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }

    setNewImages([...newImages, ...selectedFiles]);
  };

  // Handle delete existing image
  const handleDeleteExistingImage = (index) => {
    const imageToDelete = existingImages[index];
    setDeletedImages([...deletedImages, imageToDelete]); // Store deleted image
    setExistingImages(existingImages.filter((_, i) => i !== index)); // Remove from UI
  };

  // Handle delete new image
  const handleDeleteNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Handle product update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append product data
    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    // Append remaining existing images (not deleted ones)
    formData.append("existingImages", JSON.stringify(existingImages));

    // Append new images
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    // Append deleted images
    formData.append("deletedImages", JSON.stringify(deletedImages));

    try {
      await axios.put(`http://localhost:5000/store/editproduct/${product._id}`, formData, {
        withCredentials: true,
      });

      toast.success("Product updated successfully!");
      navigate("/product-managment");
    } catch (error) {
      console.error(error);
      toast.error("Error updating product");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleUpdate}>
          <TextField label="Product Name" name="productName" value={product.productName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Price" name="price" type="number" value={product.price} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Stock Quantity" name="stockQuantity" type="number" value={product.stockQuantity} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Description" name="description" value={product.description} onChange={handleChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />

          <TextField label="Vehicle Type" name="vehicleType" value={product.vehicleType} onChange={handleChange} fullWidth select sx={{ mb: 2 }}>
            <MenuItem value="2-Wheeler">2-Wheeler</MenuItem>
            <MenuItem value="4-Wheeler">4-Wheeler</MenuItem>
          </TextField>

          <TextField label="Vehicle Brand" name="vehicleBrand" value={product.vehicleBrand} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Part Type" name="partType" value={product.partType} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Spare Brand" name="spareBrand" value={product.spareBrand} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

          {/* Image Preview Section (Single Row) */}
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Product Images</p>
            <div className="flex flex-wrap gap-2">
              {/* Display Existing Images */}
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img src={img} alt="Existing" className="w-16 h-16 rounded border" />
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteExistingImage(index)} 
                    sx={{ position: "absolute", top: -5, right: -5 }}>
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </div>
              ))}

              {/* Display New Images */}
              {newImages.map((file, index) => (
                <div key={`new-${index}`} className="relative">
                  <img src={URL.createObjectURL(file)} alt="New" className="w-16 h-16 rounded border" />
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteNewImage(index)} 
                    sx={{ position: "absolute", top: -5, right: -5 }}>
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>

          {/* File Input for Adding New Images */}
          <input type="file" multiple onChange={handleImageChange} className="mb-4" disabled={existingImages.length + newImages.length >= 5} />

          <Button variant="contained" color="primary" type="submit">
            Update Product
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
