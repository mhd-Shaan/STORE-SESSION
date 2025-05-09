import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  TextField,
} from "@mui/material";
import { AccountCircle, Notifications } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutstore } from "@/redux/storeslice";

const Navbar = () => {
  const [storedetails, setStoredetails] = useState({
    fullName: "",
    pannumber: "",
    mobileNumber: "",
    pickupDetails: {
      shopName: "",
      address: "",
      pickupCode: "",
    },
    GSTIN: "",
    storeDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { store } = useSelector((state) => state.store);

  useEffect(() => {
    setStoredetails(store);
  }, [store]);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/store/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logout successful");
      dispatch(logoutstore());
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

  // ✅ Validate form fields
  const validate = () => {
    const newErrors = {};
    if (!storedetails.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!storedetails.pannumber)
      newErrors.pannumber = "Invalid PAN number";
    if (!storedetails.mobileNumber.match(/^\d{10}$/))
      newErrors.mobileNumber = "Invalid mobile number";
    if (!storedetails.pickupDetails.shopName.trim())
      newErrors.shopName = "Shop Name is required";
    if (!storedetails.pickupDetails.address.trim())
      newErrors.address = "Address is required";
    if (!storedetails.pickupDetails.pickupCode.match(/^\d{6}$/))
      newErrors.pickupCode = "Pin Code must be 6 digits";
    if (!storedetails.GSTIN)
      newErrors.GSTIN = "Invalid GSTIN";
    if (!storedetails.storeDescription.trim())
      newErrors.storeDescription = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = async () => {
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await axios.put("http://localhost:5000/store/editstore", storedetails, {
        withCredentials: true,
      });
      toast.success("Edited successfully");
      setShowProfileForm(false);
      setAnchorEl(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating store");
      console.log(error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md w-full h-16 flex items-center px-6 justify-between z-40">
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

        <div className="flex items-center space-x-4">
          <IconButton color="primary">
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleProfileClick} color="primary">
            <AccountCircle fontSize="large" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseProfileMenu}
            sx={{ mt: 1 }}
          >
            {!showProfileForm ? (
              <div>
                <MenuItem onClick={() => setShowProfileForm(true)}>Profile</MenuItem>
                <MenuItem onClick={handleOpenDialog}>Logout</MenuItem>
              </div>
            ) : (
              <div className="p-4 w-96">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Edit Profile
                </h2>
                <form className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.fullName}
                    onChange={(e) =>
                      setStoredetails({ ...storedetails, fullName: e.target.value })
                    }
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                  />
                  <TextField
                    label="Pan Number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.pannumber}
                    onChange={(e) =>
                      setStoredetails({ ...storedetails, pannumber: e.target.value })
                    }
                    error={!!errors.pannumber}
                    helperText={errors.pannumber}
                  />
                  <TextField
                    label="Phone"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.mobileNumber}
                    onChange={(e) =>
                      setStoredetails({ ...storedetails, mobileNumber: e.target.value })
                    }
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                  />
                  <TextField
                    label="Shop Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.pickupDetails.shopName}
                    onChange={(e) =>
                      setStoredetails({
                        ...storedetails,
                        pickupDetails: {
                          ...storedetails.pickupDetails,
                          shopName: e.target.value,
                        },
                      })
                    }
                    error={!!errors.shopName}
                    helperText={errors.shopName}
                  />
                  <TextField
                    label="GSTNO"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.GSTIN}
                    onChange={(e) =>
                      setStoredetails({ ...storedetails, GSTIN: e.target.value })
                    }
                    error={!!errors.GSTIN}
                    helperText={errors.GSTIN}
                  />
                  <TextField
                    label="Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.pickupDetails.address}
                    onChange={(e) =>
                      setStoredetails({
                        ...storedetails,
                        pickupDetails: {
                          ...storedetails.pickupDetails,
                          address: e.target.value,
                        },
                      })
                    }
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                  <TextField
                    label="Pin Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.pickupDetails.pickupCode}
                    onChange={(e) =>
                      setStoredetails({
                        ...storedetails,
                        pickupDetails: {
                          ...storedetails.pickupDetails,
                          pickupCode: e.target.value,
                        },
                      })
                    }
                    error={!!errors.pickupCode}
                    helperText={errors.pickupCode}
                  />
                  <TextField
                    label="Description"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={storedetails.storeDescription}
                    onChange={(e) =>
                      setStoredetails({ ...storedetails, storeDescription: e.target.value })
                    }
                    error={!!errors.storeDescription}
                    helperText={errors.storeDescription}
                  />
                </form>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="contained" color="primary" onClick={handleEdit}>
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setShowProfileForm(false)}
                  >
                    Cancel
                  </Button>
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
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
