import { useEffect, useState } from "react";
import { Button, Paper, Typography, Avatar, Box, TextField, Select, MenuItem, IconButton, Menu, Tooltip, Pagination } from "@mui/material";
import { ChevronLeft, ChevronRight, MoreVert, Edit, Delete, Block, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function StoreProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);


  const productperpage = 10;




  const navigate = useNavigate();

  useEffect(() => {
    showProducts();
  }, [search,filterStatus,currentPage]);

  const showProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/store/showproducts", { 
        params: {
          page: currentPage,
          limit: productperpage,
          search: search,
          status:filterStatus
        },
        withCredentials: true
       });
       
      setProducts(res.data.productdetails);
      setTotalPages(res.data.totalPages)
      console.log(res.data);
      

    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuOpen = (event, product) => {
    setMenuAnchor(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProduct(null);
  };

  const handleBlockUnblock = async () => {
    if (!selectedProduct) return;    
    try {
      await axios.put(`http://localhost:5000/store/block-unblock/${selectedProduct._id}`,{}, 
      { withCredentials: true });
      showProducts(); 
    } catch (error) {
      console.log(error);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (!selectedProduct) return;
    navigate(`/edit-product`, { state: { product: selectedProduct } });
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/store/deleteproduct/${selectedProduct._id}`, { withCredentials: true });
        showProducts();
      } catch (error) {
        console.log(error);
      }
    }
    handleMenuClose();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 2, borderRadius: 2 }}>
      <Box 
  display="flex" 
  alignItems="center" 
  justifyContent="space-between" 
  gap={1} 
  flexWrap="nowrap" 
  overflow="auto"
>
  <TextField 
    variant="outlined" 
    placeholder="Search by name..." 
    value={search} 
    onChange={(e) => setSearch(e.target.value)} 
    sx={{ flex: 1, minWidth: 120 }} 
  />
  <Select 
    value={filterStatus} 
    onChange={(e) => setFilterStatus(e.target.value)} 
    sx={{ minWidth: 120 }}
  >
    <MenuItem value="all">All</MenuItem>
    <MenuItem value="block">Blocked</MenuItem>
    <MenuItem value="unblocked">Unblocked</MenuItem>
  </Select>
  <Button 
    variant="contained" 
    color="primary" 
    sx={{ whiteSpace: "nowrap", flexShrink: 0 }} 
    onClick={() => navigate('/addingproducts')}
  >
    Add New +
  </Button>
</Box>

      </Paper>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflowX: "auto" }}>
  {/* Table Header */}
  <Box 
    display="flex" 
    p={2} 
    fontWeight="bold" 
    bgcolor="grey.300" 
    alignItems="center"
  >
    <Typography sx={{ flex: 1.5, minWidth: 150 }}>Product Name</Typography>
    <Typography 
      sx={{ 
        flex: 1, 
        minWidth: 120, 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis" 
      }}
    >
      Product ID
    </Typography>
    <Typography sx={{ flex: 0.8, minWidth: 100 }}>Status</Typography>
    <Typography sx={{ flex: 0.5, minWidth: 80, textAlign: "center" }}>Actions</Typography>
  </Box>

  {/* Table Body */}
  {products.length > 0 ? (
    products.map((product) => (
      <Box 
        key={product._id} 
        display="flex" 
        alignItems="center" 
        p={2} 
        borderBottom={1} 
        borderColor="grey.300"
      >
        {/* Product Name */}
        <Box sx={{ flex: 1.5, display: "flex", alignItems: "center", gap: 2, minWidth: 150 }}>
          <Avatar src={product.images?.[0] || "https://via.placeholder.com/50"} />
          <Typography fontWeight="bold" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {product.productName}
          </Typography>
        </Box>

        {/* Product ID */}
        <Typography 
          sx={{ 
            flex: 1, 
            minWidth: 120, 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis" 
          }}
        >
          {product.productId}
        </Typography>

        {/* Status */}
        <Typography sx={{ flex: 0.8, minWidth: 100 }}>
          <Box sx={{ display: "inline-block", px: 2, py: 0.5, borderRadius: 1, bgcolor: product.isBlock ? "red" : "green", color: "white" }}>
            {product.isBlock ? "Blocked" : "Active"}
          </Box>
        </Typography>

        {/* Actions */}
        <Box sx={{ flex: 0.5, minWidth: 80, textAlign: "center" }}>
          <IconButton onClick={(event) => handleMenuOpen(event, product)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
    ))
  ) : (
    <Box textAlign="center" py={4}>
      <Typography color="textSecondary">No products found.</Typography>
    </Box>
  )}
</Paper>



      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleBlockUnblock}>
          {selectedProduct?.isBlock ? <CheckCircle color="success" sx={{ mr: 1 }} /> : <Block color="error" sx={{ mr: 1 }} />}
          {selectedProduct?.isBlock ? "Unblock" : "Block"}
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit color="primary" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete color="error" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <div className="flex justify-end mt-4">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                  />
                </div>

    </Box>
  );
}
