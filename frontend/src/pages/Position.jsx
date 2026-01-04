import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Positions = () => {
  const navigate = useNavigate();
  const { token, watchlistData } = useAppContext();

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH POSITIONS ================= */
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/position/my", {
        headers: { Authorization: token }
      });

      if (data.success) {
        setPositions(data.positions);
      } else {
        toast.error("Failed to load positions");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  /* ================= PRICE MAP ================= */
  const priceMap = useMemo(() => {
    const map = {};
    watchlistData.forEach(item => {
      if (item?.name && item?.ltp != null) {
        map[item.name.toUpperCase()] = Number(item.ltp);
      }
    });
    return map;
  }, [watchlistData]);

  /* ================= LIVE PRICE ================= */
  const getLivePrice = (pos) => {
    return priceMap[pos.symbol.toUpperCase()] ?? pos.currentPrice;
  };

  // Use effect for sl tp

  /* ================= AUTO SL / TP EXECUTION ================= */
useEffect(() => {
  if (!positions.length) return;

  const interval = setInterval(async () => {
    for (const pos of positions) {
      if (pos.status !== "OPEN") continue;

      const livePrice = Number(getLivePrice(pos));
      const sl = Number(pos.stopLoss);
      const tp = Number(pos.takeProfit);

      try {
        // STOP LOSS
        if (
          pos.slEnabled &&
          !isNaN(sl) &&
          livePrice <= sl
        ) {
          await axios.post(
            "/api/position/auto-exit",
            {
              positionId: pos._id,
              exitPrice: livePrice,
              reason: "SL"
            },
            { headers: { Authorization: token } }
          );

          await fetchPositions();
          continue;
        }

        // TAKE PROFIT
        if (
          pos.tpEnabled &&
          !isNaN(tp) &&
          livePrice >= tp
        ) {
          await axios.post(
            "/api/position/auto-exit",
            {
              positionId: pos._id,
              exitPrice: livePrice,
              reason: "TP"
            },
            { headers: { Authorization: token } }
          );

          await fetchPositions();
        }
      } catch (err) {
        // Ignore duplicate close attempts
      }
    }
  }, 2000);

  return () => clearInterval(interval);
}, [positions, watchlistData]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-xl">
          ←
        </button>
        <h1 className="text-lg font-semibold">My Positions</h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 mt-10">
            Loading positions...
          </p>
        )}

        {/* EMPTY */}
        {!loading && positions.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg font-medium">No positions found</p>
            <p className="text-sm mt-1">
              Start trading to see your positions here
            </p>
          </div>
        )}

        {/* POSITIONS */}
        {!loading &&
          positions.map(pos => {
            const livePrice = getLivePrice(pos);

            const pnl =
              pos.status === "CLOSED"
                ? Number(pos.pnl || 0)
                : (livePrice - pos.avgPrice) * pos.qty;

            const pnlPercent =
              pos.avgPrice && pos.qty
                ? (pnl / (pos.avgPrice * pos.qty)) * 100
                : 0;

            const isProfit = pnl >= 0;

            return (
              <div
                key={pos._id}
                className="bg-white rounded-xl shadow p-4"
              >
                {/* TOP */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{pos.symbol}</p>
                    <p className="text-xs text-gray-500">Qty: {pos.qty}</p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹ {pnl.toFixed(2)}
                    </p>
                    <p
                      className={`text-xs ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {pnlPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t my-3" />

                {/* DETAILS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Avg Price</p>
                    <p className="font-medium">₹ {pos.avgPrice}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Live Price</p>
                    <p className="font-medium">₹ {livePrice}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Invested</p>
                    <p className="font-medium">₹ {pos.invested}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Status</p>
                    <p
                      className={`font-medium ${
                        pos.status === "OPEN"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {pos.status}
                    </p>
                  </div>
                </div>

                {/* ================= SL / TP ================= */}
                {pos.status === "OPEN" && (
                  <div className="mt-4 border-t pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* STOP LOSS */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={pos.slEnabled || false}
                            onChange={(e) => {
                              pos.slEnabled = e.target.checked;
                              setPositions([...positions]);
                            }}
                          />
                          <label className="text-sm font-medium">
                            Stop Loss
                          </label>
                        </div>

                        <input
                          type="number"
                          disabled={!pos.slEnabled}
                          value={pos.stopLoss || ""}
                          onChange={(e) => {
                            pos.stopLoss = e.target.value;
                            setPositions([...positions]);
                          }}
                          placeholder="SL price"
                          className="w-full border rounded px-3 py-2 text-sm disabled:bg-gray-100"
                        />
                      </div>

                      {/* TAKE PROFIT */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={pos.tpEnabled || false}
                            onChange={(e) => {
                              pos.tpEnabled = e.target.checked;
                              setPositions([...positions]);
                            }}
                          />
                          <label className="text-sm font-medium">
                            Take Profit
                          </label>
                        </div>

                        <input
                          type="number"
                          disabled={!pos.tpEnabled}
                          value={pos.takeProfit || ""}
                          onChange={(e) => {
                            pos.takeProfit = e.target.value;
                            setPositions([...positions]);
                          }}
                          placeholder="TP price"
                          className="w-full border rounded px-3 py-2 text-sm disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                      onClick={async () => {
                        try {
                          const { data } = await axios.post(
                            "/api/position/set-sltp",
                            {
                              positionId: pos._id,
                              stopLoss: pos.stopLoss,
                              takeProfit: pos.takeProfit,
                              slEnabled: pos.slEnabled,
                              tpEnabled: pos.tpEnabled
                            },
                            { headers: { Authorization: token } }
                          );

                          if (data.success) {
                            toast.success("SL / TP updated");
                            fetchPositions();
                          } else {
                            toast.error(data.message);
                          }
                        } catch {
                          toast.error("Failed to update SL / TP");
                        }
                      }}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold"
                    >
                      Save SL / TP
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Positions;