import { ProductWithPrice } from "./stripe.types";
import { supabase } from "../lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type Users = Database["public"]["Tables"]["users"]["Row"];

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  if (error) {
    throw error;
  }

  return (data as any) || [];
};

export const getProfile: any = async ({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SupabaseClient<any, "public", any>;
}) => {
  if (!userId) throw new Error("No user");

  let { data, error, status } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  return {
    full_name: data?.full_name,
    avatar_url: data?.avatar_url,
  };
};

export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const passwordRegex = /^.{6,}$/;
export const usernameRegex = /^[a-zA-Z0-9]+$/;

export const updateProfile: any = async ({
  userId,
  full_name,
  avatar_url,
  supabase,
}: {
  userId: string;
  full_name: Users["full_name"];
  avatar_url: Users["avatar_url"];
  supabase: SupabaseClient<any, "public", any>;
}) => {
  try {
    if (!userId) throw new Error("No user");
    const updates = {
      id: userId,
      full_name,
      avatar_url,
    };
    let { error } = await supabase
      .from("users")
      .upsert(updates)
      .eq("id", userId);

    if (error) throw error;
    alert("Profile updated!");
  } catch (error) {
    alert("Error updating the data!");
    console.log(error);
  }
};
