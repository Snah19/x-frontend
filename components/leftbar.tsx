"use client";

import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { FaBell } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import ProfileButton from "./profile-button";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/query-functions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

const getTotalUnreadNotifications = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/total`, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    console.log("Error in getTotalUnreadNotifications function:", error.message);
  }
};

const Leftbar = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: 1
  });

  const { data: notifications } = useQuery({
    queryKey: ["totalUnreadNotifications"],
    queryFn: getTotalUnreadNotifications,
  });

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/login");
    }
  }, [data, isLoading]);

  console.log(data);

  return (
    <aside className="hidden xs:flex flex-col justify-between max-w-[15.625rem] min-h-screen p-2 border-r border-gray-700">
      <div>
        <a className="inline-block p-3 text-xl rounded-full hover:bg-gray-700" href="/">
          <BsTwitterX className="text-2xl" />
        </a>
        <div>
          <a className="block xl:inline-flex items-center gap-x-5 p-3 text-xl rounded-full hover:bg-gray-700" href="/">
            <GoHomeFill className="text-2xl" />
            <span className="hidden xl:inline-block">Home</span>
          </a>
          <Link className="block xl:inline-flex items-center gap-x-5 p-3 text-xl rounded-full hover:bg-gray-700" href="/notifications?type=all">
            <div className="relative">
              <FaBell className="text-2xl" />
              {notifications && notifications?.all !== 0 && (
                <div className="absolute -top-3 -right-2 inline-flex justify-center items-center size-5 text-xs rounded-full text-center bg-red-500">
                  {notifications?.all <= 99 ? <span>{notifications?.all}</span> : <span className="relative">99  <span className="absolute -top-1.5 -right-1.5">+</span></span>}
                </div>
              )}
            </div>
            <span className="hidden xl:inline-block">Notifications</span>
          </Link>
          <Link className="block xl:inline-flex items-center gap-x-5 p-3 text-xl rounded-full hover:bg-gray-700" href={`/profile/${data?.username}?tab=posts`}>
            <FaUser className="text-2xl" />
            <span className="hidden xl:inline-block">Profile</span>
          </Link>
        </div>
      </div>
      {data && <ProfileButton username={data?.username} fullname={data?.fullname} imgUrl={data?.profileImg?.url} />}
    </aside>
  );
};

export default Leftbar;