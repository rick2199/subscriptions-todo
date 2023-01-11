import { ProductWithPrice } from "./stripe.types";
import { supabase } from "../lib/supabase";
import { TodoPriority, Users } from "./database.types";
import { Todo } from "@/machines/todos-machine";

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z");
  t.setSeconds(secs);
  return t;
};

export interface Menu {
  label: string;
  children?: Menu[];
  path: string;
  target?: boolean;
}

export const getActivePlansWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true);

  if (error) {
    throw error;
  }

  const subscriptionPlanWithPrice = data.map((product: any) => {
    return {
      ...product,
      prices: product.prices?.map((price: any) => {
        return {
          id: price.id,
          currency: price.currency,
          unit_amount: price.unit_amount,
        };
      }),
    };
  });

  const freePLan = subscriptionPlanWithPrice.filter(
    (plan) => plan.name === "Free Plan"
  );
  const monthlyPlan = subscriptionPlanWithPrice.filter(
    (plan) => plan.name === "Monthly Plan"
  );

  subscriptionPlanWithPrice.splice(0, 1, ...freePLan);

  subscriptionPlanWithPrice.splice(1, 1, ...monthlyPlan);
  return subscriptionPlanWithPrice || [];
};

export const getProfile: any = async ({ userId }: { userId: string }) => {
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
  user,
  full_name,
  avatar_url,
  email,
}: {
  user: Users;
  full_name: Users["full_name"];
  avatar_url: Users["avatar_url"];
  email: Users["email"];
}) => {
  try {
    if (!user.id) throw new Error("No user");
    const updates = {
      id: user.id,
      full_name,
      avatar_url,
      email,
    };
    let { error } = await supabase
      .from("users")
      .upsert(updates)
      .eq("id", user.id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
};

export const downloadImage: any = async (path: string) => {
  if (!path) return;
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) {
      throw error;
    }
    return URL.createObjectURL(data);
  } catch (error) {
    console.log("Error downloading image: ", error);
  }
};

export const uploadAvatar = async ({
  event,
  uid,
  onUpload,
}: {
  event: any;
  uid: string;
  onUpload: (filePath: string) => void;
}) => {
  try {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${uid}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }
    onUpload(filePath);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const saveTodo = async ({
  todo,
  user,
}: {
  todo: Todo | null;
  user: Users;
}) => {
  const todoData = {
    category_id: todo?.categoryId as string,
    user_id: user?.id,
    todo: todo?.task,
    priority: todo?.priority.toLowerCase() as TodoPriority,
    started_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("todos").insert({ ...todoData });
  if (error) {
    console.log({ error });
    return false;
  }
  return true;
};
