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

interface Props {
  data: {
    user: Users;
  };
}

const Account: React.FC<Props> = ({ data }) => {
  const { user } = data;

  const [state, send] = useMachine(authenticationMachine, {
    services: {
      fetchUser: getProfile({ userId: user?.id as string }),
      updateUserSrc: async (context, event) => {
        return updateProfile({
          user: user,
          email: user?.email as string,
          avatar_url: context.newAvatar_url || state.context.user?.avatar_url,
          full_name: context.newFullName || state.context.user?.full_name,
        });
      },
    },
  });

  const fullName = state.context.user?.full_name;
  const avatar_url = state.context.user?.avatar_url;

  return (
    <Layout user={user}>
      <Heading size="xl" className="text-center">
        Your Account Settings
      </Heading>

      <div className="bg-primary-dark flex flex-col gap-10 md:gap-0 md:flex-row text-white my-10 mx-auto max-w-3xl p-10 rounded-md justify-between items-center">
        <div>
          <Heading size="lg" className="text-center mb-8">
            Your Profile
          </Heading>
          <Avatar
            uid={user.id as string}
            url={avatar_url as string}
            onUpload={(url) => {
              send({ type: "avatarUrlInputChanged", avatar_url: url });
              send("submit");
            }}
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={user?.email || ""}
              disabled
              className="w-full rounded border-2 bg-neutral-100 py-2 px-4 font-body text-primary-dark"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName">Full Name</label>
            <input
              defaultValue={fullName}
              type="text"
              className="w-full rounded border-2 bg-neutral-100 py-2 px-4 font-body text-primary-dark"
              onChange={(e) =>
                send({ type: "fullNameInputChanged", fullName: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <Button
            title="Update Profile"
            color="bg-primary-light"
            className="px-4"
            handleClick={() => send({ type: "submit" })}
          />
        </div>
      </div>
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
