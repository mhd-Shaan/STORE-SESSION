import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginstore } from "@/redux/storeslice"; // Make sure your slice has loginstore

function StoreLogin() {
  const [StoreData, setStoreData] = useState({
    email: "",
    mobilenumber: "",
    password: "",
  });

  const [storeLocation, setLocalStoreLocation] = useState(null); // local state for store location

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, mobilenumber } = StoreData;

    try {
      // Login API
      const response = await axios.post(
        "http://localhost:5000/store/loginstore",
        { email, password, mobilenumber },
        { withCredentials: true } // send cookies automatically
      );
console.log(response);

      const store = response.data.userdetails.Store;

      if (store.status === "approved") {
        // Save store info to Redux
        dispatch(loginstore(store));

        // Fetch store location from backend (cookie-based auth)
        const locationRes = await axios.get(
          "http://localhost:5000/store/location",
          { withCredentials: true }
        );

        setLocalStoreLocation(locationRes.data.location);
        // Optional: save in Redux if you have slice for location
        // dispatch(setStoreLocation(locationRes.data.location));

        toast.success("Welcome back");
        navigate("/Adminpanel"); // or store dashboard
      } else if (store.status === "rejected") {
        toast.error("Admin rejected your login request");
        await axios.post(
          "http://localhost:5000/store/logout",
          {},
          { withCredentials: true }
        );
        navigate("/");
      } else {
        toast.error("Waiting for admin approval");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Store Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={StoreData.email}
                onChange={(e) =>
                  setStoreData({ ...StoreData, email: e.target.value })
                }
                placeholder="Enter Email"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={StoreData.mobilenumber}
                onChange={(e) =>
                  setStoreData({ ...StoreData, mobilenumber: e.target.value })
                }
                placeholder="Enter Mobile Number"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={StoreData.password}
                onChange={(e) =>
                  setStoreData({ ...StoreData, password: e.target.value })
                }
                placeholder="Enter Password"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forget-password"
                className="text-blue-500 hover:underline text-sm"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>

          <div className="flex flex-col items-center">
            <p className="mt-4">
              Don't have an account?{" "}
              <Link
                to="/Storeregstration1"
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StoreLogin;
