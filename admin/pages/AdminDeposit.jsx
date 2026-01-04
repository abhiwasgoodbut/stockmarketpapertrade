import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AdminDeposit = () => {
  const { adminToken } = useAdminContext();

  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState("");

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  /* ================= FETCH ================= */
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/deposits", {
        headers: { Authorization: adminToken }
      });

      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch {
      toast.error("Failed to load deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `/api/admin/deposits/${id}`,
        { status, adminRemark: remark },
        { headers: { Authorization: adminToken } }
      );

      if (data.success) {
        toast.success(`Deposit ${status}`);
        setRemark("");
        fetchDeposits();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const badge = (status) =>
    status === "approved"
      ? "bg-green-500/20 text-green-400"
      : status === "rejected"
      ? "bg-red-500/20 text-red-400"
      : "bg-yellow-500/20 text-yellow-400";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Deposit Requests</h1>

      <div className="bg-black/30 border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">UTR</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Screenshot</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Remark</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && deposits.map(dep => (
              <tr
                key={dep._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{dep.user?.name}</p>
                  <p className="text-xs text-gray-400">
                    {dep.user?.username}
                  </p>
                </td>

                <td className="px-4 py-3 font-semibold">
                  ₹ {dep.amount}
                </td>

                <td className="px-4 py-3">{dep.utr}</td>

                <td className="px-4 py-3 text-xs text-gray-300">
                  {formatDate(dep.createdAt)}
                </td>

                <td className="px-4 py-3">
                  <a
                    href={dep.screenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline text-xs"
                  >
                    View
                  </a>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${badge(dep.status)}`}
                  >
                    {dep.status.toUpperCase()}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <input
                    disabled={dep.status !== "pending"}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Admin remark"
                    className="bg-black/30 border border-white/10 px-2 py-1 rounded text-xs w-40"
                  />
                </td>

                <td className="px-4 py-3 text-center">
                  {dep.status === "pending" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => updateStatus(dep._id, "approved")}
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(dep._id, "rejected")}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDeposit;