import mongoose from "mongoose";

const tempstoreSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true,
  },
  mobileNumber: {
    type: String,
    unique: true,
  },
  GSTIN: {
    type: String,
    sparse: true,
    unique: true,
  },
  password: {
    type: String,
  },
  fullName: {
    type: String,
  },
  pannumber: {
    type: String,
  },
  pickupDetails: {
    shopName:{
      type:String,
    },
    pickupCode: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  storeDescription: {
    type: String,
  },
  documentImage: {
    type: String, // Store image URL or file path
  },
  isBlocked: {
    type: Boolean,
    default: false, // Store is not blocked by default
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Default status is pending
  },
  isOTPVerified:
   { type: Boolean,
     default: false 
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 const Tempstoresschema =  mongoose.model("TempStores", tempstoreSchema);
 export default Tempstoresschema