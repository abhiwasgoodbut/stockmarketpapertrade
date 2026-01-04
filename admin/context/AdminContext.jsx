import { createContext, useContext, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */
  const adminLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  /* ================= LOGOUT ================= */
  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  return (
    <AdminContext.Provider
      value={{
        adminToken,
        adminLogin,
        adminLogout,
        loading,setAdminToken
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);