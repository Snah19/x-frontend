"use client";

import Leftbar from "@/components/leftbar";
import NotificationCard from "@/components/notification-card";
import NotificationTopbar from "@/components/notification-topbar";
import { Notification } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import Rightbar from "@/components/rightbar";
import { useScrollStore } from "@/providers/scroll-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';
import useSessionUser from "@/hooks/useSessionUser";
import { useRouter } from "next/navigation";

const getNotifications = async ({ userId, type, pageParam } :{userId: string, type: string, pageParam: number}) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${userId}`, { params: { type, page: pageParam, limit: 10 } });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const NotificationsPage = () => {
  const { sessionUser } = useSessionUser();
  const router = useRouter();
  if (!sessionUser) {
    router.replace("/login");
  }

  const [type, setType] = useState("all");

  const scrollStore = useScrollStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const key = `/${type}`;
    const saved = scrollStore.current[key];
    if (saved !== undefined && containerRef.current) {
      containerRef.current.scrollTo({ top: saved, behavior: "auto" });
    }
  }, [scrollStore]);

  const handleScroll = () => {
    if (containerRef.current) {
      const key = `/${type}`;
      scrollStore.current[key] = containerRef.current.scrollTop;
    }
  };

  const { data: notificationsData, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["notifications", sessionUser?.username, type],
    queryFn: ({ pageParam = 1 }) => getNotifications({ userId: sessionUser?._id, type, pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled: !!sessionUser?._id,
  });

  const notifications: Notification[] = notificationsData?.pages.flatMap(page => page.data) ?? [];
  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <main className="flex-1 h-screen xs:border-r border-gray-700 overflow-auto hide-scrollbar" onScroll={handleScroll} ref={containerRef} id="scrollableDiv">
          <NotificationTopbar type={type} setType={setType} />
          <InfiniteScroll dataLength={notifications.length} next={fetchNextPage} hasMore={hasNextPage} loader={<div className="my-5 text-center"><LineSpinner size="30" stroke="3" speed="1" color="#3B82F6" /></div>} scrollableTarget="scrollableDiv">
            <ul>
              {notifications.map((notification: Notification) => (
                <li key={notification?._id}>
                  <NotificationCard notification={notification} />
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        </main>
      </div>
      <Rightbar />
    </>
  );
};

export default NotificationsPage;