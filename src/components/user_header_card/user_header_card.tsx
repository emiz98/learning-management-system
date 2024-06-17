"use client";

import { signOut } from "next-auth/react";

type Props = {
  username: string | undefined | null;
  role: string | undefined | null;
};

const UserHeaderCard = ({ username, role }: Props) => {
  return (
    <div
      onClick={() => signOut()}
      className="flex items-center gap-x-2 p-1 rounded-full bg-slate-100 hover:bg-slate-200 duration-150 cursor-pointer"
    >
      <img
        src="/user.jpg"
        alt="user_image"
        className="rounded-full w-8 object-contain"
      />
      <div className="hidden md:flex flex-col font-medium mr-2">
        <h4 className="text-sm text-black">{username}</h4>
        <h6 className="text-xs text-gray-500">{role}</h6>
      </div>
    </div>
  );
};

export default UserHeaderCard;
