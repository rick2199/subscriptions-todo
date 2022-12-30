import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const customer = await stripe.customers.create({
    email: (req.body.record.email as string).toLowerCase(),
  });
  const updates = { ...req.body.record, stripe_customer_id: customer.id };

  const { error, data } = await supabase
    .from("users")
    .upsert(updates)
    .eq("id", req.body.record.id);

  if (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
    res.end();
    return;
  }
  console.log({ data });

  res.send({ message: `stripe customer id created ${customer.id}` });
};

export default handler;
