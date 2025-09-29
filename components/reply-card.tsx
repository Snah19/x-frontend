"use client";

import Link from "next/link";
import Image from "next/image";
import { GoHeart } from "react-icons/go";
import { Comment, Post } from "@/types";
import userIcon from "@/public/img/user-icon.jpg";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/query-functions";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useLikeComment from "@/hooks/useLikeComment";
import { TbChevronCompactDown } from "react-icons/tb";
import { TbChevronCompactUp } from "react-icons/tb";

const ReplyCard = ({ reply }: { reply: Comment }) => {
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  });

  const [isReplying, setIsReplying] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { likeComment } = useLikeComment();

  const isFollowing = currentUser?.following?.includes(reply?.from?._id);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(reply?.likes?.includes(currentUser._id));
      setLikeCount(reply?.likes?.length || 0);
    }
  }, [reply, currentUser]);

  const handleLikeComment = (e: React.MouseEvent<HTMLButtonElement>, commentId: string) => {
    e.stopPropagation();
    likeComment({ commentId });
    setIsLiked(curr => !curr);
    setLikeCount(curr => isLiked ? curr - 1 : curr + 1);
  };

  useEffect(() => {
    if (isReplying && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isReplying]);

  const [content, setContent] = useState("");

  const toggleReplyBtn = () => {
    const text = `@${reply?.from?.username}: `;
    setContent(text);
    setIsReplying(curr => !curr);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(text.length, text.length);
      }
    }, 0);
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="w-full">
        <div className="flex items-start gap-x-3 w-full">
          <Link href={`/profile/${reply?.from?.username}?tab=posts`} onClick={(e) => e.stopPropagation()}>
            <figure className="relative w-7 h-7 rounded-full overflow-hidden">
              <Image className="object-cover" src={reply?.from?.profileImg?.url || userIcon.src} alt="" width={28} height={28} />
            </figure>
          </Link>
          <div className="w-full">
            <div>
              <Link className="text-xs text-gray-500 hover:underline" href={`/profile/${reply?.from?.username}`}>@{reply?.from?.username}</Link>
              <span className="text-xs text-gray-500"> · {new Date(`${reply?.createdAt}`).toDateString()}</span>
              {isFollowing && <span className="text-xs text-blue-500"> <span className="text-gray-500"> · </span> Following</span>}
            </div>
            <p className="mb-4">{reply?.content}</p>

            <div className="flex items-center gap-x-10 mb-4">
              <div className="flex items-center gap-x-2">
                <button onClick={(e) => handleLikeComment(e, reply?._id)}>
                  <GoHeart className={`${isLiked && "text-red-500"}`} />
                </button>
                <span className={`text-xs ${isLiked && "text-red-500"}`}>{likeCount}</span>
              </div>
              {/* <button className="text-sm text-gray-300 hover:text-gray-200" onClick={toggleReplyBtn}>Reply</button> */}
            </div>

            {/* {isReplying && (
              <div className="flex gap-x-4 transition-all duration-200 ease-out transform animate-fadeIn">
                <figure className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image className="object-cover" src={currentUser?.profileImg?.url || userIcon.src} alt="" width={24} height={24} />
                </figure>
                <div className="flex items-end w-full">
                  <TextareaAutosize className="w-full bg-transparent focus:outline-none resize-none" placeholder="Add a reply" minRows={1} maxRows={10} ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} />
                  <button className="py-0.5 px-5 rounded-full bg-blue-500" >Reply</button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;