import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { token } = useAppContext();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const [depositRes, withdrawRes] = await Promise.all([
        axios.get("/api/history", {
          headers: { Authorization: token }
        }),
        axios.get("/api/withdraw/my", {
          headers: { Authorization: token }
        })
      ]);

      const deposits = depositRes.data?.deposits || [];
      const withdrawals = withdrawRes.data?.withdrawals || [];

      const formattedDeposits = deposits.map(d => ({
        ...d,
        type: "DEPOSIT"
      }));

      const formattedWithdrawals = withdrawals.map(w => ({
        ...w,
        type: "WITHDRAW"
      }));

      const combined = [...formattedDeposits, ...formattedWithdrawals].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTransactions(combined);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-lg font-semibold">Transaction History</h1>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {loading && (
          <div className="text-center text-gray-500 mt-20">
            Loading transactions...
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No transactions found
          </div>
        )}

        {!loading && transactions.map(txn => (
          <div
            key={txn._id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            {/* LEFT */}
            <div>
              <p className="text-sm text-gray-500">
                {txn.type === "DEPOSIT" ? "Deposit" : "Withdraw"}
              </p>

              <p className="text-lg font-semibold">
                ₹ {Number(txn.amount).toFixed(2)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {formatDate(txn.createdAt)}
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right space-y-1">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(txn.status)}`}
              >
                {txn.status.toUpperCase()}
              </span>

              {txn.type === "DEPOSIT" && (
                <p className="text-xs text-gray-400">
                  UTR: {txn.utr}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;