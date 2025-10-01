"use client";

import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "@/query-functions";
import { User } from "@/types";
import SuggestedUser from "./suggested-user";

import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';

const WhoToFollowCard = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: getSuggestedUsers,
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