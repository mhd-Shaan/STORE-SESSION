import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Outlet } from "react-router-dom"; // Added Outlet for child routes

function AdminPanel() {


  

  return (
    
    <div className="flex-1 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-600">Total Users</h3>
          <p className="text-xl font-bold">350</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-600">Total Stores</h3>
          <p className="text-xl font-bold">642</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-600">Total Orders</h3>
          <p className="text-xl font-bold">574</p>
          <span className="text-green-500">+42% since last month</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600">Monthly Bookings</h3>
          <p className="text-xl font-bold">2,579 Visitors</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600">Your Pie Chart</h3>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminPanel;