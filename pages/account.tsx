import { Avatar } from "@/components/atoms/avatar";
import { useMachine } from "@xstate/react";
import authenticationMachine from "@/machines/auth-machine";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getProfile, updateProfile } from "@/utils/helpers";
import { Layout } from "@/components/layouts";
import { Heading } from "@/components/atoms/heading";
import { Button } from "@/components/atoms/button";
import { Users } from "@/utils/database.types";
import { ProfileCard } from "@/components/molecules/cards";
import { useEffect } from "react";
import avatarMachine from "@/machines/avatar-machine";

interface Props {
  data: {
    user: Users;
  };
}

const Account: React.FC<Props> = ({ data }) => {
  const { user } = data;

  const [authState, authSend] = useMachine(authenticationMachine, {
    services: {
      fetchUser: getProfile({ userId: user?.id as string }),
      updateUserSrc: async (context, event) => {
        return updateProfile({
          user: user,
          email: user?.email as string,
          avatar_url:
            context.newAvatar_url || authState.context.user?.avatar_url,
          full_name: context.newFullName || authState.context.user?.full_name,
        });
      },
    },
  });

  const fullName = authState.context.user?.full_name;
  const avatar_url = authState.context.user?.avatar_url;
  return (
    <Layout user={user}>
      <Heading size="xl" className="text-center">
        Your Account Settings
      </Heading>

      <ProfileCard
        avatarUrl={avatar_url as string}
        fullName={fullName as string}
        user={user}
        send={authSend}
      />
    </Layout>
  );
};

export default Account;

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

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return {
    props: {
      data: {
        user: user ?? null,
      },
    },
  };
};
