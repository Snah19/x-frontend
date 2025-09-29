"use client";

import PostCard from "./post-card";
import { Post } from "@/types";
import { useRouter } from "next/navigation";

const Posts = ({ posts }: { posts: Post[] }) => {
  const router = useRouter();

  return (
    <ul className="z-0">
      {posts && posts.map((post: Post) => (
        <li className="cursor-pointer" key={post?._id} onClick={() => router.push(`/${post?.user?.username}/status/${post?._id}`)}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
};

export default Posts;