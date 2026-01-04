import express from "express";
import { searchStocks } from "../controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/", searchStocks);

export default searchRouter;
