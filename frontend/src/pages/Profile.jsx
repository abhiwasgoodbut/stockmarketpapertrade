import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setToken } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out");
    navigate("/");
  };

  const actionItems = [
    { label: "Deposit", icon: "💳", route: "/deposit" },
    { label: "Withdraw", icon: "⬇️", route: "/withdraw" },
    { label: "History", icon: "🕘", route: "/history" }
  ];

  const menuItems = [
    { label: "My Account", icon: "👤", route: "/account" },
    { label: "Rejection Logs", icon: "❌", route: "/rejections" },
    { label: "Bill Download", icon: "📄", route: "/bills" },
    { label: "Change Password", icon: "🔐", route: "/changepassword" },
    { label: "View App Terms", icon: "📋", route: "/terms" },
    { label: "Contact Us", icon: "📞", route: "/contact" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔷 HEADER */}
      <div className="bg-linear-to-b from-blue-800 to-blue-700 text-white px-6 pt-6 pb-24 relative">

        {/* TOP RIGHT */}
        <div className="absolute right-6 top-6 flex items-center gap-6 text-sm">
          <button onClick={() => window.location.reload()}>
            🔄 Reload
          </button>
          <button onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-white text-blue-700 flex items-center justify-center text-xl font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {user?.username || "Username"}
            </p>
            <p className="text-xs opacity-80">
              {user?.name || "User"}
            </p>
          </div>
        </div>

        <p className="text-xs mt-2 opacity-80">
          Mobile: {user?.number || "-"}
        </p>

        {/* BALANCE */}
        <div className="text-center mt-10">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-3xl font-bold mt-1">
            💰 {Number(user?.balance).toFixed(2) ?? 0}
          </p>
        </div>
      </div>

      {/* 🔳 ACTION CARD */}
      <div className="relative -mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-md flex justify-around py-6 text-center">
          {actionItems.map(item => (
            <div
              key={item.label}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center gap-1 cursor-pointer active:scale-95"
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🧩 MENU GRID */}
      <div className="mt-12 px-6">
        <div className="grid grid-cols-3 gap-8 text-center">
          {menuItems.map(item => (
            <div
              key={item.label}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center gap-2 cursor-pointer active:scale-95"
            >
              <div className="h-14 w-14 bg-gray-200 rounded-xl flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VERSION */}
      <p className="text-right text-xs text-gray-500 px-6 mt-8">
        App Version 49.43.2.240
      </p>
    </div>
  );
};

export default Profile;