import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gktiihufvqupyovdukzg.supabase.co';
const supabaseKey = 'sb_publishable_Xw6clTISTBh6RoAqhznlrQ_8oBKs_XA';

export const supabase = createClient(supabaseUrl, supabaseKey);