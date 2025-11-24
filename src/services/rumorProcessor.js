import { supabase } from "../config/supabase.js";

export const processMessage = async (chatId, text, groupName = "Unknown Group") => {
  console.log(`🧠 Processing for ${chatId}: ${text.substring(0, 50)}...`);

  // 1. Ensure Group Exists in DB
  const { error: groupError } = await supabase
    .from('groups')
    .upsert({ chat_id: chatId.toString(), name: groupName })
    .select();

  if (groupError) console.error("Group Save Error:", groupError.message);

  // 2. Save the Rumor/Message
  const isSuspicious = text.toLowerCase().includes("forwarded") || text.length > 50;
  const status = isSuspicious ? "pending_verification" : "safe";

  const { error: rumorError } = await supabase
    .from('rumors')
    .insert({
      content: text,
      source_group_id: chatId.toString(),
      status: status,
      risk_score: isSuspicious ? 75 : 10
    });

  if (rumorError) console.error("Rumor Save Error:", rumorError.message);

  // 3. Return Reply
  if (isSuspicious) {
    return {
      reply: "⚠️ ChainBreaker: Analyzing this message for potential misinformation...",
      status: "suspicious"
    };
  }

  return { reply: null, status: "safe" }; // Don't reply to safe messages to avoid spam
};