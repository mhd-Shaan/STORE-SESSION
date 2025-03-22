import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import { CheckCircle, Circle, Loader2 } from "lucide-react"; // Icons from lucide-react
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateRegistrationStep } from "../redux/storeslice.js"
import { useDispatch } from "react-redux";


export default function StoreRegstration2() {
    const [data,setData]=useState({
        password:"",
        fullName:"",
        shopName:""
    })
    const location = useLocation();
    const email = location.state?.email || ""; 
const navigate = useNavigate()
const dispatch = useDispatch();
dispatch(updateRegistrationStep(3));


    const handleSubmit = async(e)=>{
        e.preventDefault();
          try {
            const res = await axios.post(`http://localhost:5000/store/register2`, {
                ...data,  // Existing form data
                email     // Adding email
            })
                toast.success("second step completed")
                navigate("/Storeregstration3", { state: { email } }); // Use email variable

        } catch (error) {
            console.error("Error during step2:", error);
           toast.error(error.response?.data?.error || "Failed to step2");
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-lg p-6 bg-gray-100 rounded-lg shadow-lg">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle size={18} />
            <span>EMAIL ID & GST</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Circle size={18} />
            <span>PASSWORD CREATION</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            <span>ONBOARDING DASHBOARD</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mt-4 text-center">
          <h2 className="mt-2 text-xl font-semibold">Almost there...</h2>
          <p className="text-sm text-gray-600">
            We need these details to set up your account. You can also choose to fill them in the next step.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit}> 
        <div className="mt-6 space-y-4">
          <Input type="password" placeholder="Create Password" className="w-full"  onChange={(e)=>setData({...data,password:e.target.value})} />
          <Input type="text" placeholder="Enter Your Full Name" className="w-full"  onChange={(e)=>setData({...data,fullName:e.target.value})} />
          <Input type="text" placeholder="Enter Store Name" className="w-full" onChange={(e)=>setData({...data,shopName:e.target.value})} />
        </div>

        {/* Button */}
        <div className="mt-6 text-center">
          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Continue →
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
}
