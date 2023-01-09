import { Database } from "@/utils/database.types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useReactSupabaseClient = () => {
  const supabase = useSupabaseClient<Database>();
  return { supabase };
};
