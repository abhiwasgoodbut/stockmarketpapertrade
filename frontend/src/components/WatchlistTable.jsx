import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import WatchlistRow from "./WatchlistRow";

const WatchlistTable = () => {
  const { watchlistData, loading, setSelectedstocks } = useAppContext();
  const navigate = useNavigate();

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div>
      {/* TABLE HEADER */}
      <  div className="grid grid-cols-[1.5fr_1fr_1fr] border-b px-4 py-2 font-semibold">
        <span>SCRIPT</span>
        < span className="text-center">BID</span>
        <span className="text-center">ASK</span>
      </div>

      {/* TABLE ROWS */}
      {watchlistData.map((item) => (
        <div onClick={()=>{navigate('/buysell') ; setSelectedstocks(item)}} key={item.symbol}>
            <  WatchlistRow key={item.symbol} item={item} />
        </div>
        
      ))}
    </div>
  );
};

export default WatchlistTable;
