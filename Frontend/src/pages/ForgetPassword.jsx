import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Send, Refresh, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Forgetpassword = ({ email: initialEmail, onComplete }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (resendTimer > 0 && step === 2) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer, step]);


  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/store/send-otp", { email });
      setSuccess("OTP sent successfully!");
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/store/verify-otp", {
        email,
        otp: otpCode,
      });
      setSuccess("OTP verified successfully!");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/store/send-otp", { email });
      setSuccess("New OTP sent successfully!");
      setResendTimer(30);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/store/forget-password", {
        email,
        password,
        confirmPassword,
      });
      setSuccess("Password set successfully!");
      if (onComplete) onComplete();
        navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Paper className="w-full max-w-md p-6 md:p-8 rounded-lg shadow-lg">
        <Typography
          variant="h5"
          className="text-center font-bold mb-6 text-gray-800"
        >
          {step === 1
            ? "Enter Your Email"
            : step === 2
            ? "Verify OTP"
            : "Set New Password"}
        </Typography>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full 
                  ${
                    step === stepNumber
                      ? "bg-blue-600 text-white"
                      : step > stepNumber
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      step > stepNumber ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error/Success messages */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="mb-4">
            {success}
          </Alert>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-4">
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Allows change only if "admin" is false
              type="email"
              className="mb-4"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSendOtp}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Send />
                )
              }
              className="h-12"
            >
              Send OTP
            </Button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <Typography
              variant="body1"
              className="text-center text-gray-600 mb-4"
            >
              We've sent a 6-digit code to{" "}
              <span className="font-semibold">{email}</span>
            </Typography>

            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.25rem" },
                  }}
                  variant="outlined"
                  className="w-12"
                />
              ))}
            </div>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleVerifyOtp}
              disabled={loading || otp.join("").length !== 6}
              className="h-12 mb-4"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify OTP"
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || loading}
              startIcon={<Refresh />}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </Button>
          </div>
        )}

        {/* Step 3: Password Setup */}
        {step === 3 && (
          <div className="space-y-4">
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
              helperText="Minimum 6 characters"
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-6"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSetPassword}
              disabled={
                loading || password.length < 6 || password !== confirmPassword
              }
              className="h-12"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Set Password"
              )}
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default Forgetpassword;