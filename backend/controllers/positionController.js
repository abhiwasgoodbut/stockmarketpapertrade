// controllers/positionController.js
import Position from "../models/positionModel.js";
import Trade from "../models/tradeModel.js";

export const getMyPositions = async (req, res) => {
  try {
    const positions = await Position.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      positions
    });
  } catch (error) {
    console.error("Position fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * Update live price for positions
 * (called periodically from frontend)
 */
export const updatePositionPrices = async (req, res) => {
  try {
    const { prices } = req.body;
    // prices = [{ symbol: "BANKNIFTY", price: 48120 }]

    if (!Array.isArray(prices)) {
      return res.json({ success: false });
    }

    for (const p of prices) {
      await Position.updateMany(
        {
          symbol: p.symbol,
          status: "OPEN"
        },
        {
          $set: {
            currentPrice: p.price,
            pnl: {
              $multiply: [
                { $subtract: [p.price, "$avgPrice"] },
                "$qty"
              ]
            }
          }
        }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const setSLTP = async (req, res) => {
  try {
    const user = req.user;
    const {
      positionId,
      stopLoss,
      takeProfit,
      slEnabled,
      tpEnabled
    } = req.body;

    if (!positionId) {
      return res.json({
        success: false,
        message: "Position ID required"
      });
    }

    const position = await Position.findOne({
      _id: positionId,
      user: user._id,
      status: "OPEN"
    });

    if (!position) {
      return res.json({
        success: false,
        message: "Open position not found"
      });
    }

    // ✅ Stop Loss
    if (slEnabled !== undefined) {
      position.slEnabled = slEnabled;
      position.stopLoss = slEnabled ? Number(stopLoss) : null;
    }

    // ✅ Take Profit
    if (tpEnabled !== undefined) {
      position.tpEnabled = tpEnabled;
      position.takeProfit = tpEnabled ? Number(takeProfit) : null;
    }

    await position.save();

    res.json({
      success: true,
      message: "SL / TP updated successfully",
      position
    });
  } catch (error) {
    console.error("SLTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const clearSLTP = async (req, res) => {
  try {
    const user = req.user;
    const { positionId } = req.body;

    const position = await Position.findOne({
      _id: positionId,
      user: user._id,
      status: "OPEN"
    });

    if (!position) {
      return res.json({
        success: false,
        message: "Open position not found"
      });
    }

    position.stopLoss = null;
    position.takeProfit = null;
    position.slEnabled = false;
    position.tpEnabled = false;

    await position.save();

    res.json({
      success: true,
      message: "SL / TP cleared"
    });
  } catch (error) {
    console.error("Clear SLTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const autoExitPosition = async (req, res) => {
  try {
    const user = req.user;
    const { positionId, exitPrice, reason } = req.body;

    if (!positionId || !exitPrice || !reason) {
      return res.json({
        success: false,
        message: "Invalid auto-exit request"
      });
    }

    // 1️⃣ Find OPEN position
    const position = await Position.findOne({
      _id: positionId,
      user: user._id,
      status: "OPEN"
    });

    if (!position) {
      return res.json({
        success: false,
        message: "Position already closed or not found"
      });
    }

    const price = Number(exitPrice);

    // 2️⃣ HARD VALIDATION (SECURITY)
    if (reason === "SL") {
      if (!position.slEnabled || position.stopLoss == null) {
        return res.json({ success: false });
      }
      if (price > position.stopLoss) {
        return res.json({ success: false });
      }
    }

    if (reason === "TP") {
      if (!position.tpEnabled || position.takeProfit == null) {
        return res.json({ success: false });
      }
      if (price < position.takeProfit) {
        return res.json({ success: false });
      }
    }

    // 3️⃣ Calculate
    const sellAmount = price * position.qty;
    const pnl = (price - position.avgPrice) * position.qty;

    // 4️⃣ Credit balance
    user.balance += sellAmount;
    await user.save();

    // 5️⃣ Close position
    position.status = "CLOSED";
    position.currentPrice = price;
    position.pnl = pnl;
    position.invested = 0;
    position.slEnabled = false;
    position.tpEnabled = false;
    position.exitReason = reason

    await position.save();

    // 6️⃣ Trade record
    await Trade.create({
      user: user._id,
      symbol: position.symbol,
      side: "SELL",
      qty: position.qty,
      price,
      amount: sellAmount,
      exitReason: reason // SL or TP
    });

    return res.json({
      success: true,
      message: `Position closed by ${reason}`
    });

  } catch (error) {
    console.log("Auto exit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};