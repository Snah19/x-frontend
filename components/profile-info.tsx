"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/query-functions";
import FoundedProfile from "./founded-profile";
import NotFoundedUser from "./not-founded-profile";

const ProfileInfo = ({ username }: { username: string }) => {
  const { data: user } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
  });

  return (
    <>
      {user ? <FoundedProfile user={user} /> : <NotFoundedUser username={username} />}
    </>
  );
};

export default ProfileInfo;