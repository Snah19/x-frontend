"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getProfile } from "@/query-functions";
import axios from "axios";
import PostCard from "./post-card";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { SetStateAction, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';

const getUserPosts = async ({ username, pageParam = 1 }: {username: string, pageParam?: number}) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/user/${username}`, { params: { page: pageParam, limit: 10 } });
    return data;  
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const getLikedPosts = async ({ username, pageParam = 1 }: {username: string, pageParam?: number}) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/posts/liked/${username}`, { params: { page: pageParam, limit: 10 } });
    return data;  
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const getRepostedPosts = async ({ username, pageParam = 1 }: {username: string, pageParam?: number}) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/posts/repost/${username}`, { params: { page: pageParam, limit: 10 } });
    return data;  
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const getFavoritePosts = async ({ username, pageParam = 1 }: {username: string, pageParam?: number}) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/posts/favorite/${username}`, { params: { page: pageParam, limit: 10 } });
    return data;  
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const ProfileTabs = ({ username, tab, setTab }: { username: string; tab: string; setTab: React.Dispatch<SetStateAction<string>>; }) => {  
  const { data: user } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
  });
  
  const router = useRouter();

  const { data: postsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [tab, username],
    queryFn: ({ pageParam = 1 }) => {
      if (tab === "posts") return getUserPosts({ username, pageParam });
      else if (tab === "likes") return getLikedPosts({ username, pageParam });
      else if (tab === "reposts") return getRepostedPosts({ username, pageParam });
      else if (tab === "favorite") return getFavoritePosts({ username, pageParam });
    },
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

  const posts: Post[] = postsData?.pages.flatMap(page => page.data) ?? [];

  return (
    <>
      {user && (
        <>
          <div className="flex justify-between w-full border-b border-gray-700">
            <button className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" onClick={() => setTab("posts")}>
              <span>Posts</span>
              {tab === "posts" && (
                <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                  <span className="opacity-0">Posts</span>
                </div>
              )}
            </button>
            <button className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" onClick={() => setTab("likes")}>
              <span>Likes</span>
              {tab === "likes" && (
                <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                  <span className="opacity-0">Likes</span>
                </div>
              )}
            </button>
            <button className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" onClick={() => setTab("reposts")}>
              <span>Reposts</span>
              {tab === "reposts" && (
                <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                  <span className="opacity-0">Reposts</span>
                </div>
              )}
            </button>
            <button className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" onClick={() => setTab("favorite")}>
              <span>Favorite</span>
              {tab === "favorite" && (
                <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                  <span className="opacity-0">Favorite</span>
                </div>
              )}
            </button>  
          </div>

          <InfiniteScroll dataLength={posts.length} next={fetchNextPage} hasMore={hasNextPage} loader={<div className="my-5 text-center"><LineSpinner size="30" stroke="3" speed="1" color="#3B82F6" /></div>}scrollableTarget="scrollableDiv">
            <ul className="z-0">
              {posts.map(post => (
                <div key={post?._id}>
                  <li className="cursor-pointer" key={post?._id} onClick={() => router.push(`/${post?.user?.username}/status/${post?._id}`)}>
                    <PostCard post={post} />
                  </li>    
                </div>
              ))}
            </ul>
          </InfiniteScroll>
        </>
      )}
    </>
  );
};

export default ProfileTabs;