import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gktiihufvqupyovdukzg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdGlpaHVmdnF1cHlvdmR1a3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjAyNjIsImV4cCI6MjA5Mjk5NjI2Mn0.PzRyrUDyPsD8-vq_oEfosSl-BlEtLM0ixwUVmEWS_bY';

export const supabase = createClient(supabaseUrl, supabaseKey);