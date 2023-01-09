import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const customer = await stripe.customers.create({
    email: (req.body.record.email as string).toLowerCase(),
  });

  const { data } = await supabase
    .from("prices")
    .select("id")
    .eq("unit_amount", 0)
    .eq("active", true);

  const priceId = data ? data[0].id : [];
  try {
    const user_id = req.body.record.id as string;
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId as string }],
    });
    const updates = {
      ...req.body.record,
      stripe_customer_id: customer.id,
      plan: "free",
    };

    const { error } = await supabase
      .from("users")
      .upsert(updates)
      .eq("id", user_id);

    const defaultTodoCategories = [
      {
        user_id,
        category: "Work",
      },
      {
        user_id,
        category: "Fun",
      },
      {
        user_id,
        category: "Home",
      },
      {
        user_id,
        category: "Finance",
      },
    ];

    defaultTodoCategories.forEach(async (category) => {
      const { error } = await supabase
        .from("todo_categories")
        .insert({ ...category });

      if (error) {
        console.log({ insertCategoryError: error });
      }
    });

    if (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
      res.end();
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err });
    res.end();
    return;
  }

  res.send({ message: `stripe customer id created ${customer.id}` });
};

export default handler;
