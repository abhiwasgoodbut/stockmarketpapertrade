import Trade from "../models/tradeModel.js";
import Position from "../models/positionModel.js";

/**
 * PLACE TRADE
 * BUY / SELL
 */
export const placeTrade = async (req, res) => {
  try {
    const user = req.user;
    const { symbol, side, qty, price } = req.body;

    // 🛑 VALIDATION
    if (!symbol || !side || !qty || !price) {
      return res.json({
        success: false,
        message: "Invalid order data"
      });
    }

    const quantity = Number(qty);
    const execPrice = Number(price);

    if (quantity <= 0 || execPrice <= 0) {
      return res.json({
        success: false,
        message: "Invalid qty or price"
      });
    }

    const totalAmount = quantity * execPrice;

    /* ================= BUY ================= */
    if (side === "BUY") {
      if (user.balance < totalAmount) {
        return res.json({
          success: false,
          message: "Insufficient balance"
        });
      }

      // 💰 Deduct balance
      user.balance = Number((user.balance - totalAmount).toFixed(2));
      await user.save();

      let position = await Position.findOne({
        user: user._id,
        symbol,
        status: "OPEN"
      });

      if (!position) {
        // 🆕 New position
        position = await Position.create({
          user: user._id,
          symbol,
          qty: quantity,
          avgPrice: execPrice,
          currentPrice: execPrice,
          invested: totalAmount,
          pnl: 0,
          status: "OPEN"
        });
      } else {
        // ➕ Average position
        const newQty = position.qty + quantity;
        const newInvested = position.invested + totalAmount;

        position.qty = newQty;
        position.invested = Number(newInvested.toFixed(2));
        position.avgPrice = Number(
          (newInvested / newQty).toFixed(2)
        );
        position.currentPrice = execPrice;
        position.pnl = Number(
          ((execPrice - position.avgPrice) * newQty).toFixed(2)
        );

        await position.save();
      }

      // 🧾 Trade record (BUY → pnl = 0)
      await Trade.create({
        user: user._id,
        symbol,
        side,
        qty: quantity,
        price: execPrice,
        amount: Number(totalAmount.toFixed(2)),
        pnl: 0,
        exitReason: "MANUAL"
      });
    }

    /* ================= SELL ================= */
    if (side === "SELL") {
      const position = await Position.findOne({
        user: user._id,
        symbol,
        status: "OPEN"
      });

      if (!position || position.qty < quantity) {
        return res.json({
          success: false,
          message: "Not enough quantity to sell"
        });
      }

      const creditAmount = quantity * execPrice;

      // 💰 Credit balance
      user.balance = Number(
        (user.balance + creditAmount).toFixed(2)
      );
      await user.save();

      position.qty -= quantity;
      position.currentPrice = execPrice;

      // ✅ FIX: calculate trade PNL (only sold qty)
      const tradePnl = Number(
        ((execPrice - position.avgPrice) * quantity).toFixed(2)
      );

      if (position.qty === 0) {
        // FULL EXIT
        position.status = "CLOSED";
        position.invested = 0;
        position.pnl = tradePnl;
      } else {
        // PARTIAL EXIT
        position.invested = Number(
          (position.qty * position.avgPrice).toFixed(2)
        );
        position.pnl = Number(
          ((execPrice - position.avgPrice) * position.qty).toFixed(2)
        );
      }

      await position.save();

      // 🧾 Trade record WITH PNL ✅
      await Trade.create({
        user: user._id,
        symbol,
        side,
        qty: quantity,
        price: execPrice,
        amount: Number(creditAmount.toFixed(2)),
        pnl: position.pnl,               // ✅ FIXED
        exitReason: "MANUAL"
      });
    }

    return res.json({
      success: true,
      message: "Order executed successfully",
      balance: Number(user.balance.toFixed(2))
    });

  } catch (error) {
    console.error("Trade error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
/**
 * GET MY TRADES
 */
export const getMyTrades = async (req, res) => {
  try {
    const user = req.user;

    const trades = await Trade.find({ user: user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      trades
    });
  } catch (error) {
    console.error("Get trades error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};