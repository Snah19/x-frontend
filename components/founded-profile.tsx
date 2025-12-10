"use client";

import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import EditProfileButton from "./edit-profile-button";
import UploadButton from "./upload-button";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { useState } from "react";
import { User } from "@/types";
import { CiMail } from "react-icons/ci";
import { AiOutlineCloudUpload } from "react-icons/ai";
import userIcon from "@/public/img/user-icon.jpg";
import FollowButton from "./follow-button";
import { IoMdArrowRoundBack } from "react-icons/io";
import useSessionUser from "@/hooks/useSessionUser";

const FoundedProfile = ({ user }: { user: User }) => {
  const { sessionUser } = useSessionUser();

  const isCurrentUser = sessionUser?.username === user?.username;

  const [profileImg, setProfileImg] = useState({
    url: user?.profileImg?.url,
    publicId: user?.profileImg?.publicId,
    base64: "",
    isNew: false,
  });

  const [coverImg, setCoverImg] = useState({
    url: user?.coverImg?.url,
    publicId: user?.coverImg?.publicId,
    base64: "",
    isNew: false,
  });

  const [updateBtnVisible, setUpdateBtnVisible] = useState(false);

  const getImg = (e: React.ChangeEvent<HTMLInputElement>): Promise<{ url: string; base64: string }> => {
    return new Promise((resolve, reject) => {
      const files = e.target.files;
      if (!files || !files[0]) return reject("No file selected");

      const file = files[0];
      const url = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve({ url, base64: reader.result });
        } else {
          reject("Could not read file");
        }
      };
      reader.onerror = () => reject("File reading failed");
      reader.readAsDataURL(file);
    });
  };

  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const img = await getImg(e);
      setProfileImg(curr => ({ ...curr, ...img, isNew: true }));
      setUpdateBtnVisible(true);
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const img = await getImg(e);
      setCoverImg(curr => ({ ...curr, ...img, isNew: true }));
      setUpdateBtnVisible(true);
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="sticky top-0 flex items-center gap-x-4 py-1 px-2 border-b border-gray-700 bg-black/50 backdrop-blur-md z-50">
        <Link prefetch className="p-2 rounded-full hover:bg-gray-800" href="/">
          <IoMdArrowRoundBack className="text-xl" />
        </Link>
        <div>
          <p className="text-sm font-medium">{user?.fullname}</p>
          <span className="text-xs text-gray-500">{user?.totalPosts} posts</span>
        </div>
      </div>

      <div className="relative w-full h-[12.5rem] bg-gray-600">
        {coverImg?.url && <Image className="object-cover" src={coverImg?.url} alt="" fill />}
        {isCurrentUser && (
          <label className="absolute top-1/2 right-1/2 text-3xl cursor-pointer text-gray-500 hover:text-white">
            <AiOutlineCloudUpload />
            <input className="hidden" type="file" accept="image/*" onChange={handleCoverChange} />
          </label>
        )}
      </div>

      <div className="-mt-[4.5rem] p-4">
        <div className="flex justify-between items-center mb-4">
          <figure className="relative size-32 rounded-full border-4 border-black bg-white overflow-hidden group">
            <Image className="object-cover" src={profileImg?.url ? profileImg?.url : userIcon.src} alt="" width={128} height={128} />
            {isCurrentUser && (
              <label htmlFor="profile-img" className="absolute top-4 right-4 hidden group-hover:block p-1 text-xs rounded-full bg-blue-500 cursor-pointer ">
                <FiEdit2 />
                <input className="hidden" id="profile-img" name="profile-img" type="file" accept="image/*" onChange={handleProfileChange} />
              </label>
            )}
          </figure>
          {isCurrentUser && (
            <div className="flex items-center gap-x-2">
              <EditProfileButton user={user} />
              {updateBtnVisible && <UploadButton profileImg={profileImg} coverImg={coverImg} setProfileImg={setProfileImg} setCoverImg={setCoverImg} setUpdateBtnVisible={setUpdateBtnVisible} />}
            </div>
          )}
          {!isCurrentUser && (
            <FollowButton sessionUser={sessionUser} user={user} />
          )}
        </div>
        <div>
          <h2 className="text-xl font-medium">{user?.fullname}</h2>
          <p className="mb-2 text-xs text-gray-500">@{user?.username}</p>
          <p className="mb-2 text-sm">{user?.bio}</p>
          <div className="space-y-2">
            <p className="flex items-center gap-x-2 text-sm text-gray-500">
              <CiMail />
              <span>{user?.email}</span>
            </p>        
            {user?.link && (
              <Link prefetch className="flex items-center gap-x-2 text-sm" href={`${user?.link}`}>
                <FaLink className="text-gray-500" />
                <span className="text-blue-500">{user?.link}</span>
              </Link>
            )}
            <p className="flex items-center gap-x-2 text-sm text-gray-500">
              <IoCalendarOutline />
              <span>Joined {new Date(`${user?.createdAt}`).toDateString()}</span>
            </p>
            <div className="flex items-center gap-x-2">
              <Link prefetch className="text-sm hover:underline" href="/">
                {user?.following.length} <span className="text-gray-500">Following</span>
              </Link>
              <Link prefetch className="text-sm hover:underline" href="/">
                {user?.followers.length} <span className="text-gray-500">{user?.followers.length === 1 ? "follower" : "followers"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoundedProfile;