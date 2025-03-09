import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  EnvelopeIcon,
  PencilIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/solid";
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
  });
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/store/register3`, {
        ...data, // Existing form data
        email, // Adding email
      });
      toast.success("regestration completed");
      navigate("/Storelogin");
    } catch (error) {
      console.error("Error during step3:", error);
      toast.error(error.response?.data?.error || "failed to step 3");
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
          <p className="text-gray-600"> Verification</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-2">
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700 break-all">{email}</p>
          </div>
        </div>

        {/* GSTIN Input */}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Enter GSTIN
            </label>
            <Input
              type="text"
              onChange={(e) => setData({ ...data, GSTIN: e.target.value })}
              placeholder="Enter GSTIN"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              GSTIN is required to sell products on SpareCart.
            </p>
          </div>

          {/* Signature Section */}
          {/* <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Add Your e-Signature</p>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-2 gap-2">
                        <Button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
                            <PencilIcon className="h-5 w-5 text-white" />
                            <span>Draw your Signature</span>
                        </Button>
                        <span className="text-gray-500 hidden md:inline">OR</span>
                        <Button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
                            <FingerPrintIcon className="h-5 w-5 text-white" />
                            <span>Choose your Signature</span>
                        </Button>
                    </div>
                </div> */}

          {/* Store & Pickup Details */}
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Store & Pickup Details
            </p>
            <Input
              onChange={(e) => setData({ ...data, shopName: e.target.value })}
              type="text"
              placeholder="Enter Shop Name"
            />
            <Input
              onChange={(e) => setData({ ...data, address: e.target.value })}
              type="text"
              placeholder="Enter Address"
            />
            <Input
              onChange={(e) =>
                setData({ ...data, storeDescription: e.target.value })
              }
              type="text"
              placeholder="Enter Store Description"
            />
            <Input
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
