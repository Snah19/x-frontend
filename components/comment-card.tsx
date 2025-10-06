"use client";

import Link from "next/link";
import Image from "next/image";
import { GoHeart } from "react-icons/go";
import { Comment, Post } from "@/types";
import userIcon from "@/public/img/user-icon.jpg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useLikeComment from "@/hooks/useLikeComment";
import { TbChevronCompactDown } from "react-icons/tb";
import { TbChevronCompactUp } from "react-icons/tb";
import ReplyCard from "./reply-card";
import useReplyComment from "@/hooks/useReplyComment";
import useSessionUser from "@/hooks/useSessionUser";
import { io } from "socket.io-client";
import axios from "axios";

const getReplies = async (commentId: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/replies/${commentId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!);

const CommentCard = ({ post, comment }: { post: Post, comment: Comment }) => {
  const { sessionUser } = useSessionUser();
  const queryClient = useQueryClient();

  const { data: replies } = useQuery({
    queryKey: ["replies", comment?._id],
    queryFn: () => getReplies(comment?._id)
  });

  const [isReplying, setIsReplying] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { likeComment } = useLikeComment();
  const { reply } = useReplyComment();

  const isFollowing = sessionUser?.following?.includes(comment?.from?._id);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (sessionUser) {
      setIsLiked(comment?.likes?.includes(sessionUser._id));
      setLikeCount(comment?.likes?.length || 0);
    }
  }, [post, sessionUser]);

  const handleLikeComment = (e: React.MouseEvent<HTMLButtonElement>, commentId: string) => {
    e.stopPropagation();
    likeComment({ userId: sessionUser?._id, commentId });
    setIsLiked(curr => !curr);
  };

  useEffect(() => {
    if (isReplying && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isReplying]);

  const [content, setContent] = useState("");

  const toggleReplyBtn = () => {
    const text = `@${comment?.from?.username}: `;
    setContent(text);
    setIsReplying(curr => !curr);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(text.length, text.length);
      }
    }, 0);
  };

  const [showReplies, setShowReplies] = useState(false);

  const handleReplyComment = (commentId: string) => {
    if (!content.trim()) return;

    reply({ userId: sessionUser?._id, commentId , content });
    setContent("");
    setIsReplying(curr => !curr);
    setShowReplies(true);
  };

  useEffect(() => {
    socket.on("realtimeReply", (realtimeReply) => {
      if (realtimeReply.commentId === comment?._id) {
        queryClient.invalidateQueries({ queryKey: ["replies", comment?._id] });
      }
    });

    return () => {
      socket.off("realtimeReply");
    }
  }, []);

  useEffect(() => {
    const handleCommentLikesUpdate = ({ commentId: rtCommentId, totalLikes }: any) => {
      if (rtCommentId === comment._id) setLikeCount(totalLikes);
    };

    socket.on("realtimeCommentLikes", handleCommentLikesUpdate);

    return () => {
      socket.off("realtimeCommentLikes", handleCommentLikesUpdate);
    };
  }, [comment._id]);

  return (
    <div className="p-4 border-b border-gray-700">
      <div className="w-full">
        <div className="flex items-start gap-x-3 w-full">
          <Link href={`/profile/${comment?.from?.username}?tab=posts`} onClick={(e) => e.stopPropagation()}>
            <figure className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image className="object-cover" src={comment?.from?.profileImg?.url || userIcon.src} alt="" width={40} height={40} />
            </figure>
          </Link>
          <div className="w-full">
            <div>
              <Link className="text-xs text-gray-500 hover:underline" href={`/profile/${comment?.from?.username}`}>@{comment?.from?.username}</Link>
              <span className="text-xs text-gray-500"> · {new Date(`${comment?.createdAt}`).toDateString()}</span>
              {isFollowing && <span className="text-xs text-blue-500"> <span className="text-gray-500"> · </span> Following</span>}
            </div>
            <p className="mb-4">{comment?.content}</p>
            <div className="flex items-center gap-x-10 mb-4">
              <div className="flex items-center gap-x-2">
                <button onClick={(e) => handleLikeComment(e, comment?._id)}>
                  <GoHeart className={`${isLiked && "text-red-500"}`} />
                </button>
                <span className={`text-xs ${isLiked && "text-red-500"}`}>{likeCount}</span>
              </div>
              <button className="text-sm text-gray-300 hover:text-gray-200" onClick={toggleReplyBtn}>Reply</button>
            </div>
            {isReplying && (
              <div className="flex gap-x-4 transition-all duration-200 ease-out transform animate-fadeIn">
                <figure className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image className="object-cover" src={sessionUser?.profileImg?.url || userIcon.src} alt="" width={24} height={24} />
                </figure>
                <div className="flex items-end w-full pb-5 border-b border-gray-700">
                  <TextareaAutosize className="w-full bg-transparent focus:outline-none resize-none" placeholder="Add a reply" minRows={1} maxRows={10} ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} />
                  <button className="py-0.5 px-5 rounded-full bg-blue-500" onClick={() => handleReplyComment(comment?._id)}>Reply</button>
                </div>
              </div>
            )}
            {replies && replies?.length !== 0 && (
              <div className="mb-2">
                <button className="flex gap-x-2 text-xs text-blue-500" onClick={() => setShowReplies(curr => !curr)}>
                  {showReplies ? <TbChevronCompactUp className="text-base" /> : <TbChevronCompactDown className="text-base" />}
                  <span>{replies?.length} {replies?.length === 1 ? "reply" : "replies"}</span>
                </button>
              </div>
            )}
            {showReplies && (
              <ul>
                {replies && replies.map((reply: Comment) => (
                  <li key={reply?._id}>
                  <ReplyCard reply={reply} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;