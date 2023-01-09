import { Heading } from "@/components/atoms/heading";
import { Layout } from "@/components/layouts";
import { LoginForm } from "@/components/organisms/forms";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

const Login = () => {
  return (
    <Layout user={null}>
      <div className="max-w-sm mx-auto px-6 md:px-0">
        <Heading size="lg">Login</Heading>
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;

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
