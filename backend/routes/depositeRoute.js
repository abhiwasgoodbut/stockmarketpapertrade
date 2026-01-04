import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { createDeposit, getDepositHistory } from "../controllers/depositeController.js";

const depositeRouter = express.Router();

depositeRouter.post(
  "/deposit",
  protect,
  upload.single("screenshot"),
  createDeposit
);
depositeRouter.get('/history',protect,getDepositHistory)

export default depositeRouter;