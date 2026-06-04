import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
// import logo from "../assets/logo.png";

import { useNavigate } from "react-router-dom";
import { assets } from "../assets/asset";

// IMPORTANT
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Auth = () => {
  const { setToken } = useAppContext();
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Mobile validation
    if (!/^\d{10}$/.test(number)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    if (!password) {
      toast.error("Password required");
      return;
    }

    if (!isLogin) {
      if (!username || !name) {
        toast.error("All fields required");
        return;
      }
      if (password !== repassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = isLogin
        ? { number, password }
        : { username, name, number, password, repassword };

      const url = isLogin
        ? "/api/user/login"
        : "/api/user/register";

      const { data } = await axios.post(url, payload);

      if (!data.success) {
        toast.error(data.message || "Authentication failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate('/')

      toast.success(isLogin ? "Login successful" : "Account created");

    } catch (error) {
      toast.error("Server error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-80 p-6 rounded-xl shadow"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="h-50 w-50 rounded-full bg-white shadow-lg overflow-hidden">
            <img
              src={assets.logo}
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-center text-xl font-semibold mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* REGISTER ONLY */}
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full border p-2 rounded mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        {/* MOBILE */}
        <input
          type="tel"
          placeholder="Mobile Number"
          maxLength={10}
          className="w-full border p-2 rounded mb-3"
          value={number}
          onChange={(e) =>
            setNumber(e.target.value.replace(/\D/g, ""))
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* RE-PASSWORD */}
        {!isLogin && (
          <input
            type="password"
            placeholder="Re-enter Password"
            className="w-full border p-2 rounded mb-3"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
          />
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded mt-2 disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Register"}
        </button>

        {/* TOGGLE */}
        <p className="text-center text-sm mt-4">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 cursor-pointer"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
