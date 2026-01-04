// routes/tradeRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { getMyTrades, placeTrade } from "../controllers/tradeController.js";

const tradeRouter = express.Router();
tradeRouter.post("/place", protect, placeTrade);
tradeRouter.get("/my", protect, getMyTrades);

export default tradeRouter;