"use client";

import { useScrollStore } from "@/providers/scroll-provider";
import { useEffect, useRef, useState } from "react";
import ProfileInfo from "./profile-info";
import ProfileTabs from "./profile-tabs";

const ProfileContainer = ({ username }: { username: string }) => {
  const [tab, setTab] = useState<string>("posts");

  const scrollStore = useScrollStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleStoreScrollPositions = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      scrollStore.current[`/${tab}`] = scrollTop;
    }
  };

  useEffect(() => {
    const scrollTop = scrollStore.current[`/${tab}`];
    if (scrollTop && containerRef.current) {
      containerRef.current.scrollTo({ top: scrollTop, behavior: "auto" });
    }
  }, [scrollStore]);

  return (
    <main className="flex-1 h-screen xs:border-r border-gray-700 overflow-auto hide-scrollbar" onScroll={handleStoreScrollPositions} ref={containerRef} id="scrollableDiv">
      <ProfileInfo username={username} />
      <ProfileTabs username={username} tab={tab} setTab={setTab} />
    </main>
  );
};

export default ProfileContainer;