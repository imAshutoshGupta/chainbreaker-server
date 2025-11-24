import { getBot } from "../services/telegramBot.js";

export const sendBroadcast = async (req, res) => {
  const { message, groupIds } = req.body;
  const bot = getBot();

  if (!bot) {
    return res.status(500).json({ error: "Bot is not initialized" });
  }

  if (!groupIds || !Array.isArray(groupIds)) {
    return res.status(400).json({ error: "groupIds array is required" });
  }

  let successCount = 0;

  // Send message to all requested groups
  for (const chatId of groupIds) {
    try {
      await bot.sendMessage(chatId, `🚨 **BROADCAST ALERT** 🚨\n\n${message}`);
      successCount++;
    } catch (err) {
      console.error(`Failed to send to ${chatId}:`, err.message);
    }
  }

  res.json({ 
    success: true, 
    sent_to: successCount, 
    failed: groupIds.length - successCount 
  });
};