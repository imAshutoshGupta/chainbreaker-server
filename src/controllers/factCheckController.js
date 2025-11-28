// controllers/factCheckController.js

export const factCheck = async (req, res) => {
    try {
      const { message, userId } = req.body;
  
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
  
      console.log("Message received from Telegram:", {
        userId,
        message
      });
  
      // Here you can:
      // - process the message
      // - run fact-checking logic
      // - store it in DB
      // - call OpenAI / Gemini etc.
  
      res.json({
        success: true,
        reply: "Fact check processed successfully, This is Krishna from Backend!"
      });
  
    } catch (error) {
      console.error("FactCheck error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };