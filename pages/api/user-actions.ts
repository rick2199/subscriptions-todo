import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { error } = await supabase
        .from("user_action")
        .insert({ action_type: req.body.actionType, user_id: req.body.userId });

      if (error) {
        throw error;
      }

      res.status(200).json({ status: "ok" });
    } catch (err) {
      console.log({ err });
      res.status(400).json({ error: err });
    }
  }
  if (req.method === "GET") {
    const userId = req.query.userId;
    const now = new Date().toDateString();
    console.log({ now });

    try {
      const { data, error } = await supabase
        .from("user_action")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      const userActionsPerDay = data.filter(
        (item) => new Date(item.created_at as string).toDateString() === now
      );
      console.log({ userActionsPerDay });

      res.status(200).json(userActionsPerDay.length >= 5 ? true : false);
    } catch (err) {
      console.log({ err });
      res.status(400).json({ error: err });
    }
  }
};

export default handler;
