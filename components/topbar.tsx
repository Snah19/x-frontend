"use client";

import Link from "next/link";
import Image from "next/image";
import { BsTwitterX } from "react-icons/bs";
import { useState } from "react";
import MobileSidebar from "./mobile-sidebar";
import userIcon from "@/public/img/user-icon.jpg";
import { User } from "@/types";

const Topbar = ({ currentUser, feed } : { currentUser: User, feed: string }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      {isMobileSidebarOpen && <MobileSidebar setIsMobileSidebarOpen={setIsMobileSidebarOpen} />}

      <nav className="sticky top-0 flex items-center gap-x-8 mx-auto bg-black/50 backdrop-blur-md z-40">
        <div className="flex-1 xs:flex xs:items-start space-y-4 xs:space-y-0">
          <div className="flex xs:hidden justify-between items-center pt-4 px-4">
            <button onClick={() => setIsMobileSidebarOpen(curr => !curr)}>
              <figure className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image className="object-cover" src={currentUser?.profileImg?.url || userIcon.src} alt="" width={32} height={32} />
              </figure>
            </button>
            <Link href="/" className="transform -translate-x-1/2">
              <BsTwitterX className="text-2xl" />
            </Link>
            <div />
          </div>
          <div className="flex justify-between w-full border-b border-gray-700">
            <Link className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" href="/">
              <span>For you</span>
              {feed === "for-you" && (
                <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                  <span className="opacity-0">For you</span>
                </div>
              )}
            </Link>
            <Link className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" href="/?feed=following">
              <span>Following</span>
              {feed === "following" && (
                <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                  <span className="opacity-0">Following</span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Topbar;