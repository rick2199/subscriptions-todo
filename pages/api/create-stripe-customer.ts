import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const customer = await stripe.customers.create({
    email: (req.body.record.email as string).toLowerCase(),
  });
  console.log({ customer });

  const { error, data } = await supabase
    .from("users")
    .update({ stripe_customer_id: customer.id })
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
