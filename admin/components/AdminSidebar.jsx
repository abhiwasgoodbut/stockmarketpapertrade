import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext";

const AdminSidebar = () => {
  const { adminLogout } = useAdminContext();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
     ${
       isActive
         ? "bg-blue-600/20 text-blue-400 shadow-inner"
         : "text-gray-300 hover:bg-white/5"
     }`;

  return (
    <aside className="w-64 bg-[#0a1020] border-r border-white/10 flex flex-col">
      
      {/* LOGO */}
      <div className="p-5 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-wide">Admin Panel</h1>
        <p className="text-xs text-gray-400">Management Console</p>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/admin" end className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/users" className={linkClass}>
          <Users size={18} />
          Users
        </NavLink>

        <NavLink to="/deposit" className={linkClass}>
          <ArrowDownCircle size={18} />
          Deposits
        </NavLink>

        <NavLink to="/withdraw" className={linkClass}>
          <ArrowUpCircle size={18} />
          Withdrawals
        </NavLink>

        <NavLink to="trades" className={linkClass}>
          <BarChart3 size={18} />
          Trades
        </NavLink>

        <NavLink to="/admin/settings" className={linkClass}>
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            adminLogout();
            navigate("/admin");
          }}
          className="w-full flex items-center justify-center gap-2
                     bg-red-600/20 hover:bg-red-600/30
                     text-red-400 py-2 rounded-xl text-sm font-semibold transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;