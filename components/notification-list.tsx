"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import NotificationCard from "./notification-card";
import { getCurrentUser } from "@/query-functions";
import { Notification } from "@/types";
import axios from "axios";
import { useEffect, useRef } from "react";
import { LineWobble } from 'ldrs/react';
import 'ldrs/react/LineWobble.css';

const getNotifications = async ({ type, pageParam } :{type: string, pageParam: number}) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications?type=${type}`, { params: { page: pageParam, limit: 10 }, withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const NotificationList = ({ type }: { type: string }) => {
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["notifications", currentUser?.username, type],
    queryFn: ({ pageParam = 1 }) => getNotifications({ type, pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      }, { threshold: 1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };

  }, [fetchNextPage, hasNextPage]);

  return (
    <>
      <ul>
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.data.map((notification: Notification) => (
            <li key={notification?._id}>
              <NotificationCard notification={notification} />
            </li>
            ))}
          </div>
        ))}
      </ul>
      <div ref={loadMoreRef} className="my-5 text-center">
        {isFetchingNextPage && (
          <LineWobble size="40" stroke="2" bgOpacity="0.1" speed="1.75" color="white" />
        )}
      </div>
    </>
  );
};

export default NotificationList;