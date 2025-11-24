import { supabase } from "../config/supabase.js";

export const getStats = async (req, res) => {
  try {
    const [groups, rumors] = await Promise.all([
      supabase.from('groups').select('*', { count: 'exact' }),
      supabase.from('rumors').select('*').order('created_at', { ascending: false }).limit(20)
    ]);

    res.json({
      groupCount: groups.count || 0,
      recentRumors: rumors.data || [],
      activeThreats: (rumors.data || []).filter(r => r.status === 'verified_fake').length
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Add this function for the Broadcast Panel
export const getGroups = async (req, res) => {
  try {
    const { data, error } = await supabase.from('groups').select('chat_id, name');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};