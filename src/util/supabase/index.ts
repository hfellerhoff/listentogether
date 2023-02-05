import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) throw new Error('Invalid supabase url');
if (!SUPABASE_ANON_KEY) throw new Error('Invalid supabase anon key');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
