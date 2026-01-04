// import Withdraw from "../models/withdrawModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Deposit from "../models/depositeModel.js";
import Withdraw from "../models/withdrawModel.js";
import Position from "../models/positionModel.js";
import Trade from "../models/tradeModel.js";
// import User from "../models/userModel.js";


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password required"
      });
    }

    // 🔐 Validate from ENV
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    // 🎟️ Create ADMIN token
    const token = jwt.sign(
      { role: "ADMIN", email },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const verifyAdmin = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        email: req.admin.email
      }
    });
  } catch {
    res.json({ success: false });
  }
};


export const adminDashboard = async (req, res) => {
  try {
    // USERS
    const totalUsers = await User.countDocuments();

    // TOTAL USER BALANCE
    const balanceAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } }
    ]);
    const totalBalance = balanceAgg[0]?.total || 0;

    // DEPOSITS
    const totalDeposits = await Deposit.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // WITHDRAWALS
    const totalWithdrawals = await Withdraw.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // OPEN POSITIONS
    const openPositions = await Position.countDocuments({
      status: "OPEN"
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBalance,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        openPositions
      }
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};





/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ================= UPDATE USER (EDIT EVERYTHING) ================= */
export const updateUser = async (req, res) => {
  try {
    const {
      name,
      username,
      number,
      password,
      balance,
      termsAccepted
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ DIRECT ASSIGN (PLAIN TEXT)
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (number !== undefined) user.number = number;
    if (password !== undefined) user.password = password;
    if (balance !== undefined) user.balance = Number(balance);
    if (termsAccepted !== undefined)
      user.termsAccepted = termsAccepted;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate("user", "name username number balance")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      deposits
    });
  } catch (error) {
    console.error("Admin get deposits error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ================= UPDATE DEPOSIT STATUS ================= */
export const updateDepositStatus = async (req, res) => {
  try {
    const { depositId } = req.params;
    const { status, adminRemark } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status"
      });
    }

    const deposit = await Deposit.findById(depositId);

    if (!deposit) {
      return res.json({
        success: false,
        message: "Deposit not found"
      });
    }

    // ❌ Prevent double processing
    if (deposit.status !== "pending") {
      return res.json({
        success: false,
        message: "Deposit already processed"
      });
    }

    // ✅ CREDIT USER ONLY IF APPROVED
    if (status === "approved") {
      const user = await User.findById(deposit.user);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found"
        });
      }

      user.balance += deposit.amount;
      await user.save();
    }

    // 🔄 Update deposit
    deposit.status = status;
    deposit.adminRemark = adminRemark || "";
    await deposit.save();

    res.json({
      success: true,
      message: `Deposit ${status} successfully`
    });
  } catch (error) {
    console.error("Admin update deposit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find()
      .populate("user", "name username number")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      withdraws
    });
  } catch (error) {
    console.error("Admin get withdraw error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const updateWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status"
      });
    }

    const withdraw = await Withdraw.findById(id).populate("user");

    if (!withdraw) {
      return res.json({
        success: false,
        message: "Withdraw request not found"
      });
    }

    if (withdraw.status !== "PENDING") {
      return res.json({
        success: false,
        message: "Already processed"
      });
    }

    // 🔁 REFUND IF REJECTED
    if (status === "REJECTED") {
      withdraw.user.balance += withdraw.amount;
      await withdraw.user.save();
    }

    withdraw.status = status;
    withdraw.remark = remark || "";
    await withdraw.save();

    res.json({
      success: true,
      message: `Withdraw ${status.toLowerCase()}`
    });

  } catch (error) {
    console.error("Withdraw update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// controllers/tradeController.js



// controllers/adminTradeController.js


export const getAllTradesAdmin = async (req, res) => {
  try {
    const trades = await Trade.find()
      .populate("user", "name username number")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      trades
    });
  } catch (error) {
    console.error("Admin trades error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getTradeStatsAdmin = async (req, res) => {
  try {
    const totalTrades = await Trade.countDocuments();

    const totalBuy = await Trade.countDocuments({ side: "BUY" });
    const totalSell = await Trade.countDocuments({ side: "SELL" });

    const totalPnlAgg = await Trade.aggregate([
      { $group: { _id: null, totalPnl: { $sum: "$pnl" } } }
    ]);

    res.json({
      success: true,
      totalTrades,
      totalBuy,
      totalSell,
      totalPnl: totalPnlAgg[0]?.totalPnl || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};