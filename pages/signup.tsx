import { SignupForm } from "@/components/organisms/forms";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Heading } from "@/components/atoms/heading";
import { Layout } from "@/components/layouts";

const Signup = () => {
  return (
    <Layout user={null}>
      <div className="max-w-sm px-6 md:px-0 mx-auto">
        <Heading size="lg">Sign up</Heading>
        <SignupForm />
      </div>
    </Layout>
  );
};

export default Signup;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      data: [],
    },
  };
};
