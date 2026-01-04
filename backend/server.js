import express from "express"
import "dotenv/config"
import cors from "cors"
import yahooRouter from "./routes/yahooRoutes.js"
import searchRouter from "./routes/searchRoutes.js"
import connectDB from "./config/db.js"
import userRouter from "./routes/userRouter.js"
import { addToWatchlist } from "./controllers/watchlistController.js"
import watchlistRouter from "./routes/watchlistRouter.js"
import depositeRouter from "./routes/depositeRoute.js"
import tradeRouter from "./routes/tradeRoute.js"
import positionRouter from "./routes/positionRoute.js"
import withdrawRouter from "./routes/withdrawRoute.js"
import adminRouter from "./routes/adminAuthRoute.js"
// import { runAutoExecution } from "./service/autoExecutionEngine.js"

// setInterval(() => {
//     runAutoExecution
// }, 2000);


const app = express()

// Middelware
  
app.use(cors())
app.use(express.json())
await connectDB()

//Routes

app.get('/', (req,res) => res.send("server live"))
app.use('/api/watchlist',yahooRouter)
app.use('/api/search',searchRouter)
app.use('/api/user', userRouter)
app.use('/api/add', watchlistRouter)
app.use('/api',depositeRouter )
app.use('/api/trade',tradeRouter )
app.use('/api/position',positionRouter )
app.use('/api/withdraw',withdrawRouter )
app.use('/api/admin',adminRouter )

const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log("server is ruuning on ", PORT)
})