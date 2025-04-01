import express from 'express';
// import {protectRouteuser} from '../middleware/authmiddleware.js'
import {  CheckingOtp, FakeAuth, logoutStore, Otpsend, otpsending, StoreLogin, StoreRegestration1, StoreRegestration2, StoreRegestration3, updatePassword, verifyOTPforStore } from '../controllers/storeController.js';
import { protectRouteStore } from '../middleware/authmiddleware.js';
import { addProduct, blockunblockproduct, DeleteProduct, Editproduct, showProduct } from '../controllers/productController.js';
import  {upload, storeUpload } from '../config/multer.js';

const router = express.Router();

router.post("/register1",StoreRegestration1)
router.post("/otp-verificaton",verifyOTPforStore)
router.post("/otp-number",otpsending)
router.post("/register2",storeUpload.array('files',5),StoreRegestration2)
router.post("/register3",StoreRegestration3)
router.post('/loginstore',StoreLogin)
router.get("/fakeauth",protectRouteStore,FakeAuth)
router.post('/logout',logoutStore)
router.post("/addproduct",protectRouteStore,upload.array("images", 5), addProduct);
router.get('/showproducts',protectRouteStore,showProduct)
router.put('/editproduct/:id',protectRouteStore,upload.array("images", 5),Editproduct)
router.put('/block-unblock/:id',protectRouteStore,blockunblockproduct)
router.delete('/deleteproduct/:id',protectRouteStore,DeleteProduct)
router.post('/send-otp',Otpsend)
router.post('/verify-otp',CheckingOtp)
router.post('/forget-password',updatePassword)
export default router;