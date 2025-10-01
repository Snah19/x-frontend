"use client";

import CreatePost from "./create-post";
import Topbar from "./topbar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useScrollStore } from "@/providers/scroll-provider";
import { useEffect, useRef } from "react";
import PostCard from "./post-card";
import axios from "axios";
import { Post } from "@/types";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import useLoggedInUser from "@/hooks/useLoggedInUser";

import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';

const getForYouFeed = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/for-you`, { params: { page: pageParam, limit: 10 } });
  return data;
};

const getFollowingFeed = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/following`, { params: { page: pageParam, limit: 10 }, withCredentials: true });
  return data;
};

const Home = ({ feed }: { feed: string }) => {
  const { loggedInUser } = useLoggedInUser();
  const router = useRouter();

  // ----------- STORE THE LATEST SCROLL POSITION ----------
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

  // ----------- INFINITE SCROLL WITH REACT QUERY -----------
  const { data: postsData, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: feed === "for-you" ? ["for-you"] : ["following"],
    queryFn: feed === "for-you" ? getForYouFeed : getFollowingFeed,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  const posts: Post[] = postsData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <main className="flex-1 h-screen xs:border-r border-gray-700 overflow-auto hide-scrollbar" ref={containerRef} onScroll={handleStoreScrollPositions} id="scrollableDiv">
      <Topbar loggedInUser={loggedInUser} feed={feed} />
      <CreatePost loggedInUser={loggedInUser} />

      <InfiniteScroll dataLength={posts.length} next={fetchNextPage} hasMore={hasNextPage} loader={<div className="my-5 text-center"><LineSpinner size="30" stroke="3" speed="1" color="#3B82F6" /></div>}scrollableTarget="scrollableDiv">
        {isLoading ? (
          <div className="my-5 text-center">
            <LineSpinner size="30" stroke="3" speed="1" color="#3B82F6" />
          </div>
        ) : (
          <ul className="z-0">
            {posts.map((post) => (
              <li className="cursor-pointer" key={post._id} onClick={() => router.push(`/${post.user.username}/status/${post._id}`)}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </InfiniteScroll>
    </main>
  );
};

export default Home;