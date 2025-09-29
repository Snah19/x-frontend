"use client";

import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "@/query-functions";
import { User } from "@/types";
import SuggestedUser from "./suggested-user";

const WhoToFollowCard = () => {
  const { data: suggestedUsers } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: getSuggestedUsers,
  });

  return (
    <div className="w-full p-4 rounded-xl border border-gray-700 ">
      <h2 className="mb-4 text-lg font-bold">Who to follow</h2>
      <ul className="space-y-4">
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