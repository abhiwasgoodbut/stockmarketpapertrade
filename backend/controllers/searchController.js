import { INDIAN_STOCKS } from "../data/IndianStocks.js";

export const searchStocks = (req, res) => {
  return res.json({
    success: true,
    results: INDIAN_STOCKS
  });
};
