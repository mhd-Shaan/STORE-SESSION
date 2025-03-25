import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Paper, Box, MenuItem } from "@mui/material";
import toast from "react-hot-toast";

export default function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.product;

  // Initialize state with selectedProduct if available
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

  const [newImages, setNewImages] = useState([]); 

  useEffect(() => {
    if (selectedProduct) {
      setProduct(selectedProduct);
    }
  }, [selectedProduct]); 

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    // Append existing images (retain old ones)
    product.images.forEach((img) => {
      formData.append("existingImages", img);
    });

    // Append new images
    newImages.forEach((file) => {
      formData.append("images", file);
    });
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

          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Existing Images</p>
            <div className="flex space-x-2">
              {product.images.map((img, index) => (
                <img key={index} src={img} alt="Product" className="w-16 h-16 rounded border" />
              ))}
            </div>
          </div>

          <input type="file" multiple onChange={handleImageChange} className="mb-4" />

          <Button variant="contained" color="primary" type="submit">
            Update Product
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
