import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import paymentQr from "../assets/payment_qr.jpg";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Deposit = () => {
  const navigate = useNavigate();
  const { user, token } = useAppContext();

  const [amount, setAmount] = useState("");
  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!amount || !utr || !screenshot) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("utr", utr);
      formData.append("screenshot", screenshot);

      const { data } = await axios.post(
        "/api/deposit",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (data.success) {
        toast.success("Deposit request submitted");
        navigate(-1);
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      {/* HEADER */}
      <div className="bg-blue-700 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-lg font-semibold">Deposit Request</h1>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg">Payment Details</h2>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border rounded-lg">
            <img src={paymentQr} alt="UPI Payment QR Code" className="w-56 h-56 object-contain rounded-lg shadow-sm border bg-white" />
            <p className="text-xs text-gray-500 mt-2">Scan QR Code to Pay</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700 flex justify-between items-center">
              <span><b>UPI ID:</b> <span className="font-mono text-blue-700 select-all font-semibold ml-1">Q340936975@ybl</span></span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("Q340936975@ybl");
                  toast.success("UPI ID copied!");
                }}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500 transition active:scale-95"
              >
                Copy
              </button>
            </p>
          </div>

          <p className="text-xs text-red-600 text-center font-medium">
            Please verify details before depositing. Upload transaction proof below.
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <h2 className="font-semibold text-lg">Deposit Form</h2>

          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              value={user?.username || ""}
              disabled
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Deposit Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">UTR / Transaction ID</label>
            <input
              placeholder="Enter UTR / RRN"
              value={utr}
              onChange={e => setUtr(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* UPLOAD */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Upload Screenshot
            </label>

            {!preview ? (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <span className="text-3xl">📷</span>
                <p className="text-sm text-gray-500 mt-2">
                  Click to upload screenshot
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-40 w-full object-contain rounded-lg border"
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    setScreenshot(null);
                  }}
                  className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ STICKY SUBMIT BUTTON */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t p-4 z-20">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Deposit"}
        </button>
      </div>
    </div>
  );
};

export default Deposit;