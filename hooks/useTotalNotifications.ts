import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useSessionUser from "./useSessionUser";

const getTotalNotifications = async (userId: string) => {
  if (!userId) return;
  
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/total/${userId}`);
    return data;
  }
  catch (error: any) {
    console.log("Error in getTotalUnreadNotifications function:", error.message);
  }
};

const useTotalNotifications = () => {
  const { sessionUser } = useSessionUser();
  const { data: notifications } = useQuery({
    queryKey: ["totalNotifications"],
    queryFn: () => getTotalNotifications(sessionUser?._id),
    enabled: !!sessionUser?._id,
  });

  return notifications;
};

export default useTotalNotifications;