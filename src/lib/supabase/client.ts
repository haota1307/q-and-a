import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  "https://zutgfzmyatwnrgewuwfs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dGdmem15YXR3bnJnZXd1d2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NjI2MjksImV4cCI6MjA0MTQzODYyOX0.ufOeanuYmh3hudUQlF222-PZ_MFzrnXQ2szpd-UlQPk"
);
