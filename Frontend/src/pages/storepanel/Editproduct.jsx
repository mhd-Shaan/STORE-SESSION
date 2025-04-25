import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Paper, 
  Box, 
  IconButton,
  Typography,
  InputAdornment
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";
import toast from "react-hot-toast";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.product;

  const [product, setProduct] = useState({
    vehicleBrand: "",
    vehicleModel: "",
    productId: "",
    productName: "",
    price: "",
    mrp: "",
    stockQuantity: "",
    warranty: "",
    features: "",
    description: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedProduct) {
      setProduct({
        vehicleBrand: selectedProduct.vehicleBrand || "",
        vehicleModel: selectedProduct.vehicleModel || "",
        productId: selectedProduct.productId || "",
        productName: selectedProduct.productName || "",
        price: selectedProduct.price || "",
        mrp: selectedProduct.mrp || "",
        stockQuantity: selectedProduct.stockQuantity || "",
        warranty: selectedProduct.warranty || "",
        features: selectedProduct.features || "",
        description: selectedProduct.description || "",
      });
      setExistingImages(selectedProduct.images || []);
    }
  }, [selectedProduct]);

  const validateForm = () => {
    const newErrors = {};
    if (!product.productName) newErrors.productName = "Product name is required";
    if (!product.price || isNaN(product.price)) newErrors.price = "Valid price is required";
    if (!product.stockQuantity || isNaN(product.stockQuantity)) newErrors.stockQuantity = "Valid stock quantity is required";
    
    // Validate at least 1 image exists
    const totalImages = existingImages.length - deletedImages.length + newImages.length;
    if (totalImages < 1) newErrors.images = "At least 1 image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length - deletedImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
    if (errors.images) setErrors(prev => ({ ...prev, images: undefined }));
  };

  const handleDeleteImage = (type, index) => {
    if (type === 'existing') {
      const imageToDelete = existingImages[index];
      setDeletedImages(prev => [...prev, imageToDelete]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const formData = new FormData();

    // Append product data
    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Append image data
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("deletedImages", JSON.stringify(deletedImages));
    newImages.forEach(file => formData.append("images", file));

    try {
      await axios.put(`http://localhost:5000/store/editproduct/${selectedProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success("Product updated successfully!");
      navigate("/product-managment");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.error || "Error updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImages = existingImages.length - deletedImages.length + newImages.length;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Edit Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              label="Product Name *"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              error={!!errors.productName}
              helperText={errors.productName}
              fullWidth
            />

            <TextField
              label="Product ID"
              name="productId"
              value={product.productId}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Price *"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />

            <TextField
              label="MRP"
              name="mrp"
              type="number"
              value={product.mrp}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />

            <TextField
              label="Stock Quantity *"
              name="stockQuantity"
              type="number"
              value={product.stockQuantity}
              onChange={handleChange}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity}
              fullWidth
            />

            <TextField
              label="Warranty"
              name="warranty"
              value={product.warranty}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Vehicle Brand"
              name="vehicleBrand"
              value={product.vehicleBrand}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Vehicle Model"
              name="vehicleModel"
              value={product.vehicleModel}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />

          <TextField
            label="Features"
            name="features"
            value={product.features}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          {/* Image Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Product Images (1-5 required)
              {errors.images && (
                <Typography color="error" variant="caption" display="block">
                  {errors.images}
                </Typography>
              )}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {existingImages.map((img, index) => (
                <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                  <img 
                    src={img} 
                    alt={`Product ${index}`} 
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} 
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage('existing', index)}
                    sx={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'error.dark' }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {newImages.map((file, index) => (
                <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`New ${index}`} 
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} 
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage('new', index)}
                    sx={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'error.dark' }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              disabled={totalImages >= 5}
            >
              Upload Images
              <VisuallyHiddenInput 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange} 
              />
            </Button>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {Math.max(0, 5 - totalImages)} images remaining (minimum 1 required)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              disabled={isSubmitting || totalImages < 1}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}