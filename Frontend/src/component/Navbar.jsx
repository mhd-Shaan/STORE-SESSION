import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const Navbar = () => {
  const [open, setOpen] = useState(false); // State for showing the dialog
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Open the confirmation dialog
  const handleOpenDialog = () => setOpen(true);

  // Close the confirmation dialog
  const handleCloseDialog = () => setOpen(false);

  // Logout and close the dialog
  const handleLogout = () => {
    // navigate('/'); // Navigate to the login page
    // setOpen(false); // Close the dialog after logout action
  };

  return (
    <>
      <header className="bg-white shadow-md w-full h-16 flex items-center px-6 justify-between z-40">
        <h1 className="text-lg font-semibold text-gray-800">Store Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleOpenDialog} color="error" variant="contained">
            Logout
          </Button>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
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