"use client";

import { useScrollStore } from "@/providers/scroll-provider";
import NotificationList from "./notification-list";
import NotificationTopbar from "./notification-topbar";
import { useEffect, useRef } from "react";

const Notifications = ({ type }: { type: string }) => {
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


  return (
    <main className="flex-1 h-screen xs:border-r border-gray-700 overflow-auto hide-scrollbar" onScroll={handleScroll} ref={containerRef}>
      <NotificationTopbar type={type} />
      <NotificationList type={type} />
    </main>
  );
};

export default Notifications;