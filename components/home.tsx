"use client";

import { LineWobble } from "ldrs/react";
import CreatePost from "./create-post";
import Topbar from "./topbar";
import 'ldrs/react/LineWobble.css';
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/query-functions";
import { useScrollStore } from "@/providers/scroll-provider";
import { useEffect, useRef } from "react";
import PostCard from "./post-card";
import axios from "axios";
import { Post } from "@/types";
import { useRouter } from "next/navigation";

const getForYouFeed = async ({ pageParam = 1 }) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/for-you`,
      { params: { page: pageParam, limit: 10 } }
    );
    return data;
  } catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const getFollowingFeed = async ({ pageParam = 1 }) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/following`,
      { params: { page: pageParam, limit: 10 }, withCredentials: true }
    );
    return data;
  } catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const Home = ({ feed }: { feed: string }) => {
  //#region - Get the logged in user
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
  //#endregion

  //#region - Store the latest scroll positions
  const scrollStore = useScrollStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleStoreScrollPositions = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      scrollStore.current[`/${feed}`] = scrollTop;
    }
  };

  useEffect(() => {
    const scrollTop = scrollStore.current[`/${feed}`];
    if (scrollTop && containerRef.current) {
      containerRef.current.scrollTo({ top: scrollTop, behavior: "auto" });
    }
  }, [scrollStore]);
  //#endregion

  //#region - Infinite Scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: feed === "for-you" ? ["for-you"] : ["following"],
    queryFn: feed === "for-you" ? getForYouFeed : getFollowingFeed,
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
  //#endregion

  const router = useRouter();
  
  return (
    <main className="flex-1 h-screen xs:border-r border-gray-700 overflow-auto hide-scrollbar" ref={containerRef} onScroll={handleStoreScrollPositions}>
      <Topbar currentUser={currentUser} feed={feed} />
      <CreatePost currentUser={currentUser} />
      <ul className="z-0">
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.data.map((post: Post) => (
              <li className="cursor-pointer" key={post?._id} onClick={() => router.push(`/${post?.user?.username}/status/${post?._id}`)}>
                <PostCard post={post} />
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
    </main>
  );
};

export default Home;