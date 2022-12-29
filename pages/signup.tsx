import { SignupForm } from "@/components/organisms/forms";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const Signup = () => {
  return (
    <div className="max-w-sm mx-auto">
      <SignupForm />
    </div>
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
