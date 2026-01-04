import Watchlist from "../models/watchlistModel.js";

export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user._id; // 🔐 from protect middleware
    const { name, symbol } = req.body;

    if (!symbol || !name) {
      return res.status(400).json({
        success: false,
        message: "Name and symbol required"
      });
    }

    // 1️⃣ Find watchlist for user
    let watchlist = await Watchlist.findOne({ user: userId });

    // 2️⃣ Create watchlist if not exists
    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: userId,
        symbols: [{ name, symbol }]
      });

      return res.json({
        success: true,
        message: "Added to watchlist",
        symbols: watchlist.symbols
      });
    }

    // 3️⃣ Prevent duplicate
    const exists = watchlist.symbols.some(
      item => item.symbol === symbol
    );

    if (exists) {
      return res.json({
        success: false,
        message: "Already in watchlist"
      });
    }

    // 4️⃣ Add symbol
    watchlist.symbols.push({ name, symbol });
    await watchlist.save();

    res.json({
      success: true,
      message: "Added to watchlist",
      symbols: watchlist.symbols
    });

  } catch (error) {
    console.error("Add watchlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const watchlist = await Watchlist.findOne({ user: userId });

    if (!watchlist) {
      return res.json({
        success: true,
        symbols: []
      });
    }

    res.json({
      success: true,
      symbols: watchlist.symbols
    });
  } catch (error) {
    console.error("Get watchlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol is required"
      });
    }

    // 1️⃣ Find user's watchlist
    const watchlist = await Watchlist.findOne({ user: userId });

    if (!watchlist) {
      return res.json({
        success: true,
        symbols: []
      });
    }

    // 2️⃣ Remove symbol
    watchlist.symbols = watchlist.symbols.filter(
      item => item.symbol !== symbol
    );

    // 3️⃣ Save
    await watchlist.save();

    res.json({
      success: true,
      message: "Removed from watchlist",
      symbols: watchlist.symbols
    });

  } catch (error) {
    console.error("Remove watchlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
