import { useEffect, useState } from "react";
import { Tabs, Tab, Button, Paper, Typography, Avatar, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    showProducts();
  }, []);

  const showProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/store/showproducts");
      setProducts(res.data.productdetails);
      console.log(res.data.productdetails);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", p: 2 }}>
      {/* Tabs Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Home" />
          <Tab label="Pending" />
        </Tabs>
        <Button variant="contained" color="primary" component={NavLink} to="/addingproducts">
          Add New Listing
        </Button>
      </Box>

      {/* Responsive Table Container */}
      <Box sx={{ overflowX: "auto", mt: 3 }}>
        <Paper sx={{ borderRadius: 2, minWidth: 600 }}> {/* Ensure table does not shrink too much */}
          {/* Header Row */}
          <Box
            display="flex"
            p={2}
            fontWeight="bold"
            sx={{
              bgcolor: "grey.300",
              flexWrap: "nowrap",
              minWidth: 600, // Ensure table stays structured on small screens
            }}
          >
            <Typography sx={{ flex: 2, minWidth: 150 }}>Product Detail</Typography>
            <Typography sx={{ flex: 1, minWidth: 100 }}>Stock</Typography>
            <Typography sx={{ flex: 1, minWidth: 100 }}>Price</Typography>
            <Typography sx={{ flex: 1, minWidth: 120 }}>Vehicle Brand</Typography>
            <Typography sx={{ flex: 1, minWidth: 120 }}>Part Type</Typography>
          </Box>

          {/* Product Rows */}
          {products.map((product) => (
            <Box
              key={product.id}
              display="flex"
              alignItems="center"
              p={2}
              sx={{
                borderBottom: 1,
                borderColor: "grey.300",
                flexWrap: "nowrap",
                minWidth: 600, // Maintain table layout on smaller screens
              }}
            >
              {/* Product Details */}
              <Box sx={{ flex: 2, display: "flex", alignItems: "center", gap: 2, minWidth: 150 }}>
                <Avatar
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "https://via.placeholder.com/50"
                  }
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography fontWeight="bold">{product.productName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    SKU ID: {product.productId}
                  </Typography>
                </Box>
              </Box>

              {/* Stock */}
              <Typography sx={{ flex: 1, textAlign: "center", minWidth: 100 }}>
                {product.stockQuantity}
              </Typography>

              {/* Price */}
              <Typography sx={{ flex: 1, textAlign: "center", minWidth: 100 }}>
                {product.price}
              </Typography>

              {/* Vehicle Brand */}
              <Typography sx={{ flex: 1, textAlign: "center", minWidth: 120 }}>
                {product.vehicleBrand}
              </Typography>

              {/* Part Type */}
              <Typography sx={{ flex: 1, textAlign: "center", minWidth: 120 }}>
                {product.partType}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default ProductList;
