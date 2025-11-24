import express from 'express';
import { sendBroadcast } from '../controllers/broadcastController.js';

const router = express.Router();

// POST /api/broadcast -> Sends message to Telegram
router.post('/', sendBroadcast);

export default router;