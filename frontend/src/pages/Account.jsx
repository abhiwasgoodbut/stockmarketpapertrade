import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔷 HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-xl">
          ←
        </button>
        <h1 className="text-lg font-semibold">My Account</h1>
      </div>

      {/* 📄 CONTENT */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">

        {/* 👤 PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-3">Profile Information</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>

            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">{user.name || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">Mobile Number</p>
              <p className="font-medium">{user.number}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user.email || "-"}</p>
            </div>
          </div>
        </div>

        {/* 💰 BALANCE CARD */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-3">Wallet</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Available Balance</p>
              <p className="font-semibold text-green-600 text-lg">
                ₹ {Number(user.balance).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Account Type</p>
              <p className="font-medium">
                {user.accountType || "Standard"}
              </p>
            </div>
          </div>
        </div>

        {/* 🔐 SECURITY */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-3">Security</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Terms Accepted</p>
              <p
                className={`font-medium ${
                  user.termsAccepted
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {user.termsAccepted ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Account Status</p>
              <p
                className={`font-medium ${
                  user.isActive !== false
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {user.isActive !== false ? "Active" : "Blocked"}
              </p>
            </div>
          </div>
        </div>

        {/* 🧾 ACCOUNT META */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-3">Account Details</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">User ID</p>
              <p className="font-medium break-all">{user._id}</p>
            </div>

            <div>
              <p className="text-gray-500">Joined On</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Account;