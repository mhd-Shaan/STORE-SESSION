import jwt from "jsonwebtoken"
import Stores from "../models/storeSchema.js";

const protectRouteStore = async (req, res, next) => {
  console.log("protectRoute middleware triggered");

  try {
    console.log(req.cookies);
    
    const token = req.cookies?.token// Ensure token is read properly
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }

const Storedata = await Stores.findById(decoded.id)


if (Storedata.isBlocked) {  
  return res.status(400).json({ error: "admin blocked you" }); // ✅ Added return
}

  req.Store = Storedata;

      next();

  } catch (error) {
    console.error("Error from protectRoute:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export { protectRouteStore };