import { Layout } from "@/components/layouts";
import { TodoTemplate } from "@/components/templates";
import { Database, Users } from "@/utils/database.types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

interface Props {
  data: {
    user: Users;
    todos: any;
  };
}

const Home: React.FC<Props> = ({ data }) => {
  const { user, todos } = data;

  return (
    <Layout user={user}>
      <TodoTemplate todos={todos} user={user} />
    </Layout>
  );
};

export default Home;

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

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", session?.user.id);

  const todosWithCategory = todos
    ? await Promise.all(
        todos.map(async (todo) => {
          const { data: categoryRes } = await supabase
            .from("todo_categories")
            .select("category")
            .eq("id", todo.category_id)
            .eq("user_id", user?.id)
            .single();

          return {
            ...todo,
            category: categoryRes?.category,
          };
        })
      )
    : null;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        data: {
          user: user,
          todos: todosWithCategory,
        },
      },
    };
  }
};
