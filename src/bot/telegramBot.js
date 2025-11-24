import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

// Enable polling so the bot receives messages
const bot = new TelegramBot(botToken, { polling: true });

// When a user sends a message to your bot
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log("Received from user:", { chatId, text });

  try {
    // Send this message to your backend API
    const response = await axios.post("http://localhost:4000/api/factCheck", {
      userId: chatId,
      message: text
    });

    // Send backend response back to Telegram user
    bot.sendMessage(chatId, response.data.reply);

  } catch (error) {
    console.error("Error connecting to backend:", error.message);
    bot.sendMessage(chatId, "❌ Error processing your message");
  }
});

console.log("Telegram bot is running...");
