import express from "express";
import { adminDashboard, adminLogin, getAllDeposits, getAllTradesAdmin, getAllUsers, getAllWithdraws, getTradeStatsAdmin, updateDepositStatus, updateUser, updateWithdrawStatus, verifyAdmin } from "../controllers/adminauthController.js";
import adminAuth from "../middleware/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/verify", verifyAdmin);
adminRouter.get("/dashboard",adminAuth, adminDashboard);
adminRouter.get("/users",adminAuth, getAllUsers);
adminRouter.put("/users/:id",adminAuth, updateUser);
adminRouter.get('/deposits',adminAuth,getAllDeposits);
adminRouter.put('/deposits/:depositId',adminAuth,updateDepositStatus)
adminRouter.get('/withdraws', adminAuth, getAllWithdraws)
adminRouter.put('/withdraws/:id',adminAuth,updateWithdrawStatus)
adminRouter.get("/trades", adminAuth,getAllTradesAdmin);
adminRouter.get("/trades/stats",adminAuth,getTradeStatsAdmin)

export default adminRouter;