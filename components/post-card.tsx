"use client";

import Link from "next/link";
import Image from "next/image";
import { MdMoreHoriz } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { GoHeart } from "react-icons/go";
import { IoStatsChart } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { Post } from "@/types";
import userIcon from "@/public/img/user-icon.jpg";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import useLike from "@/hooks/useLike";
import useFavorite from "@/hooks/useFavorite";
import useRepost from "@/hooks/useRepost";
import axios from "axios";
import { deleteImgFromCloudinary } from "@/actions/cloundinary-actions";
import toast from "react-hot-toast";
import useDeleteComments from "@/hooks/useDeleteComments";
import useDeletePost from "@/hooks/useDeletePost";
import TextareaAutosize from "react-textarea-autosize";
import useUpdatePostText from "@/hooks/useUpdatePostText";
import useLoggedInUser from "@/hooks/useLoggedInUser";

const getTotalComments = async (postId: string) => {
  try {
    if (!postId) return 0;
    
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/total/${postId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const PostCard = ({ post }: { post: Post }) => {
  const { loggedInUser } = useLoggedInUser();

  const { data: totalComments } = useQuery({
    queryKey: ["totalComments", post?._id],
    queryFn: () => getTotalComments(post?._id)
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  const { like } = useLike();
  const { favorite } = useFavorite();
  const { repost } = useRepost();
  const { deleteComments } = useDeleteComments();
  const { deletePost } = useDeletePost();
  const { updatePostText } = useUpdatePostText();

  const isFollowing = loggedInUser?.following?.includes(post?.user?._id);

  const [isLiked, setIsLiked] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  
  const [likeCount, setLikeCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (loggedInUser) {
      setText(post?.text);

      setIsLiked(post?.likes?.includes(loggedInUser._id));
      setIsFav(post?.favorites?.includes(loggedInUser._id));
      setIsReposted(post?.reposts?.includes(loggedInUser._id));

      setLikeCount(post?.likes?.length || 0);
      setFavCount(post?.favorites?.length || 0);
      setRepostCount(post?.reposts?.length || 0);
    }
  }, [post, loggedInUser]);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    e.stopPropagation();

    like({ postId });
    setIsLiked(curr => !curr);
    setLikeCount(curr => isLiked ? curr - 1 : curr + 1);
  };

  const handleAddToFavorite = (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    e.stopPropagation();

    favorite({ postId });
    setIsFav(curr => !curr);
    setFavCount(curr => isFav ? curr - 1 : curr + 1);
  };

  const handleRepost = (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    e.stopPropagation();

    repost({ postId });
    setIsReposted(curr => !curr);
    setRepostCount(curr => isReposted ? curr - 1 : curr + 1);
  };

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsModalOpen(curr => !curr);
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, post: Post) => {
    e.stopPropagation();

    try {
      const publicIds = post?.imgs.map(({ publicId }) => publicId);
      for (const publicId of publicIds) {
        await deleteImgFromCloudinary(publicId);
      }

      deleteComments({ postId: post?._id });
      deletePost({ postId: post?._id });

      setIsModalOpen(false);
    }
    catch (error: any) {
      toast.error("Something when wrong!");
    }
  };

  const handleEditing = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsModalOpen(false);
    setText(text);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(post?.text.length, post?.text.length);
      }
    }, 0);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, postId: string) => {
    e.stopPropagation();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const updatedText = formData.get("text") as string;

    updatePostText({postId, text: updatedText});
    setText(updatedText);
    setIsEditing(false);
  };

  const handleReport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex justify-between items-start w-full">
        <div className="flex items-start gap-x-3 w-full">
          <Link href={`/profile/${post?.user?.username}`} onClick={(e) => e.stopPropagation()}>
            <figure className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image className="object-cover" src={post?.user?.profileImg?.url || userIcon.src} alt="" width={40} height={40} />
            </figure>
          </Link>
          <div className="w-full">
            <div>
              <Link className="text-sm leading-none" href={`/profile/${post?.user?.username}`} onClick={(e) => e.stopPropagation()}>{post?.user?.fullname}</Link>
              <span className="text-xs text-gray-500"> · {new Date(`${post?.createdAt}`).toDateString()}</span>
              {isFollowing && <span className="text-xs text-blue-500"> <span className="text-gray-500"> · </span> Following</span>}
            </div>
            <Link className="text-xs text-gray-500 hover:underline" href={`/profile/${post?.user?.username}`} onClick={(e) => e.stopPropagation()}>@{post?.user?.username}</Link>
            <article className="space-y-2">
              {isEditing ? (
                <form className="flex flex-col items-end" onSubmit={e => handleUpdate(e, post?._id)}>
                  <TextareaAutosize className="w-full mb-10 bg-transparent focus:outline-none resize-none" name="text" minRows={1} maxRows={10} onClick={e => e.stopPropagation()} ref={textareaRef} defaultValue={text} />
                  <div className="flex gap-x-4">
                    <button className="py-0.5 px-3 rounded-full hover:bg-white hover:text-black" type="button" onClick={(e) => { e.stopPropagation(); setIsEditing(false);}}>Cancel</button>
                    <button className="py-0.5 px-3 rounded-full bg-blue-500 hover:bg-blue-600" type="submit" onClick={e => e.stopPropagation()}>Update</button>
                  </div>
                </form>
              ) : (
                <p>{text}</p>
              )}
              <div className="flex flex-wrap w-full rounded-xl border border-gray-500 overflow-hidden">
                {post?.imgs.map((img, i) => (
                  <figure className="relative w-full aspect-video" key={i}>
                    <Image className="object-cover" src={img.url} alt="" fill />
                  </figure>
                ))}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-gray-500">
                  <button className="p-2"><FaRegComment /></button>
                  <span className="text-xs ">{totalComments || 0}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <button className="p-2" onClick={(e) => handleRepost(e, post?._id)}><BiRepost className={`text-xl ${isReposted && "text-green-500"}`} /></button>
                  <span className={`text-xs ${isReposted && "text-green-500"}`}>{repostCount}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <button className="p-2" onClick={(e) => handleLike(e, post?._id)}><GoHeart className={`${isLiked && "text-red-500"}`} /></button>
                  <span className={`text-xs ${isLiked && "text-red-500"}`}>{likeCount}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <button className="p-2" onClick={(e) => handleAddToFavorite(e, post?._id)}><FaRegBookmark className={`${isFav && "text-yellow-500"}`} /></button>
                  <span className={`text-xs ${isFav && "text-yellow-500"}`}>{favCount}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <button className="p-2"><IoStatsChart /></button>
                  <span className={`text-xs`}>{post?.views?.length || 0}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
        <div className="relative">
          <button className="p-1 rounded-full hover:bg-blue-500/20" onClick={handleOpenModal}><MdMoreHoriz /></button>
          {((loggedInUser?.username === post?.user?.username) && isModalOpen) && (
            <div className="absolute top-0 right-8 py-1 rounded-xl ring-1 ring-gray-500 bg-black">
              <button className="w-24 py-0.5 hover:bg-white/20" onClick={e => handleEditing(e, post?.text)}>Edit</button>
              <button className="w-24 py-0.5 hover:bg-white/20" onClick={(e) => handleDelete(e, post)}>Delete</button>
            </div>
          )}
          {((loggedInUser?.username !== post?.user?.username) && isModalOpen) && (
            <div className="absolute top-0 right-8 py-1 rounded-xl ring-1 ring-gray-500 bg-black">
              <button className="w-24 py-0.5 hover:bg-white/20" onClick={handleReport}>Report</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;