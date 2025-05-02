import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  IconButton,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const steps = ["Vehicle Information", "Product Details", "Review"];
const vehicleTypes = [
  "Two Wheeler",
  "Four Wheeler",
  "Commercial Vehicle",
  "Light Commercial Vehicle"
];

export default function AddingProducts() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState({ oem: [], oes: [] });
  const [productIdAvailable, setProductIdAvailable] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    category: "",
    subcategory: "",
    brandType: "",
    brand: "",
    productName: "",
    description: "",
    mrp: "",
    price: "",
    discount: "",
    stock: "",
    warranty: "",
    features: "",
    images: [],
  });

  // Calculate discount percentage when MRP or price changes
  useEffect(() => {
    if (formData.mrp && formData.price) {
      const mrp = parseFloat(formData.mrp);
      const price = parseFloat(formData.price);
      if (mrp > 0 && price <= mrp) {
        const discountPercent = ((mrp - price) / mrp * 100).toFixed(2);
        setFormData(prev => ({ ...prev, discount: discountPercent }));
      }
    }
  }, [formData.mrp, formData.price]);

  // // Check if product ID is available
  // const checkProductIdAvailability = async () => {
  //   if (!formData.productId) return;
    
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/store/checkProductId?productId=${formData.productId}`,
  //       { withCredentials: true }
  //     );
  //     setProductIdAvailable(response.data.available);
  //   } catch (err) {
  //     console.error("Error checking product ID:", err);
  //   }
  // };

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get("http://localhost:5000/store/showcatgoery", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/store/showbrands", {
            withCredentials: true,
          }),
        ]);

        setCategories(categoriesRes.data?.category || []);
        setBrands({
          oem: brandsRes.data?.oem || [],
          oes: brandsRes.data?.oes || [],
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.category) {
      axios
        .get(`http://localhost:5000/store/showsubcatgoery?id=${formData.category}`, {
          withCredentials: true,
        })
        .then((res) => {
          setSubcategories(res.data?.subCategories || []);
        })
        .catch((err) => {
          console.error("Error fetching subcategories:", err);
        });
    } else {
      setSubcategories([]);
    }
  }, [formData.category]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.productId) newErrors.productId = "Product ID is required";
      if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required";
      if (!formData.vehicleBrand) newErrors.vehicleBrand = "Vehicle brand is required";
      if (!formData.vehicleModel) newErrors.vehicleModel = "Vehicle model is required";
    } else if (step === 1) {
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.brandType) newErrors.brandType = "Brand type is required";
      if (!formData.brand) newErrors.brand = "Brand is required";
      if (!formData.productName) newErrors.productName = "Product name is required";
      if (!formData.description) newErrors.description = "Description is required";
      if (!formData.mrp) newErrors.mrp = "MRP is required";
      if (isNaN(formData.mrp)) newErrors.mrp = "MRP must be a number";
      if (!formData.price) newErrors.price = "Selling price is required";
      if (isNaN(formData.price)) newErrors.price = "Price must be a number";
      if (parseFloat(formData.price) > parseFloat(formData.mrp)) {
        newErrors.price = "Price cannot be greater than MRP";
      }
      if (!formData.stock) newErrors.stock = "Stock is required";
      if (isNaN(formData.stock)) newErrors.stock = "Stock must be a number";
      if (formData.images.length === 0) {
        newErrors.images = "At least one image is required";
      } else if (formData.images.length > 5) {
        newErrors.images = "Maximum 5 images allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const newImages = [...formData.images, ...Array.from(files)];
      if (newImages.length <= 5) {
        setFormData({ ...formData, images: newImages });
      }
    } else {
      setFormData({ ...formData, [name]: value });

      // Clear related fields when parent changes
      if (name === "category") {
        setFormData((prev) => ({ ...prev, subcategory: "" }));
      }
      if (name === "brandType") {
        setFormData((prev) => ({ ...prev, brand: "" }));
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((file) => data.append("images", file));
        } else if (value) {
          data.append(key, value);
        }
      });

      await axios.post("http://localhost:5000/store/addproduct", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Reset form after successful submission
      setFormData({
        productId: "",
        vehicleType: "",
        vehicleBrand: "",
        vehicleModel: "",
        category: "",
        subcategory: "",
        brandType: "",
        brand: "",
        productName: "",
        description: "",
        mrp: "",
        price: "",
        discount: "",
        stock: "",
        warranty: "",
        features: "",
        images: [],
      });
      setActiveStep(0);
      setProductIdAvailable(false);
      alert("Product added successfully!");
    } catch (err) {
      console.error("Error uploading product:", err);
      setErrors({
        submit:
          err.response?.data?.message ||
          "Failed to upload product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFilteredBrands = () => {
    return formData.brandType === "OEM" ? brands.oem : brands.oes;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Product Identification
            </Typography>

            <TextField
              label="Product ID"
              name="productId"
              fullWidth
              margin="normal"
              value={formData.productId}
              onChange={handleChange}
              // onBlur={checkProductIdAvailability}
              error={!!errors.productId}
              // helperText={
              //   errors.productId || 
              //   (formData.productId && productIdAvailable ? 
              //     "Product ID is available" : "")
              // }
              required
              InputProps={{
                endAdornment: formData.productId && (
                  <Chip
                   
                    size="small"
                  />
                ),
              }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Vehicle Information
            </Typography>

            <FormControl fullWidth margin="normal" error={!!errors.vehicleType} required>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                label="Vehicle Type"
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.vehicleType && <FormHelperText>{errors.vehicleType}</FormHelperText>}
            </FormControl>

            <TextField
              label="Vehicle Brand"
              name="vehicleBrand"
              fullWidth
              margin="normal"
              value={formData.vehicleBrand}
              onChange={handleChange}
              error={!!errors.vehicleBrand}
              helperText={errors.vehicleBrand}
              required
            />

            <TextField
              label="Vehicle Model"
              name="vehicleModel"
              fullWidth
              margin="normal"
              value={formData.vehicleModel}
              onChange={handleChange}
              error={!!errors.vehicleModel}
              helperText={errors.vehicleModel}
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>

            <FormControl fullWidth margin="normal" error={!!errors.category} required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.subcategory}>
              <InputLabel>Subcategory</InputLabel>
              <Select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                label="Subcategory"
                disabled={!formData.category}
              >
                {subcategories.length > 0 ? (
                  subcategories.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                      {sub.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="other">Other</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.brandType} required>
              <InputLabel>Brand Type</InputLabel>
              <Select
                name="brandType"
                value={formData.brandType}
                onChange={handleChange}
                label="Brand Type"
              >
                <MenuItem value="OEM">OEM (Original Equipment Manufacturer)</MenuItem>
                <MenuItem value="OES">OES (Original Equipment Supplier)</MenuItem>
              </Select>
              {errors.brandType && <FormHelperText>{errors.brandType}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.brand} required>
              <InputLabel>Brand</InputLabel>
              <Select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                label="Brand"
                disabled={!formData.brandType}
              >
                {getFilteredBrands().map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.brand && <FormHelperText>{errors.brand}</FormHelperText>}
            </FormControl>

            <TextField
              label="Product Name"
              name="productName"
              fullWidth
              margin="normal"
              value={formData.productName}
              onChange={handleChange}
              error={!!errors.productName}
              helperText={errors.productName}
              required
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="MRP (₹)"
                name="mrp"
                type="number"
                fullWidth
                margin="normal"
                value={formData.mrp}
                onChange={handleChange}
                error={!!errors.mrp}
                helperText={errors.mrp}
                required
              />

              <TextField
                label="Selling Price (₹)"
                name="price"
                type="number"
                fullWidth
                margin="normal"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Discount (%)"
                name="discount"
                type="number"
                fullWidth
                margin="normal"
                value={formData.discount}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                {formData.mrp && formData.price && (
                  <Chip
                    label={`You save: ₹${(formData.mrp - formData.price).toFixed(2)}`}
                    color="success"
                    sx={{ fontSize: '0.875rem', height: '36px' }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                fullWidth
                margin="normal"
                value={formData.stock}
                onChange={handleChange}
                error={!!errors.stock}
                helperText={errors.stock}
                required
              />

              <TextField
                label="Warranty"
                name="warranty"
                fullWidth
                margin="normal"
                value={formData.warranty}
                onChange={handleChange}
              />
            </Box>

            <TextField
              label="Features (comma separated)"
              name="features"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.features}
              onChange={handleChange}
              placeholder="e.g., High durability, Weather resistant, Easy installation"
            />

            <Box sx={{ mt: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
                disabled={formData.images.length >= 5}
              >
                Upload Images ({formData.images.length}/5)
                <VisuallyHiddenInput
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                />
              </Button>
              {errors.images && (
                <Typography color="error" variant="caption" display="block">
                  {errors.images}
                </Typography>
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {formData.images.map((img, idx) => (
                  <Box key={idx} sx={{ position: "relative" }}>
                    <Avatar
                      src={URL.createObjectURL(img)}
                      variant="rounded"
                      sx={{ width: 100, height: 100 }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.9)",
                        },
                      }}
                      onClick={() => removeImage(idx)}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Product
            </Typography>

            <Typography variant="subtitle1">Product Identification</Typography>
            <Typography>Product ID: {formData.productId}</Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Vehicle Information
            </Typography>
            <Typography>Type: {formData.vehicleType}</Typography>
            <Typography>Brand: {formData.vehicleBrand}</Typography>
            <Typography>Model: {formData.vehicleModel}</Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Product Details
            </Typography>
            <Typography>
              Category: {categories.find((c) => c._id === formData.category)?.name}
            </Typography>
            <Typography>
              Subcategory: {formData.subcategory === "other" 
                ? "Other" 
                : subcategories.find((s) => s._id === formData.subcategory)?.name}
            </Typography>
            <Typography>Brand Type: {formData.brandType}</Typography>
            <Typography>
              Brand: {getFilteredBrands().find((b) => b._id === formData.brand)?.name}
            </Typography>
            <Typography>Product Name: {formData.productName}</Typography>
            <Typography>Description: {formData.description}</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
              <Typography>MRP: ₹{formData.mrp}</Typography>
              <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                (Original Price)
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography color="primary">Selling Price: ₹{formData.price}</Typography>
              <Chip 
                label={`${formData.discount}% OFF`} 
                color="success" 
                size="small" 
              />
            </Box>
            
            <Typography>You save: ₹{(formData.mrp - formData.price).toFixed(2)}</Typography>
            
            <Typography>Stock: {formData.stock}</Typography>
            {formData.warranty && (
              <Typography>Warranty: {formData.warranty}</Typography>
            )}

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Product Images ({formData.images.length})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.images.map((img, idx) => (
                <Avatar
                  key={idx}
                  src={URL.createObjectURL(img)}
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                />
              ))}
            </Box>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Add New Product
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={24} /> : null}
          >
            {isSubmitting ? "Submitting..." : "Submit Product"}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
}