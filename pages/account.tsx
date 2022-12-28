import {
  useUser,
  useSupabaseClient,
  SupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import { Database } from "../utils/database.types";
import Avatar from "@/components/avatar";
import { useMachine } from "@xstate/react";
import authenticationMachine from "@/machines/auth-machine";
type Users = Database["public"]["Tables"]["users"]["Row"];

const getProfile: any = async ({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SupabaseClient<any, "public", any>;
}) => {
  if (!userId) throw new Error("No user");

  let { data, error, status } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  return {
    full_name: data?.full_name,
    avatar_url: data?.avatar_url,
  };
};

const updateProfile: any = async ({
  userId,
  full_name,
  avatar_url,
  supabase,
}: {
  userId: string;
  full_name: Users["full_name"];
  avatar_url: Users["avatar_url"];
  supabase: SupabaseClient<any, "public", any>;
}) => {
  try {
    if (!userId) throw new Error("No user");
    const updates = {
      id: userId,
      full_name,
      avatar_url,
    };
    let { error } = await supabase
      .from("users")
      .upsert(updates)
      .eq("id", userId);

    console.log({ error });

    if (error) throw error;
    alert("Profile updated!");
  } catch (error) {
    alert("Error updating the data!");
    console.log(error);
  }
};

export default function Account() {
  const supabase = useSupabaseClient<Database>();
  const session = useSession();
  const user = useUser();

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
      <>
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
          <input id="email" type="text" value={session?.user.email} disabled />
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
          <button
            className="button primary block"
            onClick={() => send("submit")}
          >
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
      </>
    </div>
  );
}
