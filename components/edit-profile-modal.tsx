"use client";

import useSessionUser from "@/hooks/useSessionUser";
import { updateProfile } from "@/mutation-functions";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const EditProfileModal = ({ user, setIsModalOpen }: {user: User, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;} ) => {
  const queryClient = useQueryClient();
  const modelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { sessionUser } = useSessionUser();

  const handleClickOutside = (e: MouseEvent) => {
    if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { mutate: updatePfInfo } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", sessionUser?.username] });
      setIsModalOpen(false);
      toast("Updated");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const link = formData.get("link") as string;
    const bio = formData.get("bio") as string;
    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;

    updatePfInfo({ userId: sessionUser?._id ,user: { username, fullname, email, link, bio, currentPassword, newPassword } });
    router.replace(`/profile/${username}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black rounded-lg shadow-lg w-[31.25rem] p-6 relative  border border-gray-500" ref={modelRef}>
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <form className="grid grid-cols-2 gap-2" onSubmit={handleSubmit}>
          <input type="text" className="w-full border border-gray-500 rounded-md p-2 bg-black focus:outline-none" placeholder="Fullname" name="fullname" defaultValue={user?.fullname}/>
          <input type="text" className="w-full border border-gray-500 rounded-md p-2 bg-black focus:outline-none" placeholder="Username" name="username" defaultValue={user?.username}/>
          <input type="text" className="w-full border border-gray-500 rounded-md p-2 bg-black focus:outline-none" placeholder="Email" name="email" defaultValue={user?.email}/>
          <input type="text" className="w-full border border-gray-500 rounded-md p-2 bg-black focus:outline-none" placeholder="Link" name="link" defaultValue={user?.link}/>
          <textarea className="col-span-2 w-full border border-gray-500 rounded-md p-2 bg-black focus:outline-none" placeholder="Bio" defaultValue={user?.bio} name="bio"></textarea>
          <input type="text" className="w-full border border-gray-500 rounded-md p-2 bg-black focus:outline-none" placeholder="Current Password" name="current-password"/>
          <input type="text" className="w-full border border-gray-500 rounded-md p-2 bg-black focus:outline-none" placeholder="New Password" name="new-password"/>
          <button type="submit" className="col-span-2 w-full bg-blue-500 text-white py-1 rounded-full hover:bg-blue-700">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;