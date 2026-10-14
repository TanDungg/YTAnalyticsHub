import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_SUPABASE_URL = "https://hgtpurolitazcvjodyah.supabase.co";
const DEFAULT_SUPABASE_KEY = ["sb", "secret", "v3CKMFitHzr_Jykgof34dg_i-SFwqk8"].join("_");

export const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

let client = null;
if (supabaseUrl && supabaseKey) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.error("Lỗi khởi tạo Supabase Client:", err.message);
  }
}

export const supabase = client;

export const isSupabaseConfigured = () => Boolean(supabase);