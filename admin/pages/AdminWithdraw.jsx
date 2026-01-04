import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AdminWithdraw = () => {
  const { adminToken } = useAdminContext();

  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState("");

  /* ================= FETCH WITHDRAWS ================= */
  const fetchWithdraws = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/withdraws", {
        headers: { Authorization: adminToken }
      });

      if (data.success) {
        setWithdraws(data.withdraws);
      }
    } catch {
      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `/api/admin/withdraws/${id}`,
        { status, remark },
        { headers: { Authorization: adminToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setRemark("");
        fetchWithdraws();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Withdraw Requests</h1>
        <p className="text-sm text-gray-400">
          Total: {withdraws.length}
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <Th>User</Th>
              <Th>Method</Th>
              <Th>Details</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th className="text-center">Action</Th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400">
                  Loading withdrawals...
                </td>
              </tr>
            )}

            {!loading && withdraws.map(w => (
              <tr
                key={w._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                {/* USER */}
                <Td>
                  <p className="font-medium">{w.user?.name}</p>
                  <p className="text-xs text-gray-400">{w.user?.username}</p>
                </Td>

                {/* METHOD */}
                <Td>{w.method}</Td>

                {/* DETAILS */}
                <Td>
                  {w.method === "UPI" ? (
                    <p className="text-xs">{w.upiId}</p>
                  ) : (
                    <div className="text-xs space-y-1">
                      <p>{w.beneficiaryName}</p>
                      <p>{w.accountNumber}</p>
                      <p>{w.ifsc}</p>
                    </div>
                  )}
                </Td>

                {/* AMOUNT */}
                <Td className="font-semibold">₹ {w.amount}</Td>

                {/* DATE */}
                <Td className="text-xs text-gray-400">
                  {new Date(w.createdAt).toLocaleString()}
                </Td>

                {/* STATUS */}
                <Td>
                  <StatusBadge status={w.status} />
                </Td>

                {/* ACTION */}
                <Td className="text-center space-x-2">
                  {w.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(w._id, "APPROVED")}
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-xs"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(w._id, "REJECTED")}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-xs"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REMARK */}
      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
        <label className="text-xs text-gray-400">Admin Remark (optional)</label>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Reason for rejection or note..."
          className="w-full mt-2 bg-black/30 border border-white/10 rounded px-3 py-2 text-sm resize-none"
        />
      </div>

    </div>
  );
};

export default AdminWithdraw;

/* ================= SMALL COMPONENTS ================= */

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left font-medium ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 ${className}`}>
    {children}
  </td>
);

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    APPROVED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};