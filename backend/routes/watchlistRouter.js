import express from "express"
import { protect } from "../middleware/auth.js"
import { addToWatchlist, getUserWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js"


const watchlistRouter = express.Router()

watchlistRouter.post('/addtowatchlist',protect,addToWatchlist)
watchlistRouter.get('/mywatchlist',protect,getUserWatchlist)
watchlistRouter.delete('/removewatchlist',protect,removeFromWatchlist)


export default watchlistRouter