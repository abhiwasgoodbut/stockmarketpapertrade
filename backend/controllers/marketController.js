// Using stable fetch native to Node 18+ instead of yahoo-finance2 library

let watchlistCache = {
  data: null,
  time: 0,
  key: ""
};

const CACHE_TTL = 5000; // 5 seconds to reduce rate limiting

// Helper: Check if Indian Market is actually open (Mo-Fr, 9:15-15:30 IST)
const isIndianMarketNowOpen = () => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  const day = istTime.getDay(); // 0=Sun, 6=Sat
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const timeNum = hours * 100 + minutes;

  // Weekends
  if (day === 0 || day === 6) return false;

  // 9:15 AM to 3:30 PM
  return timeNum >= 915 && timeNum <= 1530;
};

export const getWatchlist = async (req, res) => {
  try {
    const symbols = (req.body.symbols || []).map(s => s.trim().toUpperCase());

    if (symbols.length === 0) {
      return res.json({ success: true, results: [] });
    }

    const cacheKey = symbols.join(",");

    // 1️⃣ Serve cache if within TTL (apply jitter on-the-fly for 1-sec updates)
    if (
      watchlistCache.data &&
      watchlistCache.key === cacheKey &&
      Date.now() - watchlistCache.time < CACHE_TTL
    ) {
      const jitteredResults = watchlistCache.data.map(q => {
        // Realism Check: Only jitter if market is active
        const isIndian = q.symbol.endsWith(".NS") || q.symbol.endsWith(".BO") || q.symbol.startsWith("^NSE");
        let isMarketActive = ["REGULAR", "PRE", "POST"].includes(q.marketState);
        if (isIndian) isMarketActive = isIndianMarketNowOpen();

        if (!isMarketActive) return q; // Static price when closed

        const jitter = (Math.random() - 0.5) * 0.1;
        const newLtp = +(q.ltp + jitter).toFixed(2);
        return {
          ...q,
          ltp: newLtp,
          bid: +(newLtp - 0.5).toFixed(2),
          ask: +(newLtp + 0.5).toFixed(2),
          source: q.source || "CACHE_JITTER"
        };
      });

      return res.json({ success: true, results: jitteredResults, cached: true });
    }

    // 2️⃣ Fetch from RESILIENT Yahoo Spark API (Batch fetch)
    try {
      const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${symbols.join(",")}`;
      const response = await fetch(url, { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        } 
      });
      const data = await response.json();
      
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Empty Spark response");
      }

      const results = symbols.map(symbol => {
        const sData = data[symbol];
        if (!sData || !sData.response || !sData.response[0]) return null;
        
        const q = sData.response[0].meta;
        return {
          name: q.shortName || q.longName || symbol,
          symbol,
          ltp: q.regularMarketPrice,
          bid: +(q.regularMarketPrice - 0.5).toFixed(2),
          ask: +(q.regularMarketPrice + 0.5).toFixed(2),
          high: q.regularMarketDayHigh || q.regularMarketPrice,
          low: q.regularMarketDayLow || q.regularMarketPrice,
          change: q.regularMarketChange || 0,
          changePercent: q.regularMarketChangePercent || 0,
          marketState: q.marketState,
          tickTime: new Date(q.regularMarketTime * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
          source: "YAHOO_SPARK"
        };
      }).filter(Boolean);

      if (results.length === 0) throw new Error("No symbols matched in Spark response");

      // 3️⃣ Update cache
      watchlistCache = { data: results, time: Date.now(), key: cacheKey };
      return res.json({ success: true, results, cached: false, source: "YAHOO_SPARK" });

    } catch (apiErr) {
      console.warn("Real API failed, dropping to fallback simulation:", apiErr.message);
      
      // 4️⃣ FALLBACK TO SIMULATION
      const now = Date.now();
      const results = symbols.map(symbol => {
        if (!fakePriceStore[symbol]) fakePriceStore[symbol] = { price: getBasePrice(symbol) };
        
        const isIndian = symbol.endsWith(".NS") || symbol.endsWith(".BO") || symbol.startsWith("^NSE");
        const isOpen = isIndian ? isIndianMarketNowOpen() : true;

        // Realistic Simulation: ONLY move if market is open
        if (isOpen) {
          const movement = (Math.random() - 0.5) * 4;
          fakePriceStore[symbol].price += movement;
          if (fakePriceStore[symbol].price < 10) fakePriceStore[symbol].price = 10;
        }

        const ltp = +fakePriceStore[symbol].price.toFixed(2);

        return {
          name: symbol, symbol, ltp,
          bid: +(ltp - 0.5).toFixed(2), ask: +(ltp + 0.5).toFixed(2),
          high: +(ltp + 10).toFixed(2), low: +(ltp - 10).toFixed(2),
          change: 0, changePercent: 0,
          marketState: isOpen ? "REGULAR" : "CLOSED",
          tickTime: new Date(now).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
          source: "FALLBACK_SIMULATION"
        };
      });

      watchlistCache = { data: results, time: now, key: cacheKey };
      return res.json({ success: true, results, cached: false, source: "FALLBACK_SIMULATION" });
    }

  } catch (err) {
    console.error("Critical Watchlist error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
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
