import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqvkeeegqhlibdjmjrdm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdmtlZWVncWhsaWJkam1qcmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDcxOTksImV4cCI6MjA3NjcyMzE5OX0.2ErdtSBX_t8y2RFmImcsqhbPa7NCB80Zvkc8uP9e4kI';

export const supabase = createClient(supabaseUrl, supabaseKey);