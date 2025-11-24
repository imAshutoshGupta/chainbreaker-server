import express from "express";
import { getStats, getGroups } from "../controllers/dashboardController.js";

const router = express.Router();

// Endpoint that your Telegram bot will call
router.get("/stats", getStats);
router.get('/groups', getGroups);

export default router;