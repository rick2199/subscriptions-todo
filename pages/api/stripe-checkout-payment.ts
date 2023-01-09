import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

const localUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paymentIntentId = req.query.payment_intent as string;

  try {
    const { customer, amount, payment_method, status } =
      await stripe.paymentIntents.retrieve(paymentIntentId);
    if (status === "succeeded") {
      if (customer) {
        const paymentMethod = await stripe.paymentMethods.attach(
          payment_method as string,
          {
            customer: customer as string,
          }
        );

        await stripe.customers.update(customer as string, {
          invoice_settings: {
            default_payment_method: paymentMethod.id,
          },
        });

        const subscriptionData = await stripe.subscriptions.list({
          customer: customer as string,
          limit: 1,
        });

        const { data: priceData } = await supabase
          .from("prices")
          .select("*")
          .eq("unit_amount", amount)
          .single();

        const subscriptionId = subscriptionData.data[0].id;

        const updates: Stripe.SubscriptionUpdateParams = {
          items: [
            {
              id: subscriptionData.data[0].items.data[0].id,
              plan: priceData?.id,
              quantity: 1,
            },
          ],
        };

        const subscriptionUpdated = await stripe.subscriptions.update(
          subscriptionId,
          updates
        );
        if (subscriptionUpdated) {
          const price = (priceData?.unit_amount ?? 0) / 100;
          const { error } = await supabase
            .from("users")
            .update({ plan: price === 15 ? "monthly" : "annually" })
            .eq("stripe_customer_id", customer);

          if (error) {
            throw error;
          }
          res.status(200);
          res.redirect(localUrl as string);
        }
      }
    } else {
      res.status(500);
      res.redirect(localUrl as string);
    }
  } catch (err) {
    console.log({ err });
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
    res.redirect(localUrl as string);
  }
}
