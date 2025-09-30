"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaComment, FaRegBookmark, FaUserFriends } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { BiRepost } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";

const getTotalUnreadNotifications = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/total`, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    console.log("Something went wrong:", error.message);
  }
};

const NotificationTopbar = ({ type }: { type: string }) => {
  const { data: notifications } = useQuery({
    queryKey: ["totalUnreadNotifications"],
    queryFn: getTotalUnreadNotifications,
  });

  return (
    <div className="sticky top-0 py-1 px-2 border-b border-gray-700 bg-black/50 backdrop-blur-md z-50">
      <div className="flex items-center gap-x-4">
        <Link className="p-2 rounded-full hover:bg-gray-800" href="/">
          <IoMdArrowRoundBack className="text-xl" />
        </Link>
        <div className="flex justify-between w-full">
          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=all">
            <span>All</span>
            {type === "all" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">All</span>
              </div>
            )}
          </Link>

          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=follow">
            <span className="hidden md:inline">Follows</span>
            <FaUserFriends className="inline md:hidden text-2xl text-white" />
            {notifications && notifications?.follows !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.follows <= 9 ? notifications?.follows : "9+"}</span>
              </div>
            )}
            {type === "follow" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="hidden md:inline opacity-0">Follows</span>
                <FaUserFriends className="inline md:hidden opacity-0 text-2xl text-white" />
              </div>
            )}
          </Link>

          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=like">
            <span className="hidden md:inline">Likes</span>
            <GoHeart className="inline md:hidden text-2xl text-white" />
            {notifications && notifications?.likes !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.likes <= 9 ? notifications?.likes : "9+"}</span>
              </div>
            )}
            {type === "like" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="hidden md:inline opacity-0">Likes</span>
                <GoHeart className="inline md:hidden opacity-0 text-2xl text-white" />
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=comment">
            <span className="hidden md:inline">Comments</span>
            <FaComment className="inline md:hidden text-2xl text-white" />
            {notifications && notifications?.comments !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.comments <= 9 ? notifications?.comments : "9+"}</span>
              </div>
            )}
            {type === "comment" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="hidden md:inline opacity-0">Comments</span>
                <FaComment className="inline md:hidden opacity-0 text-2xl text-white" />
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=repost">
            <span className="hidden md:inline">Reposts</span>
            <BiRepost className="inline md:hidden text-2xl text-white" />
            {notifications && notifications?.reposts !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.reposts <= 9 ? notifications?.reposts : "9+"}</span>
              </div>
            )}
            {type === "repost" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="hidden md:inline opacity-0">Reposts</span>
                <BiRepost className="inline md:hidden opacity-0 text-2xl text-white" />
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=favorite">
            <span className="hidden md:inline">Favorites</span>
            <FaRegBookmark className="inline md:hidden text-2xl text-white" />
            {notifications && notifications?.favorites !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.favorites <= 9 ? notifications?.favorites : "9+"}</span>
              </div>
            )}
            {type === "favorite" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="hidden md:inline opacity-0">Favorites</span>
                <FaRegBookmark className="inline md:hidden opacity-0 text-2xl text-white" />
              </div>
            )}
          </Link>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};

export default NotificationTopbar;