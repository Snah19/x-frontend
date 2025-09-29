"use client";

import Link from "next/link";
import BackButton from "./back-button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
        <BackButton />
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
            <span>Follows</span>
            {notifications && notifications?.follows !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.follows <= 9 ? notifications?.follows : "9+"}</span>
              </div>
            )}
            {type === "follow" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Follows</span>
              </div>
            )}
          </Link>

          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=like">
            <span>Likes</span>
            {notifications && notifications?.likes !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.likes <= 9 ? notifications?.likes : "9+"}</span>
              </div>
            )}
            {type === "like" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Likes</span>
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=comment">
            <span>Comments</span>
            {notifications && notifications?.comments !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.comments <= 9 ? notifications?.comments : "9+"}</span>
              </div>
            )}
            {type === "comment" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Comments</span>
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=repost">
            <span>Reposts</span>
            {notifications && notifications?.reposts !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.reposts <= 9 ? notifications?.reposts : "9+"}</span>
              </div>
            )}
            {type === "repost" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Reposts</span>
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-3 text-sm font-bold hover:bg-gray-800" href="/notifications?type=favorite">
            <span>Favorites</span>
            {notifications && notifications?.favorites !== 0 && (
              <div className="absolute top-1 right-1 inline-flex justify-center items-center size-4 text-xs font-normal rounded-full text-center bg-red-500">
                <span>{notifications?.favorites <= 9 ? notifications?.favorites : "9+"}</span>
              </div>
            )}
            {type === "favorite" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Favorites</span>
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