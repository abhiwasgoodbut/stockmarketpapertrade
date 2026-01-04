import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Terms = () => {
  const { token, setUser } = useAppContext();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const acceptTerms = async () => {
    if (!agree) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/user/accept-terms",
        {},
        {
          headers: { Authorization: token }
        }
      );

      if (data.success) {
        toast.success("Terms accepted successfully");
        setUser(prev => ({ ...prev, termsAccepted: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div className="bg-blue-700 text-white px-6 py-4 text-lg font-semibold">
        Terms & Conditions
      </div>

      {/* TERMS LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm text-gray-800">
        {[
          "No position in any script will be held for more than 2 weeks. A rollover is required within this period.",
          "Market trade timing of GIFT Nifty is from 6:32 AM to 2:45 AM. US Indices from 3:32 AM to 2:30 AM. US Stocks from 7:02 PM to 2:30 AM. COMEX, Crypto, and Currency markets from 3:32 AM to 2:30 AM.",
          "Time Limit Notice: In FOREX, Crypto, and US Stocks, if any trade is closed before 15 minutes, the trade will be deleted and the profit gained will also be removed.",
          "If any script undergoes bonus, dividend, or split, the contract will be squared off at the last quotation of the next day.",
          "Please deposit into the bank mentioned in the application or call the helpline for deposit instructions.",
          "Tick (CF) to carry forward your position to the next day; otherwise, it will be squared off at the quotation price. CF timing for NSE is 3:15 PM and for MCX is 11:15 PM.",
          "Change your password after receiving it; otherwise, we are not responsible for any misuse of your ID or password.",
          "BTST (Buy Today Sell Tomorrow) and STBT (Sell Today Buy Tomorrow) are not allowed.",
          "Trades will be auto squared-off if the loss reaches 95% or 100% of the capital.",
          "Line trades or operator-based calls will not be valid for profit.",
          "No new trades can be placed in banned scripts. Only existing positions can be squared off.",
          "Deposit and withdrawal timings for all segments are from 8:40 AM to 11:40 PM.",
          "Trading on the National Stock Exchange (NSE) begins at 9:17 AM, while trading on the Multi Commodity Exchange (MCX) starts at 9:02 AM.",
          "All Stop-Loss (SL) and Take-Profit (TP) orders will be passed at the Last Traded Price (LTP).",
          "This application is designed for individual students to exchange views on market training purposes only.",
          "This is a virtual trading application with all the features of real trading, but no real money is involved."
        ].map((term, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg px-3 py-2 shadow-sm"
          >
            <b>{index + 1}.</b> {term}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="bg-white border-t p-4">
        <label className="flex items-center gap-2 text-sm mb-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I have read and agree to the Terms & Conditions
        </label>

        <button
          onClick={acceptTerms}
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Accept & Continue"}
        </button>
      </div>
    </div>
  );
};

export default Terms;