import TelegramBot from "node-telegram-bot-api";
import { processMessage } from "./rumorProcessor.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;

export const initBot = () => {
  if (!token) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN is missing. Bot will not start.");
    return;
  }

  // Create the bot instance
  // polling: true -> The bot goes to Telegram servers to fetch messages
  bot = new TelegramBot(token, { polling: true });

  console.log("🤖 ChainBreaker Bot is active and listening...");

  // Handle Incoming Messages
  bot.on("message", async (msg) => {
    // ✅ DEBUG LOG: See exactly what Telegram sends us
    console.log("📩 RAW MESSAGE:", JSON.stringify(msg, null, 2));

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) {
      console.log("⚠️ Received non-text message (sticker/photo). Ignoring.");
      return; 
    }

    // 1. Direct Call (No Axios/HTTP needed!)
    const result = await processMessage(chatId, text);

    // 2. Send Reply
    if (result.reply) {
      bot.sendMessage(chatId, result.reply);
    }
  });

  // Handle Errors
  bot.on("polling_error", (error) => {
    // Ignore harmless timeout errors, log real ones
    if (error.code !== 'ETELEGRAM' || !error.message.includes('timout')) {
      console.error(`[Telegram Error] ${error.code}: ${error.message}`);
    }
  });
};

// Export the bot instance so the Dashboard can use it for Broadcasts
export const getBot = () => bot;