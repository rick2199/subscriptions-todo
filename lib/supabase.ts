import { Database } from "@/utils/database.types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
