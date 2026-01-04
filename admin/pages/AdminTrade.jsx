import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AdminTrade = () => {
  const { adminToken } = useAdminContext();

  const [trades, setTrades] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH TRADES ================= */
  const fetchTrades = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/trades", {
        headers: { Authorization: adminToken }
      });

      if (data.success) {
        setTrades(data.trades);
      } else {
        toast.error("Failed to load trades");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  /* ================= FILTER ================= */
  const filteredTrades = useMemo(() => {
    const q = search.toLowerCase();
    return trades.filter(t =>
      t.symbol.toLowerCase().includes(q) ||
      t.user?.name?.toLowerCase().includes(q) ||
      t.user?.username?.toLowerCase().includes(q) ||
      t.side.toLowerCase().includes(q) ||
      t.exitReason.toLowerCase().includes(q)
    );
  }, [trades, search]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Trades</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user / symbol / type"
          className="bg-black/30 border border-white/10 px-4 py-2 rounded text-sm w-72"
        />
      </div>

      {/* TABLE */}
      <div className="bg-black/30 border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <Th>User</Th>
              <Th>Symbol</Th>
              <Th>Side</Th>
              <Th>Qty</Th>
              <Th>Price</Th>
              <Th>Amount</Th>
              <Th>PNL</Th>
              <Th>Exit</Th>
              <Th>Date</Th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-400">
                  Loading trades...
                </td>
              </tr>
            )}

            {!loading && filteredTrades.map(trade => (
              <tr
                key={trade._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <Td>
                  <div>
                    <p className="font-medium">{trade.user?.name}</p>
                    <p className="text-xs text-gray-400">
                      {trade.user?.username}
                    </p>
                  </div>
                </Td>

                <Td>{trade.symbol}</Td>

                <Td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      trade.side === "BUY"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {trade.side}
                  </span>
                </Td>

                <Td>{trade.qty}</Td>
                <Td>₹ {trade.price}</Td>
                <Td>₹ {trade.amount}</Td>

                <Td
                  className={
                    trade.pnl >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  ₹ {trade.pnl.toFixed(2)}
                </Td>

                <Td>
                  <span className="px-2 py-1 rounded bg-white/10 text-xs">
                    {trade.exitReason}
                  </span>
                </Td>

                <Td className="text-xs text-gray-400">
                  {new Date(trade.createdAt).toLocaleString("en-IN")}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredTrades.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No trades found
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminTrade;

/* ================= SMALL COMPONENTS ================= */

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left font-medium">{children}</th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);