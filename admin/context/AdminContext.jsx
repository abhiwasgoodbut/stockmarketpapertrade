import { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        if (
          response.data &&
          response.data.success === false &&
          (response.data.message === "Invalid or expired admin token" ||
            response.data.message === "Admin not authorized" ||
            response.data.message === "Admin access denied")
        ) {
          adminLogout();
        }
        return response;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

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