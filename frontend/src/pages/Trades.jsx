import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Trades = () => {
  const navigate = useNavigate();
  const { token } = useAppContext();

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 FETCH TRADES
  const fetchTrades = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/trade/my", {
        headers: { Authorization: token }
      });

      if (data.success) {
        setTrades(data.trades || []);
      } else {
        toast.error("Failed to load trades");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // 🧮 PROFIT / LOSS SUMMARY
  const totalBuy = trades
    .filter(t => t.side === "BUY")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSell = trades
    .filter(t => t.side === "SELL")
    .reduce((sum, t) => sum + t.amount, 0);

  const netPnl = totalSell - totalBuy;
  const isProfit = netPnl >= 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔷 HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-lg font-semibold">My Trades</h1>
      </div>

      {/* 💰 P&L SUMMARY */}
      {!loading && trades.length > 0 && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow p-4 grid grid-cols-3 text-center">
            <div>
              <p className="text-xs text-gray-500">Total Buy</p>
              <p className="font-semibold text-red-600">
                ₹ {totalBuy.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Sell</p>
              <p className="font-semibold text-green-600">
                ₹ {totalSell.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Net P&L</p>
              <p
                className={`font-semibold ${
                  isProfit ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹ {netPnl.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📜 TRADES LIST */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 mt-10">
            Loading trades...
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && trades.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg font-medium">No trades found</p>
            <p className="text-sm mt-1">
              Your executed trades will appear here
            </p>
          </div>
        )}

        {/* TRADES */}
        {!loading &&
          trades.map(trade => {
            const isBuy = trade.side === "BUY";

            return (
              <div
                key={trade._id}
                className="bg-white rounded-xl shadow p-4"
              >
                {/* TOP */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">
                      {trade.symbol}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {trade.qty}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isBuy
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {trade.side}
                    </span>
                    <p className="text-sm mt-1 font-medium">
                      ₹ {trade.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t my-3" />

                {/* DETAILS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">₹ {trade.price}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Qty</p>
                    <p className="font-medium">{trade.qty}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium">₹ {trade.amount}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium">
                      {new Date(trade.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Trades;