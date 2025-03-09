import express from 'express';
// import {protectRouteuser} from '../middleware/authmiddleware.js'
import {  FakeAuth, otpsending, StoreLogin, StoreRegestration1, StoreRegestration2, StoreRegestration3, verifyOTPforStore } from '../controllers/storeController.js';
import { protectRouteStore } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post("/register1",StoreRegestration1)
router.post("/otp-verificaton",verifyOTPforStore)
router.post("/otp-number",otpsending)
router.post("/register2",StoreRegestration2)
router.post("/register3",StoreRegestration3)
router.post('/loginstore',StoreLogin)
router.get("/fakeauth",protectRouteStore,FakeAuth)
export default router;