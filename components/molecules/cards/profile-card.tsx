import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { Users } from "@/utils/database.types";

interface Props {
  user: Users;
  avatarUrl: string;
  fullName: string;
  send: (event: any) => void;
}

const ProfileCard: React.FC<Props> = ({ user, avatarUrl, fullName, send }) => {
  return (
    <div className="bg-primary-dark flex flex-col gap-10 md:gap-0 md:flex-row text-white my-10 mx-auto max-w-3xl p-10 rounded-md justify-between items-center">
      <div>
        <Heading size="lg" className="text-center mb-8">
          Your Profile
        </Heading>
        <Avatar
          uid={user.id as string}
          url={avatarUrl as string}
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
  );
};

export default ProfileCard;
