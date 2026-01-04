import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3
} from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-[#0b1224] border border-white/10 rounded-2xl p-5 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: localStorage.getItem("adminToken") }
      });
      if (data.success) setStats(data.stats);
    };
    fetchStats();
  }, []);

  if (!stats) {
    return <p className="text-gray-400">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={22} />}
          color="bg-purple-600/30 text-purple-400"
        />

        <StatCard
          title="Total Balance"
          value={`₹ ${stats.totalBalance}`}
          icon={<Wallet size={22} />}
          color="bg-green-600/30 text-green-400"
        />

        <StatCard
          title="Total Deposits"
          value={`₹ ${stats.totalDeposits}`}
          icon={<ArrowDownCircle size={22} />}
          color="bg-blue-600/30 text-blue-400"
        />

        <StatCard
          title="Total Withdrawals"
          value={`₹ ${stats.totalWithdrawals}`}
          icon={<ArrowUpCircle size={22} />}
          color="bg-red-600/30 text-red-400"
        />

        <StatCard
          title="Open Positions"
          value={stats.openPositions}
          icon={<BarChart3 size={22} />}
          color="bg-indigo-600/30 text-indigo-400"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;