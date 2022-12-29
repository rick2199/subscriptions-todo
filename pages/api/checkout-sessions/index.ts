import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

const monthlyPrice = process.env.STRIPE_MONTHLY_PRICE as string;
const annualPrice = process.env.STRIPE_YEARLY_PRICE as string;
const localUrl = process.env.NEXT_PUBLIC_LOCAL_SITE_URL as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = req.query.token;
    if (!token) {
      res.status(401);
      res.end();
      return;
    }
    // const plan = req.body.plan;
    try {
      const { data, error } = await supabase.auth.getUser(token as string);
      if (error) throw error;
      const userId = data.user.id;

      const { data: userData } = await supabase
        .from("users")
        .select()
        .eq("id", userId);
      console.dir({ userData }, { depth: Infinity });

      //   const checkoutSession = await stripe.checkout.sessions.create({
      //     mode: "subscription",
      //     customer: user.customerId,
      //     line_items: [
      //       {
      //         price: plan === "MONTHLY" ? monthlyPrice : annualPrice,
      //         quantity: 1,
      //       },
      //     ],
      //     subscription_data: {
      //       trial_period_days: 7,
      //     },
      //     success_url: `${localUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      //     cancel_url: `${localUrl}/go-premium#pricing`,
      //   });
      //   res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
