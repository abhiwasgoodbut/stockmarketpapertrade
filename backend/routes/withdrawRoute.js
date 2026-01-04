import express from "express";
import {
  createWithdrawRequest,
  getMyWithdrawHistory
} from "../controllers/withdrawController.js";
import {protect} from "../middleware/auth.js";

const withdrawRouter = express.Router();

withdrawRouter.post("/create", protect, createWithdrawRequest);
withdrawRouter.get("/my", protect, getMyWithdrawHistory);

export default withdrawRouter;