"use client";

import Image from "next/image";
import { useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import userIcon from "@/public/img/user-icon.jpg";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const ProfileButton = ({ username, fullname, imgUrl }: { username: string, fullname: string, imgUrl: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    toast("Logged out");
    signOut();
    setIsModalOpen(false);
  };

  return (
    <div className="relative hidden xs:block">
      <button className="flex items-center gap-x-2 w-full mx-auto xl:mx-0 xl:p-2 rounded-full xl:hover:bg-gray-700" onClick={() => setIsModalOpen(curr => !curr)}>
        <figure className="relative size-10 rounded-full overflow-hidden">
          <Image className="object-cover" src={imgUrl || userIcon.src} alt="" width={40} height={40} />
        </figure>
        <div className="hidden xl:block">
          <p className="text-sm leading-none">{fullname}</p>
          <span className="text-xs text-gray-500">@{username}</span>
        </div>
        <MdMoreHoriz className="hidden xl:block ml-auto" />
      </button>
      {isModalOpen && (
        <div className="absolute -top-16 w-64 py-2 rounded-2xl border border-gray-500 shadow-md shadow-white/50 bg-black overflow-hidden z-50">
          <button className="w-full py-2 px-3 text-left hover:bg-gray-700" onClick={handleLogout}>Log out @{username}</button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;