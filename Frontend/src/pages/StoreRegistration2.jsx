import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateRegistrationStep } from "../redux/storeslice.js";

export default function StoreRegistration2() {
  const [data, setData] = useState({ password: "", fullName: "", pannumber: "" });
  const [files, setFiles] = useState([]);

  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  dispatch(updateRegistrationStep(3));

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", data.password);
      formData.append("fullName", data.fullName);
      formData.append("pannumber", data.pannumber);

      files.forEach((file) => formData.append("files", file)); // Append selected PDF files

      await axios.post("http://localhost:5000/store/register2", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Step 2 completed");
      navigate("/Storeregstration3", { state: { email } });
    } catch (error) {
      console.error("Error during step 2:", error);
      toast.error(error.response?.data?.error || "Failed to complete step 2");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-lg p-6 bg-gray-100 rounded-lg shadow-lg">
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

        <div className="mt-4 text-center">
          <h2 className="mt-2 text-xl font-semibold">Almost there...</h2>
          <p className="text-sm text-gray-600">We need these details to set up your account. You can also choose to fill them in the next step.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-6 space-y-4">
            <Input
              type="password"
              placeholder="Create Password"
              className="w-full"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Enter Your Full Name"
              className="w-full"
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Enter PanCardNumber"
              className="w-full"
              onChange={(e) => setData({ ...data, pannumber: e.target.value })}
            />

            {/* PDF File Upload */}
            <input
              type="file"
              multiple
              accept=".pdf" // Only PDF files
              onChange={handleFileChange}
              className="block w-full mt-2"
            />

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-200 p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)}>
                      <XCircle size={18} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
