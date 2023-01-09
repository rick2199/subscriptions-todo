import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Layout } from "@/components/layouts";
import { SubscriptionCard } from "@/components/molecules/cards";
import { Users } from "@/utils/database.types";
import { getActivePlansWithPrices } from "@/utils/helpers";
import {
  ProductWithPrice as SubscriptionPlan,
  SubscriptionPrice,
} from "@/utils/stripe.types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

interface Props {
  data: {
    subscriptionPlans: SubscriptionPlan[];
    user: Users;
  };
}

const Pricing: React.FC<Props> = ({ data }) => {
  const { subscriptionPlans, user } = data;

  return (
    <Layout user={user}>
      <div className="flex gap-8 items-center justify-center flex-col">
        <div className="text-center max-w-sm ">
          <Heading size="2xl" className="!font-extrabold ">
            To access the best todo list app
          </Heading>
          <Text className="mt-8 !text-2xl">You need to select a plan</Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10  gap-6">
          {subscriptionPlans.map((plan) => {
            return (
              <SubscriptionCard
                key={plan.id}
                user={user}
                prices={plan.prices as SubscriptionPrice[]}
                description={plan.description as string}
                name={plan.name as string}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;

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

  const data = await getActivePlansWithPrices();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return {
    props: {
      data: {
        subscriptionPlans: data || [],
        user: user ? user : null,
      },
    },
  };
};
