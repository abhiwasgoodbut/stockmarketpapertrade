import mongoose from "mongoose";

const depositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    utr: {
      type: String,
      required: true
    },

    screenshot: {
      type: String, // Cloudinary URL
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    adminRemark:{
      type: String
    }
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);
export default Deposit;