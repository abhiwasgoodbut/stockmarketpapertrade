const WatchlistTabs = () => {
  return (
    <div className="bg-sky-100 text-sm">
      < div className="flex justify-between px-6 py-2">
        <span className="font-semibold border-b-2 border-blue-700">
          Watchlist 1
        </span>
        <span>Watchlist 2</span>
        <span>Watchlist 3</span>
      </div>

      <div className="text-center text-red-600 font-semibold py-1">
        ** DOLLAR RATE ** <span className="text-black">USD 90 POINTS</span>
      </div>
    </div>
  );
};

export default WatchlistTabs;
