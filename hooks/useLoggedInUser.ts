import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getLoggedInUserFn = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/current-user`, { withCredentials: true });
    return data;
  } catch (error: any) {
    throw { message: error.response?.data?.message || "Failed to fetch user" };
  }
};

const useLoggedInUser = () => {
  const { data: loggedInUser, isLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: getLoggedInUserFn,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {loggedInUser, isLoading };
};

export default useLoggedInUser;