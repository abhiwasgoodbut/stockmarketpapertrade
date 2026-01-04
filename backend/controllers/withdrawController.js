import Withdraw from "../models/withdrawModel.js";
import User from "../models/userModel.js";

export const createWithdrawRequest = async (req, res) => {
  try {
    const user = req.user;
    const {
      method,
      upiId,
      beneficiaryName,
      accountNumber,
      ifsc,
      amount
    } = req.body;

    if (!method || !amount || amount <= 0) {
      return res.json({
        success: false,
        message: "Invalid withdrawal request"
      });
    }

    if (user.balance < amount) {
      return res.json({
        success: false,
        message: "Insufficient balance"
      });
    }

    // Method validation
    if (method === "UPI" && !upiId) {
      return res.json({
        success: false,
        message: "UPI ID required"
      });
    }

    if (
      method === "BANK" &&
      (!beneficiaryName || !accountNumber || !ifsc)
    ) {
      return res.json({
        success: false,
        message: "Complete bank details required"
      });
    }

    // 🔒 Lock balance immediately
    user.balance -= amount;
    await user.save();

    await Withdraw.create({
      user: user._id,
      method,
      upiId,
      beneficiaryName,
      accountNumber,
      ifsc,
      amount
    });

    res.json({
      success: true,
      message: "Withdrawal request submitted"
    });
  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getMyWithdrawHistory = async (req, res) => {
  try {
    const user = req.user;

    const withdrawals = await Withdraw.find({ user: user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      withdrawals
    });
  } catch (error) {
    console.error("Withdraw history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};