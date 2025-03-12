import Stores from "../models/storeSchema.js";
import OTPVerification from "../models/otpschema.js";
import authHelper from "../helpers/auth.js";
import { sendOTP } from "../helpers/emailService.js";
import Tempstores from "../models/tempstoreSchema.js";
import jwt from "jsonwebtoken";

const { hashPassword, comparePassword,compareMobileNumber } = authHelper;

export const StoreRegestration1 = async (req, res) => {
  try {
    const { email, mobileNumber,Gst } = req.body;

    if (!mobileNumber)
      return res.status(400).json({ error: "Mobile number is required" });
    if (!mobileNumber || mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      return res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
  }
      if (!email) return res.status(400).json({ error: "Email is required" });
   
    const existingStoreTemp = await Tempstores.findOne({ email });
    console.log("existing temp", existingStoreTemp);

    const existingStore = await Stores.findOne({ email });
    if (existingStore)
      return res
        .status(400)
        .json({ error: "This store is already registered" });

    // Delete existing temporary store
    await OTPVerification.deleteOne({ email });

  

    const mobilenumber = await Stores.findOne({ mobileNumber });
    if (mobilenumber) {
      return res
        .status(400)
        .json({ error: "this mobile number already exist" });
    }
    const gstnumbeer = await Stores.findOne({ Gst });
    if (gstnumbeer) return res.status(400).json({ error: "this GSTIN already exist" });
    
    const storedetails = await Tempstores.findOne({
      email,
      isOTPVerified: true,
    });
    if (storedetails) {
      const newUser = new Stores({
        mobileNumber,
        email: storedetails.email,
        Gst,
      });
    
      await newUser.save();
    } 
     else {
      return res.status(400).json({ error: "OTP is not verified" });
    }

    await Tempstores.deleteOne({ email });

    res.status(200).json({ message: "1st step completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing store registration." });
  }
};

export const otpsending = async (req, res) => {
  try {
    const { email } = req.body;
    const store = await Stores.findOne({email})
    const otp = await OTPVerification.findOne({email})
    if(!email) return res.status(400).json({error:"email required"})
if(otp){
  await OTPVerification.deleteOne({ email });
}
    if(store) return res.status(404).json({error:"this store already registred"})
    await sendOTP(email, "store");
    res.status(200).json({ message: "otp sended" });
  } catch (error) {
    res.status(500).json({ error: "otp sending failed" });
  }
};

export const verifyOTPforStore = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const type = "store"; // Ensure it's checking only store OTPs

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!otp) return res.status(400).json({ error: "OTP is required" });

    const otpRecord = await OTPVerification.findOne({ email });
console.log(otpRecord);

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    // Mark store as OTP verified
    const tempStore = new Tempstores({ email, isOTPVerified: true });
    await tempStore.save();
    console.log(tempStore);

    await OTPVerification.deleteOne({ email });

    res.status(200).json({ message: "Store OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP." });
    console.log(error);
  }
};

export const StoreRegestration2 = async (req, res) => {
  try {
    // const { id } = req.params;

    const { email,password, fullName, shopName } = req.body;
    if (!password)
      return res.status(400).json({ error: "password is required" });
    if (password < 6)
      return res.status(400).json({ error: "password minimum 6 digit" });
    if (!fullName)
      return res.status(400).json({ error: "Full Name is required" });
    if (!shopName)
      return res.status(400).json({ error: "ShopName is required" });

    const stores = await Stores.findOne({email});
    if (!stores) {
      return res.status(404).json({ error: "stores not found" });
    }
    const hashedPassword = await hashPassword(password);

    stores.fullName = fullName;
    stores.password = hashedPassword;
    stores.shopName = shopName;

    await stores.save();

    res.status(200).json({ message: "Store 2nd step completed" });
  } catch (error) {
    res.status(500).json({ message: "error completing step 2." });
    console.log(error);
  }
};

export const StoreRegestration3 = async (req, res) => {
  try {
    const { id } = req.params;

    const {email, GSTIN, shopName, pickupCode, address, storeDescription } = req.body;
    if (!GSTIN) return res.status(400).json({ error: "GSTIN is required" });
    if (!shopName)
      return res.status(400).json({ error: "shopname is required" });
    if (!address) return res.status(400).json({ error: "address is required" });
    if (!storeDescription)
      return res.status(400).json({ error: "storedescrption is required" });
    if (!pickupCode)
      return res.status(400).json({ error: "pickup code is required" });
const gst = await Stores.findOne({GSTIN})
if(gst) return res.status(400).json({error:"this gst is already exist"})
    const stores = await Stores.findOne({email});
    if (!stores) {
      return res.status(404).json({ error: "stores not found" });
    }
    stores.GSTIN = GSTIN;
    stores.pickupDetails.shopName = shopName;
    stores.pickupDetails.pickupCode = pickupCode;
    stores.pickupDetails.address = address;
    stores.storeDescription = storeDescription;

    await stores.save();

    res.status(200).json({ message: "regstration  completed" });
  } catch (error) {
    res.status(500).json({ message: "error completing step 3." });
    console.log(error);
  }
};


export const StoreLogin = async(req,res)=>{
  try {
    const {email,password,mobilenumber} = req.body
    if(!email) return res.status(400).json({error:"email is requried"})
      const Store = await Stores.findOne({email})
    if(!Store) return res.status(400).json({error:"this email is not registred"})

    if(!password) return res.status(400).json({error:"password is requried"})
      if(password < 6) return res.status(400).json({error:"password must be 6-digit "})

        const match = await comparePassword(password,Store.password)
if(!match) return res.status(403).json({error:"Enter correct password"})

    if(!mobilenumber) return res.status(400).json({error:"mobilenumber is requried"})

if (!mobilenumber || mobilenumber.length !== 10 || isNaN(mobilenumber)) {
    return res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
}
const matchnumber = await compareMobileNumber(mobilenumber,Store.mobileNumber)
    if(!matchnumber) return res.status(403).json({error:"Enter correct mobilenumber"})

      if (Store.isBlocked)
        return res.status(403).json({ error: "Your account is blocked. Contact support."  });

      jwt.sign({id:Store.id},process.env.jwt_SECRET,{},(err,token)=>{
        if(err) throw err;
    
    
        res.cookie("token", token, {
          httpOnly: true,   // Prevents client-side JavaScript access
          secure: true,     // Ensures cookies are sent only over HTTPS (set to false in development)
          sameSite: "Strict", // Helps prevent CSRF attacks
          maxAge: 3600000,  // 1 hour expiry
      });
    
        res.status(200).json({
          success: true,
          message: "Login successful",
          userdetails: {
              Store,
          },
          token,
      });
      })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error login" });

  }
}

export const FakeAuth = async(req,res)=>{
  try {
    console.log("controll", req.Store);
    res.status(200).json(req.Store);
    
  } catch (error) {
    console.log("error from checkAuth", error.message);
    res.status(500).json({ msg: error.message });
  }
}

export const logoutStore = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" }); // Ensure it matches the token name
    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Error from logoutStore:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
