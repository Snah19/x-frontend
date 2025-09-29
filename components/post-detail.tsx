"use client";

import { getComments, getCurrentUser, getPost } from "@/query-functions";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./post-card";
import BackButton from "./back-button";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import userIcon from "@/public/img/user-icon.jpg";
import CommentCard from "./comment-card";
import { Comment } from "@/types";
import useComment from "@/hooks/useComment";
import { useState } from "react";

const PostDetail = ({ username, postId }: { username: string; postId: string }) => {
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  });

  const { data: post } = useQuery({
    queryKey: ["post", username, postId],
    queryFn: () => getPost(postId)
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId)
  });

  const [content, setContent] = useState("");

  const { comment } = useComment();

  const handleComment = () => {
    comment({ postId, content });
    setContent("");
  }

  return (
    <div>
      <div className="sticky top-0 flex items-center gap-x-2 mb-4 p-2 bg-black/50 backdrop-blur-md z-50">
        <BackButton />
        <p className="text-xl font-bold">Post</p>
      </div>
      <PostCard post={post} />
      <div className="">
        <div className="flex gap-x-4 p-4 border-b border-gray-700">
          <figure className="relative size-10 rounded-full overflow-hidden">
            <Image className="object-cover" src={currentUser?.profileImg?.url || userIcon.src} alt="" width={40} height={40} />
          </figure>
          <div className="flex-1 flex items-end gap-x-2">
            <TextareaAutosize className="w-full mb-10 bg-transparent focus:outline-none resize-none" placeholder="Add a comment" minRows={1} maxRows={10} value={content} onChange={(e) => setContent(e.target.value)} />
            <button className="ml-auto py-1 px-5 rounded-full bg-blue-500" onClick={handleComment}>Comment</button>
          </div>
        </div>
        <ul>
          {comments && comments.map((comment: Comment) => (
            <li key={comment?._id}>
              <CommentCard post={post} comment={comment} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostDetail;