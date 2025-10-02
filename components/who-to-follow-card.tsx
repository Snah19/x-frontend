"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import SuggestedUser from "./suggested-user";
import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';
import axios from "axios";
import useSessionUser from "@/hooks/useSessionUser";

const getSuggestedUsers = async (userId: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/suggested/${userId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const WhoToFollowCard = () => {
  const { sessionUser } = useSessionUser();
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: () => getSuggestedUsers(sessionUser?._id || ""),
    enabled: !!sessionUser?._id,
  });

  return (
    <div className="w-full p-4 rounded-xl border border-gray-700 ">
      <h2 className="mb-4 text-lg font-bold">Who to follow</h2>
      <ul className="space-y-4">
        {isLoading && (
          <div className="my-5 text-center">
            <LineSpinner size="30" stroke="3" speed="1" color="#3B82F6" />
          </div>
        )}
        {suggestedUsers?.length && suggestedUsers.map((user: User, i: number) => (
          <li key={i}>
            <SuggestedUser user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhoToFollowCard;