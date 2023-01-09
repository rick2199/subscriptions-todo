import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const priceId = req.query.priceId;
    const userId = req.query.userId;

    try {
      const { data } = await supabase
        .from("prices")
        .select("unit_amount, currency")
        .eq("id", priceId)
        .eq("active", true)
        .single();

      const { data: userData } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", userId)

        .single();

      const { client_secret } = await stripe.paymentIntents.create({
        currency: data?.currency as string,
        customer: userData?.stripe_customer_id as string,
        setup_future_usage: "off_session",
        amount: data?.unit_amount as number,
      });

      res.status(200).json(client_secret);
    } catch (err) {
      console.log({ err });

      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
