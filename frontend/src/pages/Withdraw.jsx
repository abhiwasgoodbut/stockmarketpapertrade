import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Withdraw = () => {
  const navigate = useNavigate();
  const { token, user } = useAppContext();

  const [method, setMethod] = useState("BANK");
  const [amount, setAmount] = useState("");

  // BANK
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");

  const handleSubmit = async () => {
    try {
      const payload =
        method === "BANK"
          ? {
              method,
              beneficiaryName,
              accountNumber,
              ifsc,
              amount: Number(amount)
            }
          : {
              method,
              upiId,
              amount: Number(amount)
            };

      const { data } = await axios.post(
        "/api/withdraw/create",
        payload,
        { headers: { Authorization: token } }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Withdrawal request submitted");
      navigate(-1);
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-lg font-semibold">Withdrawal Request</h1>
      </div>

      {/* BALANCE */}
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">Available Balance</p>
        <p className="text-2xl font-bold text-green-600">
          ₹ {Number(user?.balance || 0).toFixed(2)}
        </p>
      </div>

      {/* METHOD TABS */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow mb-5">
          <div className="grid grid-cols-2">
            <button
              onClick={() => setMethod("BANK")}
              className={`py-3 font-medium rounded-l-xl ${
                method === "BANK"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Bank Account
            </button>
            <button
              onClick={() => setMethod("UPI")}
              className={`py-3 font-medium rounded-r-xl ${
                method === "UPI"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"
              }`}
            >
              UPI
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          {method === "BANK" && (
            <>
              <input
                value={beneficiaryName}
                onChange={e => setBeneficiaryName(e.target.value)}
                placeholder="Beneficiary Name"
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Account Number"
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                value={ifsc}
                onChange={e => setIfsc(e.target.value)}
                placeholder="IFSC Code"
                className="w-full border rounded-lg px-3 py-2"
              />
            </>
          )}

          {method === "UPI" && (
            <input
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              placeholder="UPI ID (example@upi)"
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* SUBMIT BUTTON (NOT HIDDEN) */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold active:scale-95"
          >
            Submit Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;