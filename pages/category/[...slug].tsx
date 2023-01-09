import { Heading } from "@/components/atoms/heading";
import { Layout } from "@/components/layouts";
import { TodoTemplate } from "@/components/templates";
import { Database, Users } from "@/utils/database.types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

interface Props {
  data: {
    user: Users;
    todosByCategory: any[];
  };
}

const CategoryPage: React.FC<Props> = ({ data }) => {
  const { user, todosByCategory } = data;
  console.log({ todosByCategory });

  return (
    <Layout user={user}>
      {todosByCategory ? (
        <TodoTemplate todos={todosByCategory} user={user} />
      ) : (
        <div className="text-center">
          <Heading size="xl">Not Found</Heading>
        </div>
      )}
    </Layout>
  );
};

export default CategoryPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient<Database>(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session?.user.id)
    .single();

  const slug =
    (ctx.query.slug as string[])[0].charAt(0).toUpperCase() +
    (ctx.query.slug as string[])[0].slice(1);

  const { data: category } = await supabase
    .from("todo_categories")
    .select("*")
    .eq("category", slug)
    .eq("user_id", user?.id)
    .single();

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("category_id", category?.id)
    .eq("user_id", session?.user.id);

  const todosByCategory = todos?.map((todo) => {
    return {
      ...todo,
      category: category?.category,
    };
  });

  return {
    props: {
      data: {
        user: user ?? null,
        todosByCategory: todosByCategory ?? null,
      },
    },
  };
};
