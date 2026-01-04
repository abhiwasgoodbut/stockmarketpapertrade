import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    method: {
      type: String,
      enum: ["UPI", "BANK"],
      required: true
    },

    // UPI
    upiId: {
      type: String
    },

    // Bank
    beneficiaryName: {
      type: String
    },
    accountNumber: {
      type: String
    },
    ifsc: {
      type: String
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },

    remark: {
      type: String // admin rejection note
    }
  },
  { timestamps: true }
);

export default mongoose.model("Withdraw", withdrawSchema);