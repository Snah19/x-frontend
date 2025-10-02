"use client";

import useFollow from "@/hooks/useFollow";
import { User } from "@/types";
import { useEffect, useState } from "react";

const FollowButton = ({ sessionUser, user }: { sessionUser: User, user: User }) => {
  const [following, setFollowing] = useState(false);
  const { follow } = useFollow();
  useEffect(() => {
    setFollowing(sessionUser?.following?.includes(user?._id));
  }, [sessionUser]);

  const handleFollow = (username: string) => {
    follow({ userId: sessionUser?._id, username });
    setFollowing(curr => !curr);
  };

  return (
    <button className="mt-[2rem] py-1 px-4 rounded-full border border-gray-500 bg-black hover:bg-white hover:text-black" onClick={() => handleFollow(user?.username)}>
      {following ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
