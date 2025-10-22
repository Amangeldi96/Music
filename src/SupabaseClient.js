import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dboarfesletxtvyjrhos.supabase.co'; // ← твой URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // ← твой ключ
export const supabase = createClient(supabaseUrl, supabaseKey);