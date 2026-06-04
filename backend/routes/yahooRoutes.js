import express from "express"
import { getWatchlist, getWatchlistFake } from "../controllers/marketController.js";


const yahooRouter = express.Router();

yahooRouter.post('/data', getWatchlist)
yahooRouter.post('/fake', getWatchlistFake)

export default yahooRouter;