import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation
import {toast} from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { updateRegistrationStep } from "../redux/storeslice.js";

const StoreRegstration1 = () => {
  const [StoreData, setStoreData] = useState({
    mobileNumber: "",
    email: "",
    Gst: "",
  });
  const [registrationData, setRegistrationData] = useState(null); // Stores registration data for OTP verification
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "","",""]);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(300);

const navigate = useNavigate()
const dispatch = useDispatch();


  const Register1 = async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/store/register1", StoreData); 
      toast.success(res.data.msg || "register completed 1")
   setRegistrationData(StoreData)
   dispatch(updateRegistrationStep(2));
   navigate("/Storeregstration2", { state: { email: StoreData.email } });

  } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.error || "Failed to register");
    }
  }

  

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow only numbers
    let newOtp = [...otp];

    // Handle Backspace
    if (value === "" && index > 0) {
      newOtp[index] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if a number is entered
      if (value !== "" && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  const sendOtp =async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/store/otp-number', {
        email: StoreData.email, // Send as an object
      });
        toast.success('otp-sended')
      setShowOtpField(true);
    setOtpSent(true);
    setTimer(300); // Reset timer
    startTimer();
     
    } catch (error) {
      console.error("Error during otp-send:", error);
      toast.error(error.response?.data?.error || "Failed to otp-send");
    }
    
    
  };

  // const resendOtp = () => {
  //   setOtp(["", "", "", "","",""]);
  //   setTimer(300);
  //   startTimer();
  // };

  const startTimer = () => {
    let countdown = 300;
    const interval = setInterval(() => {
      countdown--;
      setTimer(countdown);
      if (countdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

   // Function to verify OTP
   const handleVerifyOtp = async () => {
    const enteredOtp = otp.join(""); // Combine OTP digits
    if (enteredOtp.length < 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/store/otp-verificaton", {
        email: StoreData.email,
        otp: enteredOtp,
      });

        toast.success("OTP Verified Successfully!");
        setShowOtpField(false);

      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.error || "Failed to otp-send");
    }
  };

 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Seller Registration
      </h2>

      {/* Form Fields */}
      <form onSubmit={Register1}>
        <div className="space-y-4">
          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="flex">
              <input
                type="email"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={StoreData.email}
                onChange={(e) => setStoreData({ ...StoreData, email: e.target.value })}
                placeholder="Enter Email"
              />
              <button
                type="button"
                onClick={sendOtp}
                className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">MobileNumber</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={StoreData.mobileNumber}
              onChange={(e) => setStoreData({ ...StoreData, mobileNumber: e.target.value })}
              placeholder="Enter MobileNumber "
            />
          </div>

          {/* GSTIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter GSTIN</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={StoreData.Gst}
              onChange={(e) => setStoreData({ ...StoreData, Gst: e.target.value })}
              placeholder="Enter GSTIN"
            />
            <p className="text-xs text-gray-500 mt-1">
              GSTIN is required to sell products. You can also share it in the final step.
            </p>
          </div>
        </div>

        {/* OTP Section */}
        {showOtpField && (
          <div className="bg-gray-50 p-4 rounded-md shadow-md transition-all mt-4">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Enter OTP
            </label>
            <div className="flex justify-center gap-2 mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="mt-3 text-sm text-gray-500 text-center">
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <button
                  onClick={sendOtp}
                  className="text-blue-500 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Verify OTP Button */}
            <button
              onClick={handleVerifyOtp}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* Terms & Register Button */}
        <div className="mt-4 text-center text-sm text-gray-500">
          By continuing, I agree to the{" "}
          <a href="#" className="text-blue-500 underline">
            Terms of Use & Privacy Policy
          </a>.
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Register & Continue
        </button>
      </form>
    </div>
  </div>

  );
};



export default StoreRegstration1