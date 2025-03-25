import { useEffect, useState } from "react";
import { Button, Paper, Typography, Avatar, Box, TextField, Select, MenuItem, IconButton, Menu, Tooltip } from "@mui/material";
import { ChevronLeft, ChevronRight, MoreVert, Edit, Delete, Block, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function StoreProducts() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    showProducts();
  }, []);

  const showProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/store/showproducts", { withCredentials: true });
      setProducts(res.data.productdetails);
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

  const filteredProducts = products
    .filter((product) => product.productName.toLowerCase().includes(search.toLowerCase()))
    .filter((product) => {
      if (statusFilter === "block") return product.isBlock;
      if (statusFilter === "unblocked") return !product.isBlock;
      return true;
    });

  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 2, borderRadius: 2 }}>
        <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" justifyContent="space-between">
          <TextField variant="outlined" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, minWidth: 120 }} />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 120 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="block">Blocked</MenuItem>
            <MenuItem value="unblocked">Unblocked</MenuItem>
          </Select>
          <Button variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }} onClick={() => navigate('/addingproducts')}>Add New +</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflowX: "auto" }}>
        <Box display="flex" p={2} fontWeight="bold" bgcolor="grey.300">
          <Typography sx={{ flex: 2 }}>Product Detail</Typography>
          <Typography sx={{ flex: 1 }}>Product ID</Typography>
          <Typography sx={{ flex: 1 }}>Status</Typography>
          <Typography sx={{ flex: 0.5 }}>Actions</Typography>
        </Box>
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <Box key={product.id} display="flex" alignItems="center" p={2} borderBottom={1} borderColor="grey.300">
              <Box sx={{ flex: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={product.images?.[0] || "https://via.placeholder.com/50"} />
                <Box>
                  <Typography fontWeight="bold">{product.productName}</Typography>
                </Box>
              </Box>
              <Typography sx={{ flex: 1 }}>{product.productId}</Typography>
              <Typography sx={{ flex: 1 }}>
                <Box sx={{ display: "inline-block", px: 2, py: 0.5, borderRadius: 1, bgcolor: product.isBlock ? "error.main" : "success.main", color: "white" }}>
                  {product.isBlock ? "Blocked" : "Active"}
                </Box>
              </Typography>
              <Box sx={{ flex: 0.5 }}>
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

      <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
        <Button variant="outlined" size="small" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          <ChevronLeft />
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button key={index} variant={page === index + 1 ? "contained" : "outlined"} color={page === index + 1 ? "primary" : "inherit"} onClick={() => setPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
        <Button variant="outlined" size="small" disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
          <ChevronRight />
        </Button>
      </Box>
    </Box>
  );
}
