import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://melqkkgtqswdyqintjwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHFra2d0cXN3ZHlxaW50andqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NDU0MDksImV4cCI6MjA2NDQyMTQwOX0.bQY2Zz6v-jkn7Tnc275ZAfK5HjB6m70ScBGonqpOdFE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);