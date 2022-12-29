import { stripe } from "@/utils/stripe";
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log({ body: req.body });

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  const { error } = await supabase
    .from("users")
    .update({ stripe_customer_id: customer.id })
    .eq("id", req.body.record.id);

  if (error) {
    res.status(500).json({ error: error.message });
    res.end();
    return;
  }
  res.send({ message: `stripe customer id created ${customer.id}` });
};

export default handler;
