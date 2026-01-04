import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const TradePanel = () => {
  const { selectedstocks, token } = useAppContext();
  const item = selectedstocks;
  const navigate = useNavigate();

  if (!item || !item.name) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading stock details...
      </div>
    );
  }

  const [orderType, setOrderType] = useState("MARKET");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const numericQty = Number(qty);
  const execPrice =
    orderType === "MARKET" ? item.ltp : Number(price);

  // 🔥 API CONNECTED BUY / SELL
  const handleOrder = async (side) => {
    if (item.marketState !== "OPEN") {
      toast.error("Market is closed");
      return;
    }

    if (!numericQty || numericQty <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    if (orderType === "PENDING" && (!price || Number(price) <= 0)) {
      toast.error("Enter valid pending price");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/trade/place",
        {
          symbol: item.symbol,
          side,
          qty: numericQty,
          price: execPrice
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (!data.success) {
        toast.error(data.message || "Order failed");
        return;
      }

      toast.success(`${side} order executed`);
      navigate(-1); // back to watchlist

    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const totalValue = numericQty * execPrice || 0;

  return (
    <div className="p-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 text-sm font-medium"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border flex items-center justify-center font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-xs text-gray-500">{item.symbol}</p>
          </div>
        </div>

        <div className="text-right text-sm">
          <p className="font-semibold">{item.ltp}</p>
          <p className={item.change < 0 ? "text-red-600" : "text-green-600"}>
            {item.change} ({item.changePercent}%)
          </p>
        </div>
      </div>

      {/* MARKET / PENDING */}
      <div className="flex justify-center gap-6 mb-6">
        {["MARKET", "PENDING"].map(type => (
          <button
            key={type}
            onClick={() => {
              setOrderType(type);
              if (type === "MARKET") setPrice("");
            }}
            className={`px-6 py-2 border rounded font-medium ${
              orderType === type
                ? "bg-blue-600 text-white"
                : "text-blue-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <label className="text-sm">Quantity</label>
          <input
            type="text"
            inputMode="numeric"
            value={qty}
            onChange={(e) => /^\d*$/.test(e.target.value) && setQty(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        {orderType === "PENDING" && (
          <div>
            <label className="text-sm">Price</label>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => /^\d*$/.test(e.target.value) && setPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
        )}
      </div>

      {/* BUY / SELL */}
      <div className="flex justify-between my-6">
        <button
          disabled={loading}
          onClick={() => handleOrder("SELL")}
          className="px-8 py-3 rounded text-white bg-red-600 disabled:opacity-50"
        >
          SELL
        </button>

        <button
          disabled={loading}
          onClick={() => handleOrder("BUY")}
          className="px-8 py-3 rounded text-white bg-blue-600 disabled:opacity-50"
        >
          BUY
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 border-t pt-4 text-center text-sm">
        <div>
          <p className="text-gray-500">Qty</p>
          <p className="font-semibold">{numericQty || 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Total</p>
          <p className="font-semibold">{totalValue}</p>
        </div>
        <div>
          <p className="text-gray-500">Min Qty</p>
          <p className="font-semibold">10</p>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;