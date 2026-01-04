import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
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

    qty: {
      type: Number,
      required: true,
      min: 0
    },

    avgPrice: {
      type: Number,
      required: true
    },

    currentPrice: {
      type: Number,
      required: true
    },

    invested: {
      type: Number,
      required: true
    },

    pnl: {
      type: Number,
      default: 0
    },

    /* =====================
       🔻 SL / TP (OPTIONAL)
       ===================== */

    stopLoss: {
      type: Number,
      default: null
    },

    takeProfit: {
      type: Number,
      default: null
    },

    slEnabled: {
      type: Boolean,
      default: false
    },

    tpEnabled: {
      type: Boolean,
      default: false
    },

    /* =====================
       STATUS
       ===================== */

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN"
    },
    exitReason: {
  type: String,
  enum: ["MANUAL", "SL", "TP"],
  default: "MANUAL"
}

  },
  { timestamps: true }
);

const Position = mongoose.model("Position", positionSchema);
export default Position;