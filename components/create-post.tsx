"use client";

import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import { LuImage } from "react-icons/lu";
import { useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import userIcon from "@/public/img/user-icon.jpg";
import { uploadImgsToCloudinary } from "@/actions/cloundinary-actions";
import { User } from "@/types";
import useCreatePost from "@/hooks/useCreatePost";

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const CreatePost = ({ sessionUser }: { sessionUser: User }) => {
  const [post, setPost] = useState({
    text: "" as string,
    imgs: [] as { url: string; publicId: string; base64: string }[],
  });

  const [isPosting, setIsPosting] = useState(false);
  const { createPost } = useCreatePost();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const newImgs = await Promise.all(
        fileArray.map(async (file) => {
          const base64 = await convertFileToBase64(file);
          return {
            url: URL.createObjectURL(file),
            publicId: "",
            base64,
          };
        })
      );

      setPost((curr) => ({
        ...curr,
        imgs: [...curr.imgs, ...newImgs],
      }));
    }
  };

  const handleCreatePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!post.text.trim() && post.imgs?.length === 0) return;

    setIsPosting(true);

    const imgsBase64 = post.imgs.map(img => img.base64);
    const imgs = await uploadImgsToCloudinary(imgsBase64);

    createPost({ userId: sessionUser?._id, post: { text: post.text, imgs } }, {
      onSettled: () => {
        setPost({ text: "", imgs: [] });
        setIsPosting(false);
      }
    });
  };

  return (
    <div className="flex items-start gap-x-4 p-4 border-b border-gray-700 z-0">
      <figure className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image className="object-cover" src={sessionUser?.profileImg?.url || userIcon.src} alt="" width={40} height={40} />
      </figure>
      <div className="flex-1">
        <TextareaAutosize className="w-full mb-10 bg-transparent focus:outline-none resize-none" placeholder="What's happening?" minRows={1} maxRows={10} value={post.text} onChange={(e) => setPost(curr => ({ ...curr, text: e.target.value }))} />
        <hr className="mb-2 border-gray-700" />
        <div className="flex flex-wrap gap-2">
        {post?.imgs.map((img, idx) => {
          if (!img?.url) return;
          return (
            <div className="relative size-32 xl:size-40" key={idx}>
              <Image className="object-cover" src={img.url} alt={`uploaded-${idx}`} fill />
              <button type="button" className="absolute top-1 right-1 text-gray-500 hover:text-white" onClick={() => setPost((prev) => ({...prev, imgs: prev.imgs.filter((_, i) => i !== idx),}))}>
                <IoIosClose />
              </button>
            </div>
          )})}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex">
            <button className="p-2 rounded-full hover:bg-blue-500/50" onClick={handleButtonClick}><LuImage className="text-blue-500" /></button>
            <input className="hidden" type="file" ref={fileInputRef} onChange={handleFileChange} multiple />
          </div>
          <button className="py-0.5 px-3 rounded-full bg-blue-500 hover:bg-blue-600" onClick={handleCreatePost}>{isPosting ? "Posting..." : "Post"}</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;