import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const SLTP = () => {
  const navigate = useNavigate();
  const { token } = useAppContext();

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH POSITIONS ================= */
  const fetchPositions = async () => {
    try {
      const { data } = await axios.get("/api/position/my", {
        headers: { Authorization: token }
      });

      if (data.success) {
        setPositions(data.positions);
      }
    } catch (err) {
      console.error("SLTP fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  /* ================= FILTER ================= */
  const openSLTP = positions.filter(
    p => p.status === "OPEN" && (p.slEnabled || p.tpEnabled)
  );

  const closedSLTP = positions.filter(
    p => p.status === "CLOSED" && p.exitReason
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-lg font-semibold">SL / TP</h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">

        {/* ================= ACTIVE SL / TP ================= */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">
            ACTIVE SL / TP
          </h2>

          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && openSLTP.length === 0 && (
            <p className="text-gray-400 text-sm">No active SL / TP</p>
          )}

          {openSLTP.map(pos => (
            <div
              key={pos._id}
              className="bg-white rounded-xl shadow p-4 mb-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{pos.symbol}</p>
                  <p className="text-xs text-gray-500">Qty: {pos.qty}</p>
                </div>
                <span className="text-green-600 text-xs font-semibold">
                  OPEN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                {pos.slEnabled && (
                  <div>
                    <p className="text-gray-500">Stop Loss</p>
                    <p className="font-medium text-red-600">
                      ₹ {pos.stopLoss}
                    </p>
                  </div>
                )}

                {pos.tpEnabled && (
                  <div>
                    <p className="text-gray-500">Take Profit</p>
                    <p className="font-medium text-green-600">
                      ₹ {pos.takeProfit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= SL / TP HISTORY ================= */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">
            SL / TP HISTORY
          </h2>

          {!loading && closedSLTP.length === 0 && (
            <p className="text-gray-400 text-sm">No SL / TP history</p>
          )}

          {closedSLTP.map(pos => (
            <div
              key={pos._id}
              className="bg-white rounded-xl shadow p-4 mb-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{pos.symbol}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {pos.qty}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    pos.exitReason === "TP"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {pos.exitReason}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-3">
                <div>
                  <p className="text-gray-500">Avg</p>
                  <p className="font-medium">₹ {pos.avgPrice}</p>
                </div>

                <div>
                  <p className="text-gray-500">Exit</p>
                  <p className="font-medium">₹ {pos.currentPrice}</p>
                </div>

                <div>
                  <p className="text-gray-500">PnL</p>
                  <p
                    className={`font-medium ${
                      pos.pnl >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹ {Number(pos.pnl).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium text-gray-600">
                    CLOSED
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SLTP;
