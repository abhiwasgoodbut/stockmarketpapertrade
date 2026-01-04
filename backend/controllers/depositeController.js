import Deposit from "../models/depositeModel.js";
import cloudinary from "../config/cloudinary.js";

export const createDeposit = async (req, res) => {
  try {
    const user = req.user;
    const { amount, utr } = req.body;

    if (!amount || !utr || !req.file) {
      return res.json({
        success: false,
        message: "Amount, UTR and screenshot required"
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "deposits" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Save in DB
    const deposit = await Deposit.create({
      user: user._id,
      amount,
      utr,
      screenshot: uploadResult.secure_url
    });

    res.json({
      success: true,
      message: "Deposit request submitted",
      deposit
    });

  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getDepositHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const deposits = await Deposit.find({ user: userId })
      .sort({ createdAt: -1 }); // latest first

    return res.json({
      success: true,
      deposits
    });

  } catch (error) {
    console.error("Deposit history error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load deposit history"
    });
  }
};