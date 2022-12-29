import SubscriptionCard from "@/components/subscription-card";
import { Users } from "@/utils/helpers";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

interface Props {
  data: {
    dbUser: Users;
  };
}

const Home: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <h1>To access the best todo list app</h1>
      <p>You need to select a plan</p>
      <SubscriptionCard />
    </div>
  );
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { data } = await supabase.from("users").select("*");

  return {
    props: {
      data: {
        dbUser: data ? { ...data[0] } : [],
      },
    },
  };
};
