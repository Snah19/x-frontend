import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const getSessionUser = async (username: string) => {
  if (!username) return;

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/session-user/${username}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message || "Error getting session user" };
  }
};

const useSessionUser = () => {
  const { data: session } = useSession();

  const { data: sessionUser, isLoading } = useQuery({
    queryKey: ["sessionUser"],
    queryFn: () => getSessionUser(session?.user?.name || ""),
    enabled: !!session?.user?.name,
    staleTime: 1000 * 60 * 5,
  });

  return { sessionUser, isLoading };
};

export default useSessionUser;