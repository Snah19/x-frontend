import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const markNotificationAsReadFn = async ({ notificationId }: {notificationId: string}) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/${notificationId}`);
    return data;
  }
  catch (error: any) {
    console.log("Something went wrong:", error.message);
  }
};

const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { mutate: markNotificationAsRead } = useMutation({
    mutationFn: markNotificationAsReadFn,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["totalUnreadNotifications"]
        })
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { markNotificationAsRead };
};

export default useMarkNotificationAsRead;