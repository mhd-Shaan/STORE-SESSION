import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, Badge, TextField } from "@mui/material";
import { AccountCircle, Notifications } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [storedetails, setStoredetails] = useState({}); // Initialize as an object
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false); 
  const navigate = useNavigate();

  const { store } = useSelector((state) => state.store);

  useEffect(() => {
      setStoredetails(store);
    
  }, [store]); 
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/store/logout", {}, { withCredentials: true });
      toast.success("Logout successful");
      navigate("/Storelogin");
    } catch (error) {
      console.log(error);
      toast.error("Error logging out");
    }
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/Storelogin");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowProfileForm(false); 
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
    setShowProfileForm(false); 
  };

  return (
    <>
      <header className="bg-white shadow-md w-full h-16 flex items-center px-6 justify-between z-40">
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <IconButton color="primary">
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile Icon */}
          <IconButton onClick={handleProfileClick} color="primary">
            <AccountCircle fontSize="large" />
          </IconButton>

          {/* Profile Dropdown */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseProfileMenu} sx={{ mt: 1 }}>
            {!showProfileForm ? (
              <div>
                <MenuItem onClick={() => setShowProfileForm(true)}>Profile</MenuItem>
                <MenuItem onClick={handleOpenDialog}>Logout</MenuItem>
              </div>
            ) : (
              <div className="p-4 w-96">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Edit Profile</h2>
                <form className="grid grid-cols-2 gap-3">
                  {/* Left Column Inputs */}
                  <TextField label="Full Name" variant="outlined" size="small" fullWidth value={storedetails?.fullName || ""} />
                  <TextField label="Pan Number" variant="outlined" size="small" fullWidth value={storedetails?.pannumber || ""} />
                  <TextField label="Phone" variant="outlined" size="small" fullWidth value={storedetails?.mobileNumber || ""} />
                  <TextField label="Shop Name" variant="outlined" size="small" fullWidth value={storedetails?.pickupDetails?.shopName || ""} />

                  {/* Right Column Inputs */}
                  <TextField label="GSTNO" variant="outlined" size="small" fullWidth value={storedetails?.GSTIN || ""} />
                  <TextField label="Address" variant="outlined" size="small" fullWidth value={storedetails?.pickupDetails?.address || ""} />
                  <TextField label="Pin Code" variant="outlined" size="small" fullWidth value={storedetails?.pickupDetails?.pickupCode || ""} />
                  <TextField label="Description" variant="outlined" size="small" fullWidth value={storedetails?.storeDescription || ""} />
                </form>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="contained" color="primary" onClick={handleCloseProfileMenu}>Save</Button>
                  <Button variant="outlined" color="error" onClick={() => setShowProfileForm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </Menu>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
