import yahoo from "../config/yahoofin.js";

let watchlistCache = {
  data: null,
  time: 0,
  key: ""
};

const CACHE_TTL = 1 * 1000; // 2 sec

export const getWatchlist = async (req, res) => {
  try {
    const symbols = req.body.symbols || [];

    if (symbols.length === 0) {
      return res.json({ success: true, results: [] });
    }

    const cacheKey = symbols.join(",");

    // Serve cache only if same symbols
    if (
      watchlistCache.data &&
      watchlistCache.key === cacheKey &&
      Date.now() - watchlistCache.time < CACHE_TTL
    ) {
      return res.json({
        success: true,
        results: watchlistCache.data,
        cached: true
      });
    }

    const quotes = await yahoo.quote(symbols);
    const quoteArray = Array.isArray(quotes) ? quotes : [quotes];

    const results = quoteArray.map(q => {
      const tickTime = q.regularMarketTime
        ? new Date(q.regularMarketTime).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          })
        : "--:--:--";

      return {
        name: q.shortName || q.longName,
        symbol: q.symbol,
        ltp: q.regularMarketPrice,
        bid: q.bid || q.regularMarketPrice,
        ask: q.ask || q.regularMarketPrice,
        high: q.regularMarketDayHigh,
        low: q.regularMarketDayLow,
        change: q.regularMarketChange,
        changePercent: q.regularMarketChangePercent,
        marketState: q.marketState,
        delayedBy: q.exchangeDataDelayedBy,
        tickTime
      };
    });

    watchlistCache = {
      data: results,
      time: Date.now(),
      key: cacheKey
    };

    res.json({ success: true, results, cached: false });

  } catch (err) {
    console.error("Watchlist error:", err.message);
    res.status(500).json({ success: false });
  }
};


// controllers/watchlistController.js

// controllers/watchlistController.js

export const fakePriceStore = {};

const getBasePrice = (symbol) => {
  const s = symbol.toUpperCase();

  if (s.includes("BANK")) return 48000;
  if (s.includes("NSEI")) return 22500;
  if (s.includes("SILVER")) return 72000;
  if (s.includes("GOLD")) return 62000;

  // fallback for any user-added symbol
  return Math.floor(1000 + Math.random() * 5000);
};

export const getWatchlistFake = async (req, res) => {
  try {
    const symbols = req.body.symbols || [];

    if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.json({ success: true, results: [] });
    }

    const now = new Date();

    const results = symbols.map(symbol => {
      // 1️⃣ INIT ONCE
      if (!fakePriceStore[symbol]) {
        fakePriceStore[symbol] = {
          price: getBasePrice(symbol)
        };
      }

      // 2️⃣ SMALL, SAFE MOVEMENT
      const movement = (Math.random() - 0.5) * 4; // max ±2
      fakePriceStore[symbol].price += movement;

      // 3️⃣ SAFETY FLOOR
      if (fakePriceStore[symbol].price < 10) {
        fakePriceStore[symbol].price = 10;
      }

      const ltp = +fakePriceStore[symbol].price.toFixed(2);
      const bid = +(ltp - 0.5).toFixed(2);
      const ask = +(ltp + 0.5).toFixed(2);

      return {
        name: symbol,
        symbol,
        ltp,
        bid,
        ask,
        high: +(ltp + 10).toFixed(2),
        low: +(ltp - 10).toFixed(2),
        change: +movement.toFixed(2),
        changePercent: +((movement / ltp) * 100).toFixed(2),
        marketState: "OPEN",
        delayedBy: 0,
        tickTime: now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
      };
    });

    res.json({
      success: true,
      results,
      simulated: true
    });

  } catch (err) {
    console.error("Fake watchlist error:", err.message);
    res.status(500).json({ success: false });
  }
};
