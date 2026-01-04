import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const ChangePassword = () => {
  const navigate = useNavigate();
  const { token } = useAppContext();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);

    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/user/changepassword",
        {
          oldPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (data.success) {
        toast.success(data.message || "Password changed");
        navigate(-1);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-xl"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">
          Change Password
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4"
      >
        <div className="bg-white rounded-2xl shadow p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              name="oldPassword"
              type="password"
              placeholder="Enter current password"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* FIXED SUBMIT BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;