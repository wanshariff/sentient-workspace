// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cjefvfbomxgzgrmjtnej.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZWZ2ZmJvbXhnemdybWp0bmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjQzOTYsImV4cCI6MjA2NjMwMDM5Nn0.7rC1QBtjFc3cxt1WC8NwQIxfO7h7mXqzlHxkOEpQiYg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);