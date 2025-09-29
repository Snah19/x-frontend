"use client";

import { useState } from "react";
import EditProfileModal from "./edit-profile-modal";
import { User } from "@/types";


const EditProfileButton = ({ user }: { user: User }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button className="mt-[2rem] py-1 px-4 rounded-full border border-gray-500 bg-black hover:bg-white hover:text-black" onClick={() => setIsModalOpen(true)}>Edit profile</button>
      {isModalOpen && <EditProfileModal user={user} setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default EditProfileButton;