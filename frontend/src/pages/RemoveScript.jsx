import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const RemoveScript = () => {
  const navigate = useNavigate();
  const { watchlistData, setWatchlistData, token } = useAppContext();

  // ❌ DEFAULT SCRIPTS (cannot be removed)
  const DEFAULT_SYMBOLS = ["^NSEBANK", "^NSEI", "SI=F", "GC=F"];

  const removeFromWatchlist = async (symbol) => {
    // 🚫 Prevent removing default scripts
    if (DEFAULT_SYMBOLS.includes(symbol)) {
      toast.error("Default script cannot be removed");
      return;
    }

    try {
      const { data } = await axios.delete(
        "/api/add/removewatchlist",
        {
          headers: {
            Authorization: token
          },
          data: { symbol }
        }
      );

      if (data.success) {
        setWatchlistData(prev =>
          prev.filter(item => item.symbol !== symbol)
        );

        toast.success("Removed from watchlist");
      } else {
        toast.error(data.message || "Failed to remove");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-lg">
          ←
        </button>
        <h2 className="text-lg font-semibold">
          Manage Watchlist
        </h2>
      </div>

      {/* LIST */}
      <div>
        {watchlistData.map(item => {
          const isDefault = DEFAULT_SYMBOLS.includes(item.symbol);

          return (
            <div
              key={item.symbol}
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex items-start gap-3">
                <span className="h-2 w-2 bg-blue-600 rounded-full mt-2" />

                <div>
                  <p className="font-semibold">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.expiry || "-"}
                  </p>
                </div>
              </div>

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeFromWatchlist(item.symbol)}
                className={`h-6 w-6 rounded-full flex items-center justify-center text-white
                  ${isDefault ? "bg-gray-400" : "bg-black"}
                `}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default RemoveScript;
