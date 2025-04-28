import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function StoreRegistration3() {
  const [data, setData] = useState({
    GSTIN: "",
    shopName: "",
    storeDescription: "",
    pickupCode: "",
    address: "",
    city: "",
  });
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();

  // Fetch cities from backend
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await axios.get('http://localhost:5000/store/showcities'); 
        setCities(response.data.citys || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/store/register3`, {
        ...data,
        email,
      });
      toast.success("Registration completed");
      navigate("/Storelogin");
    } catch (error) {
      console.error("Error during step3:", error);
      toast.error(error.response?.data?.error || "Failed to complete step 3");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl border">
        {/* Header */}
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-gray-500">
            EMAIL ID & GST — PASSWORD CREATION — ONBOARDING DASHBOARD
          </p>
          <h2 className="text-2xl font-semibold text-gray-700 mt-2">Hello</h2>
          <p className="text-gray-600">Verification</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-2">
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700 break-all">{email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* GSTIN Input */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Enter GSTIN
            </label>
            <Input
              type="text"
              value={data.GSTIN}
              onChange={(e) => setData({ ...data, GSTIN: e.target.value })}
              placeholder="Enter GSTIN"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              GSTIN is required to sell products on SpareCart.
            </p>
          </div>

          {/* Store & Pickup Details */}
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Store & Pickup Details
            </p>

            <Input
              value={data.shopName}
              onChange={(e) => setData({ ...data, shopName: e.target.value })}
              type="text"
              placeholder="Enter Shop Name"
            />

            <Input
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              type="text"
              placeholder="Enter Address"
            />

            {/* City Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">City</label>
              <select
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingCities}
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
              {loadingCities && (
                <p className="text-xs text-gray-500">Loading cities...</p>
              )}
            </div>

            <Input
              value={data.storeDescription}
              onChange={(e) =>
                setData({ ...data, storeDescription: e.target.value })
              }
              type="text"
              placeholder="Enter Store Description"
            />

            <Input
              value={data.pickupCode}
              onChange={(e) => setData({ ...data, pickupCode: e.target.value })}
              type="text"
              placeholder="Enter Pickup Pincode"
            />
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-purple-700"
          >
            Save
          </Button>
        </form>
      </Card>
    </div>
  );
}
