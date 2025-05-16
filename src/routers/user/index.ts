import express from "express";
import {
  addUser,
  sendOtp,
  updateUser,
  getUser,
  checkOtp,
} from "../../controllers/user";

const router = express.Router();

// POST route to add a new user
router.post("/add", addUser);

router.get("/:mobile", getUser);

// PUT route to update an existing user by mobile number
router.put("/update/:mobileNumber", updateUser);

// POST route to send OTP
router.post("/send-otp", sendOtp);

router.post("/check-otp", checkOtp);

export default router;
