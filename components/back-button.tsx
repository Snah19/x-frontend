"use client";

import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

const BackButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-800">
      <IoMdArrowRoundBack className="text-xl" />
    </button>
  );
};

export default BackButton;