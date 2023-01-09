import React from "react";
import { Users } from "../utils/database.types";
import Image from "next/image";
import { useMachine } from "@xstate/react";
import avatarMachine from "@/machines/avatar-machine";
import { downloadImage, uploadAvatar } from "@/utils/helpers";
import { Loader } from "./atoms/loader";

export default function Avatar({
  uid,
  url,
  onUpload,
}: {
  uid: string;
  url: Users["avatar_url"];
  onUpload: (url: string) => void;
}) {
  const [state, send] = useMachine(avatarMachine, {
    services: {
      fetchAvatar: downloadImage(url),
      updateAvatarSrc: async (context, event) => {
        return uploadAvatar({
          event: context.fieldEvent,
          onUpload,
          uid,
        });
      },
    },
  });

  const isLoading = state.matches("iddle");
  const isUpdating = state.matches("updateAvatar");
  const avatarUrl = state?.context?.avatarUrl;

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={150}
          height={150}
          className="h-[150px] w-[150px] rounded-full"
        />
      ) : isLoading ? (
        <div className="h-[150px] w-[150px] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <Image
          src="/avatar-placeholder.png"
          alt="avatar-placeholder"
          width={150}
          height={150}
          className="h-[150px] w-[150px]"
        />
      )}
      <div>
        <label
          className="bg-primary-light cursor-pointer px-4 py-2 rounded-md"
          htmlFor="single"
        >
          {isUpdating ? "Uploading ..." : "Upload"}
        </label>
        <input
          className="absolute hidden"
          type="file"
          id="single"
          accept="image/*"
          onChange={(event) =>
            send({ type: "avatarUrlInputChanged", fieldEvent: event })
          }
          disabled={isUpdating}
        />
      </div>
    </div>
  );
}
