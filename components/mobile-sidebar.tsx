"use client";

import Image from "next/image";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { FaBell } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useRef } from "react";
import userIcon from "@/public/img/user-icon.jpg";
import { useRouter } from "next/navigation";
import useSessionUser from "@/hooks/useSessionUser";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

type MobileSidebarProps = {
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSidebar = ({ setIsMobileSidebarOpen }: MobileSidebarProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { sessionUser } = useSessionUser();

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsMobileSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut();
    toast("Logged out");
    router.push("/login");
  };

  return (
    <aside className="absolute inset-0 xs:hidden bg-white/10 z-50">
      <div className="flex flex-col w-72 min-h-screen border-r border-gray-700 bg-black" ref={menuRef}>

        <div className="pt-4 px-4">
          <button className="mb-2">
            <figure className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image className="object-cover" src={sessionUser?.profileImg?.url || userIcon.src} alt="" width={40} height={40} />
            </figure>
          </button>
          <Link className="block text-base font-bold" href="#">{sessionUser?.fullname}</Link>
          <p className="mb-2 text-sm text-gray-500">@{sessionUser?.username}</p>
        <div className="mb-4 space-x-4">
          <Link className="space-x-2 text-sm hover:underline" href="#">
            {sessionUser?.following?.length}
            <span className="text-gray-500"> Following</span>
          </Link>
          <Link className="space-x-2 text-sm hover:underline" href="#">
            {sessionUser?.followers?.length}
            <span className="text-gray-500"> Followers</span>
          </Link>
        </div>
        </div>

        <div className="flex-1 flex flex-col">
          <Link className="flex items-center gap-x-5 py-3 px-4 text-xl hover:bg-gray-700" href="/">
            <GoHomeFill className="text-2xl"/>
            <span>Home</span>
          </Link>
          <Link className="flex items-center gap-x-5 py-3 px-4 text-xl hover:bg-gray-700" href="/notifications">
            <FaBell className="text-2xl"/>
            <span>Notifications</span>
          </Link>
          <Link className="flex items-center gap-x-5 py-3 px-4 text-xl hover:bg-gray-700" href={`/profile/${sessionUser?.username}`}>
            <FaUser className="text-2xl"/>
            <span>Profile</span>
          </Link>

          <button className="flex items-center gap-x-5 mt-auto py-3 px-4 text-xl hover:bg-gray-700" onClick={handleLogout}>
            <FiLogOut className="text-2xl" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

export default MobileSidebar;