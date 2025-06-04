import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://xuuetjothuhnodhedyho.supabase.co';
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dWV0am90aHVobm9kaGVkeWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTI5ODUsImV4cCI6MjA2NDA2ODk4NX0.zSln8fqlZkSpQZCbxw7IGAAFYA1LqV-bijgVynOVAgs';

// initialize supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
