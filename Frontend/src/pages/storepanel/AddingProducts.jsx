import { useState, useEffect } from "react";
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
  CircularProgress
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
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

const steps = ['Vehicle Information', 'Product Details', 'Review'];

export default function AddingProducts() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    category: "",
    subcategory: "",
    brandType: "",
    brand: "",
    productName: "",
    description: "",
    price: "",
    stock: "",
    warranty: "",
    features: "",
    images: [],
  });

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/brands")
        ]);
        
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setBrands(Array.isArray(brandsRes.data) ? brandsRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      axios.get(`/api/subcategories?category=${formData.category}`)
        .then((res) => {
          setSubcategories(Array.isArray(res.data) ? res.data : []);
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
      if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required";
      if (!formData.vehicleBrand) newErrors.vehicleBrand = "Vehicle brand is required";
      if (!formData.vehicleModel) newErrors.vehicleModel = "Vehicle model is required";
    } else if (step === 1) {
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.subcategory) newErrors.subcategory = "Subcategory is required";
      if (!formData.brandType) newErrors.brandType = "Brand type is required";
      if (!formData.brand) newErrors.brand = "Brand is required";
      if (!formData.productName) newErrors.productName = "Product name is required";
      if (!formData.description) newErrors.description = "Description is required";
      if (!formData.price) newErrors.price = "Price is required";
      if (isNaN(formData.price)) newErrors.price = "Price must be a number";
      if (!formData.stock) newErrors.stock = "Stock is required";
      if (isNaN(formData.stock)) newErrors.stock = "Stock must be a number";
      if (formData.images.length === 0) newErrors.images = "At least one image is required";
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
      setFormData({ ...formData, images: [...formData.images, ...Array.from(files)] });
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Clear related fields when parent changes
      if (name === "category") {
        setFormData(prev => ({ ...prev, subcategory: "" }));
      }
      if (name === "brandType") {
        setFormData(prev => ({ ...prev, brand: "" }));
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
        } else {
          data.append(key, value);
        }
      });

      await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      // Reset form after successful submission
      setFormData({
        vehicleType: "",
        vehicleBrand: "",
        vehicleModel: "",
        category: "",
        subcategory: "",
        brandType: "",
        brand: "",
        productName: "",
        description: "",
        price: "",
        stock: "",
        warranty: "",
        features: "",
        images: [],
      });
      setActiveStep(0);
      alert("Product added successfully!");
    } catch (err) {
      console.error("Error uploading product:", err);
      setErrors({
        submit: err.response?.data?.message || "Failed to upload product. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vehicle Information
            </Typography>
            
            <TextField
              label="Vehicle Type"
              name="vehicleType"
              fullWidth
              margin="normal"
              value={formData.vehicleType}
              onChange={handleChange}
              error={!!errors.vehicleType}
              helperText={errors.vehicleType}
              required
            />
            
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
            
            <FormControl fullWidth margin="normal" error={!!errors.subcategory} required>
              <InputLabel>Subcategory</InputLabel>
              <Select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                label="Subcategory"
                disabled={!formData.category}
              >
                {subcategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.subcategory && <FormHelperText>{errors.subcategory}</FormHelperText>}
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
                {brands
                  .filter((b) => b.type === formData.brandType)
                  .map((b) => (
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
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price (₹)"
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
            </Box>
            
            <TextField
              label="Warranty"
              name="warranty"
              fullWidth
              margin="normal"
              value={formData.warranty}
              onChange={handleChange}
            />
            
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
              >
                Upload Images
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
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {formData.images.map((img, idx) => (
                  <Box key={idx} sx={{ position: 'relative' }}>
                    <Avatar
                      src={URL.createObjectURL(img)}
                      variant="rounded"
                      sx={{ width: 100, height: 100 }}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        right: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)'
                        }
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
            
            <Typography variant="subtitle1">Vehicle Information</Typography>
            <Typography>Type: {formData.vehicleType}</Typography>
            <Typography>Brand: {formData.vehicleBrand}</Typography>
            <Typography>Model: {formData.vehicleModel}</Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Product Details</Typography>
            <Typography>Category: {categories.find(c => c._id === formData.category)?.name}</Typography>
            <Typography>Subcategory: {subcategories.find(s => s._id === formData.subcategory)?.name}</Typography>
            <Typography>Brand Type: {formData.brandType}</Typography>
            <Typography>Brand: {brands.find(b => b._id === formData.brand)?.name}</Typography>
            <Typography>Product Name: {formData.productName}</Typography>
            <Typography>Description: {formData.description}</Typography>
            <Typography>Price: ₹{formData.price}</Typography>
            <Typography>Stock: {formData.stock}</Typography>
            {formData.warranty && <Typography>Warranty: {formData.warranty}</Typography>}
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Product Images</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={24} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Product'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
}