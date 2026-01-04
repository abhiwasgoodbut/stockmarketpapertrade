import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddScript = () => {
  const navigate = useNavigate();
  const { watchlistData, setWatchlistData,token } = useAppContext();

  const [query, setQuery] = useState("");
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH ALL STOCKS ONCE
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/search");

        if (data.success) {
          setAllStocks(data.results);
          setFilteredStocks(data.results); // show all initially
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // 🔍 LOCAL SEARCH FILTER
  useEffect(() => {
    if (!query.trim()) {
      setFilteredStocks(allStocks);
      return;
    }

    const q = query.toLowerCase();

    const filtered = allStocks.filter(stock =>
      stock.name.toLowerCase().includes(q) ||
      stock.symbol.toLowerCase().includes(q)
    );

    setFilteredStocks(filtered);
  }, [query, allStocks]);

  // ➕ ADD TO WATCHLIST
  const addToWatchlist = async (stock) => {
  try {
    const exists = watchlistData.some(
      item => item.symbol === stock.symbol
    );

    if (exists) {
      toast.error("Already in watchlist");
      return;
    }

    // const token = localStorage.getItem("token");

    const { data } = await axios.post(
      "/api/add/addtowatchlist",
      {
        name: stock.name,
        symbol: stock.symbol
      },
      {
        headers: {
          Authorization: token
        }
      }
    );

    if (data.success) {
      setWatchlistData(prev => [...prev, stock]);
      toast.success("Added to watchlist");
    } else {
      toast.error(data.message || "Failed to add");
    }

  } catch (error) {
    console.error(error);
    toast.error("Server error");
  }
};

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>←</button>
        <h2 className="text-lg font-semibold">Add Script</h2>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search stock name or symbol"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      {/* LIST */}
      <div className="mt-4">
        {loading && <p className="text-sm">Loading stocks...</p>}

        {!loading && filteredStocks.map(stock => {
          const added = watchlistData.some(
            item => item.symbol === stock.symbol
          );

          return (
            <div
              key={stock.symbol}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium">{stock.name}</p>
                <p className="text-xs text-gray-500">{stock.symbol}</p>
              </div>

              <button
                disabled={added}
                onClick={() => addToWatchlist(stock)}
                className={`px-4 py-1 text-sm rounded text-white ${
                  added ? "bg-gray-400" : "bg-black"
                }`}
              >
                {added ? "ADDED" : "ADD"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddScript;
