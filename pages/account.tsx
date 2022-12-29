import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import Avatar from "@/components/avatar";
import { useMachine } from "@xstate/react";
import authenticationMachine from "@/machines/auth-machine";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getProfile, updateProfile, Users } from "@/utils/helpers";

interface Props {
  data: {
    dbUser: Users;
  };
}

const Account: React.FC<Props> = ({ data }) => {
  const { dbUser: user } = data;
  const supabase = useSupabaseClient<Database>();

  const [current, send] = useMachine(authenticationMachine, {
    services: {
      fetchUser: getProfile({ userId: user?.id as string, supabase }),
      updateUserSrc: async (context, event) => {
        return updateProfile({
          userId: user?.id as string,
          supabase,
          avatar_url: context.newAvatar_url || current.context.user?.avatar_url,
          full_name: context.newFullName || current.context.user?.fullName,
        });
      },
    },
  });

  const fullName = current.context.user?.fullName;
  const avatar_url = current.context.user?.avatar_url;

  return (
    <div className="form-widget">
      <pre>{JSON.stringify(current.value)}</pre>
      <pre>{JSON.stringify(current.context)}</pre>
      <Avatar
        uid={user?.id as string}
        url={avatar_url as string}
        size={150}
        onUpload={(url) => {
          send({ type: "avatarUrlInputChanged", avatar_url: url });
          send("submit");
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email || ""} disabled />
      </div>
      <div>
        <label htmlFor="fullName">FullName</label>
        <input
          placeholder={fullName}
          type="text"
          onChange={(e) =>
            send({ type: "fullNameInputChanged", fullName: e.target.value })
          }
        />
      </div>

      <div>
        <button className="button primary block" onClick={() => send("submit")}>
          Update
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
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

  const { data } = await supabase.from("users").select("*");

  return {
    props: {
      data: {
        dbUser: data ? { ...data[0] } : [],
      },
    },
  };
};
