import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    symbols: [
      {
        name: String,
        symbol: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

const Watchlist =  mongoose.model("Watchlist", watchlistSchema);

export default Watchlist
