"use client";

import ProfileTabs from "@/components/profile-tabs";
import Leftbar from "@/components/leftbar";
import Rightbar from "@/components/rightbar";
import ProfileInfo from "@/components/profile-info";
import { useParams, useSearchParams } from "next/navigation";
import { useScrollStore } from "@/providers/scroll-provider";
import { useEffect, useRef } from "react";

const ProfilePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const username = typeof params.username === "string" ? params.username : Array.isArray(params.username) ? params.username[0] : "";
  const tab = searchParams.get("tab") || "posts";

  //#region - Store the latest scroll positions
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
  //#endregion

  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <main className="flex-1 h-screen xs:border-r border-gray-700 overflow-auto hide-scrollbar" onScroll={handleStoreScrollPositions} ref={containerRef}>
          <ProfileInfo username={username} />
          <ProfileTabs username={username} tab={tab} />
        </main>
      </div>
      <Rightbar />
    </>
  );
};

export default ProfilePage;
