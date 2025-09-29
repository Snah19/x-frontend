"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getProfile } from "@/query-functions";
import Link from "next/link";
import axios from "axios";
import PostCard from "./post-card";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { LineWobble } from 'ldrs/react'
import 'ldrs/react/LineWobble.css';
import { useEffect, useRef } from "react";

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

const ProfileTabs = ({ username, tab }: { username: string, tab: string }) => {  
  const { data: user } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
  });
  
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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

  return (
    <>
    {user && (
      <>
        <div className="flex justify-between w-full border-b border-gray-700">
          <Link className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" href={`/profile/${username}?tab=posts`}>
            <span>Posts</span>
            {tab === "posts" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Posts</span>
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" href={`/profile/${username}?tab=likes`}>
            <span>Likes</span>
            {tab === "likes" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Likes</span>
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" href={`/profile/${username}?tab=reposts`}>
            <span>Reposts</span>
            {tab === "reposts" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Reposts</span>
              </div>
            )}
          </Link>
          <Link className="relative flex-1 flex justify-center items-center py-4 text-sm font-bold hover:bg-gray-800" href={`/profile/${username}?tab=favorite`}>
            <span>Favorite</span>
            {tab === "favorite" && (
              <div className="absolute bottom-0 h-1 rounded-full bg-blue-500">
                <span className="opacity-0">Favorite</span>
              </div>
            )}
          </Link>  
        </div>
        <ul className="z-0">
          {data?.pages?.map((page, i) => (
            <div key={i}>
              {page?.data?.map((post: Post) => (
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
      </>
    )}
    </>
  );
};

export default ProfileTabs;