import { Request, Response } from "express";
import User from "../../models/user";
import sendSms from "../../utils/sms/send.sms";
import { generateQRCode } from "../../utils/qr/generate.qr";
import sendWhatsapp from "../../utils/whatsapp/send.whatsapp";

// Add a new user
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, mobileNumber, members } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    // Create a new user
    const newUser = new User({ name, mobileNumber, members });
    await newUser.save();

    await generateQRCode(
      `${process.env["BACKEND_URL"]}/files/qr/${newUser._id}.png`,
      `${newUser._id}.png`
    );

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile } = req.params;

    // Check if the user already exists
    const existingUser = await User.findOne({ mobileNumber: mobile });
    if (existingUser) {
      res.status(200).json(existingUser);
      return;
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user by mobile number
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { mobileNumber } = req.params;
    const updates = req.body;

    // Update user
    const updatedUser = await User.findOneAndUpdate({ mobileNumber }, updates, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    } else {
      await sendWhatsapp({
        password: process.env["X-CLIENT-PASSWORD"]!,
        userId: process.env["X-CLIENT-ID"]!,
        from: "918015500800",
        to: mobileNumber,
        text: `Hi, Welcome To the Event.\n
              #Note: THis ticket is unique to you.\n
              Do not share!!`,
        mediadata: `${process.env["BACKEND_URL"]}/files/qr/${updatedUser._id}.png`,
      });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send OTP to user (and update DB)
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobileNumber } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Find user and update OTP
    const user = await User.findOneAndUpdate(
      { mobileNumber },
      { otp },
      { new: true, upsert: true }
    );

    try {
      const result = await sendSms({
        token: "2bb27d4aa475f37d60fa804608835100",
        credit: "2",
        sender: "ADlTYA",
        message: `Dear User Your OTP is ${otp} Thank You Adithya Ads`,
        number: mobileNumber + "",
        templateid: "1707165252219574367",
      });

      console.log(`Sending OTP ${otp} to ${mobileNumber}`);
      res.status(200).json({ message: "otp sent" });
    } catch (error) {
      res.status(500).send("Failed to send SMS.");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkOtp = async (req: Request, res: Response) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      res.status(400).json({ message: "mobileNumber and otp are required" });
    }

    const user = await User.findOne({ mobileNumber, otp });

    if (!user) {
      res.status(401).json({ message: "Invalid OTP or mobile number" });
    } else {
      // Optional: clear OTP after verification
      user.otp = undefined;
      await user.save();

      res.status(200).json({ message: "OTP verified successfully", user });
    }
  } catch (err) {
    console.error("OTP check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
