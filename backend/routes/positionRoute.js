import express from "express";
import { protect } from "../middleware/auth.js";
import { autoExitPosition, clearSLTP, getMyPositions, setSLTP, updatePositionPrices } from "../controllers/positionController.js";

const positionRouter = express.Router();

positionRouter.get("/my", protect, getMyPositions);
positionRouter.post("/set-sltp",protect,setSLTP);
positionRouter.post('/clear-sltp',protect,clearSLTP)
positionRouter.post('/auto-exit', protect, autoExitPosition)
// positionRouter.get("/update-prices", protect, updatePositionPrices);

export default positionRouter;