import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const searchKey = req.query.search as string;
  const userId = req.query.userId;
  if (req.method !== "GET") {
    throw new Error("Method not allowed");
  }
  try {
    const { data: todos } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId);

    const todosWithCategory = todos
      ? await Promise.all(
          todos.map(async (todo) => {
            const { data: categoryRes } = await supabase
              .from("todo_categories")
              .select("category")
              .eq("id", todo.category_id)
              .eq("user_id", userId)
              .single();

            return {
              ...todo,
              category: categoryRes?.category,
            };
          })
        )
      : null;

    const filteredSearchTodos = todosWithCategory?.filter((item) =>
      item.todo?.toLowerCase().includes(searchKey.toLowerCase())
    );

    res.status(200).json({ fetchedTodos: filteredSearchTodos });
  } catch (err) {
    res.status(400);
  }
};

export default handler;
