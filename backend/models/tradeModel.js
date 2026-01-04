import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    pnl: {
      type: Number,
      default: 0
    },
    exitReason: {
  type: String,
  enum: ["MANUAL", "SL", "TP"],
  default: "MANUAL"
}
  },
  { timestamps: true }
);

const Trade = mongoose.model("Trade", tradeSchema);
export default Trade;