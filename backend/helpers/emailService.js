import nodemailer from "nodemailer";
import crypto from "crypto";
import OtpVerification from '../models/otpschema.js';

export const sendOTP = async (email, type) => {
  try {
    if (!email) throw new Error("Email is required");
    
    console.log(`Sending OTP to: ${email}`);

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 mins

    await OtpVerification.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // **Define the transporter inside the function**
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
   
        
      },
    });    

    // Verify the transporter
    transporter.verify((error, success) => {
      if (error) {
        console.error("Nodemailer Transporter Error:", error);
      } else {
        console.log("Mail server is ready to send emails");
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    const emailResponse = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully:", emailResponse);

    return { message: "OTP sent to email successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again.");
  }
};



