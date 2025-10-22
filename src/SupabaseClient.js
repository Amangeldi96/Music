import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dboarfesletxtvyjrhos.supabase.co'; // ← твой URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRib2FyZmVzbGV0eHR2eWpyaG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDM4NTEsImV4cCI6MjA3NjcxOTg1MX0.UQm6jfPlPuUm2EEB9WfAiP3-M6ZKJUEjnln_P3fivl0';

export const supabase = createClient(supabaseUrl, supabaseKey);