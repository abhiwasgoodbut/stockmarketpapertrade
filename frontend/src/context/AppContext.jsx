import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const DEFAULT_SCRIPTS = [
    { name: "BANKNIFTY", symbol: "^NSEBANK" },
    { name: "NIFTY", symbol: "^NSEI" },
    { name: "SILVER", symbol: "SI=F" },
    { name: "GOLD", symbol: "GC=F" }
  ];

  const [watchlistData, setWatchlistData] = useState(DEFAULT_SCRIPTS);
  const [selectedstocks, setSelectedstocks] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);       // normal API loading
  const [authLoading, setAuthLoading] = useState(true); // 🔥 AUTH ONLY

  /* ================= AUTH ================= */
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token }
      });

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthLoading(false); // 🔥 IMPORTANT
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setAuthLoading(false); // 🔥 IMPORTANT
    }
  }, [token]);

  /* ================= WATCHLIST ================= */
  const fetchWatchListData = async () => {
    try {
      const symbols = watchlistData.map(i => i.symbol);
      console.log(symbols);
      
      if (!symbols.length) return;

      const { data } = await axios.post("/api/watchlist/data", { symbols });

      if (data.success) {
        setWatchlistData(prev => {
          const map = new Map(prev.map(i => [i.symbol, i]));
          data.results.forEach(n => {
            map.set(n.symbol, { ...map.get(n.symbol), ...n });
          });
          return Array.from(map.values());
        });
      }
    } catch (e) {
      console.error("Watchlist error", e);
    }
  };

  useEffect(() => {
    fetchWatchListData();
    const interval = setInterval(fetchWatchListData, 2000);
    return () => clearInterval(interval);
  }, [watchlistData.length]);

  /* ================= USER WATCHLIST ================= */
  const loadUserWatchlist = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/add/mywatchlist", {
        headers: { Authorization: token }
      });

      if (data.success) {
        setWatchlistData(prev => {
          const map = new Map(prev.map(i => [i.symbol, i]));
          data.symbols.forEach(i => map.set(i.symbol, i));
          return Array.from(map.values());
        });
      }
    } catch (e) {
      console.error("User watchlist error", e);
    }
  };

  useEffect(() => {
    if (user) loadUserWatchlist();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        watchlistData,
        setWatchlistData,
        selectedstocks,
        setSelectedstocks,
        token,
        setToken,
        user,
        setUser,
        loading,
        setLoading,
        authLoading // 🔥 EXPOSE THIS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
