import { useEffect, useRef, useState } from "react";

const WatchlistRow = ({ item }) => {
  const prevLtp = useRef(item.ltp);
  const prevBid = useRef(item.bid);
  const prevAsk = useRef(item.ask);

  const [ltpFlash, setLtpFlash] = useState(null);
  const [bidFlash, setBidFlash] = useState(null);
  const [askFlash, setAskFlash] = useState(null);

  useEffect(() => {
    // LTP
    if (item.ltp > prevLtp.current) setLtpFlash("up");
    else if (item.ltp < prevLtp.current) setLtpFlash("down");

    // BID
    if (item.bid > prevBid.current) setBidFlash("up");
    else if (item.bid < prevBid.current) setBidFlash("down");

    // ASK
    if (item.ask > prevAsk.current) setAskFlash("up");
    else if (item.ask < prevAsk.current) setAskFlash("down");

    prevLtp.current = item.ltp;
    prevBid.current = item.bid;
    prevAsk.current = item.ask;

    const timer = setTimeout(() => {
      setLtpFlash(null);
      setBidFlash(null);
      setAskFlash(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [item.ltp, item.bid, item.ask]);

  return (
    <div className="border-b px-4 py-2">
      <div className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-4">

        {/* LEFT : SCRIPT INFO */}
        <div>
          <div className="flex items-center gap-2">
            <span className="cursor-pointer font-semibold text-base">
              {item.name}
            </span>
            <span className="cursor-pointer text-xs text-gray-500">
              {item.expiry}
            </span>
          </div>

          {/* LTP */}
          <p
            className={`text-sm cursor-pointer font-medium transition-colors duration-300 ${
              ltpFlash === "up"
                ? "text-green-600"
                : ltpFlash === "down"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            LTP: {item.ltp}
          </p>

          <p
            className={`text-xs ${
              item.change < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            Chng:{item.change} ({item.changePercent}%)
          </p>

          <p className="text-[11px] text-gray-500">
            TICK: {item.tickTime}
          </p>
        </div>

        {/* BID */}
        <div className="text-center">
          <div
            className={`cursor-pointer font-semibold py-2 rounded-md text-sm transition-colors duration-300 ${
              bidFlash === "up"
                ? "bg-green-500 text-white"
                : bidFlash === "down"
                ? "bg-red-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {item.bid}
          </div>
          <p className="text-[11px] mt-0.5">
            H: {item.high}
          </p>
        </div>

        {/* ASK */}
        <div className="text-center">
          <div
            className={`font-semibold py-2 rounded-md text-sm transition-colors duration-300 ${
              askFlash === "up"
                ? "bg-green-500 text-white"
                : askFlash === "down"
                ? "bg-red-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {item.ask}
          </div>
          <p className="text-[11px] mt-0.5">
            L: {item.low}
          </p>
        </div>

      </div>
    </div>
  );
};

export default WatchlistRow;
