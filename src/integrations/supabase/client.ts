// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://afkxycdkrlzjwwvlkxta.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFma3h5Y2Rrcmx6and3dmxreHRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExODI5ODcsImV4cCI6MjA1Njc1ODk4N30.7jlOQWOV3k-Mkzt77ny_YdxKOvFa7hKeQkuKG_CoA68";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);