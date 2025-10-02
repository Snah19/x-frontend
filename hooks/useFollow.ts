import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const followUnfollowUser = async ({ userId, username }: { userId: string, username: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/follow/${username}`, { userId });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: followUnfollowUser,
    onSuccess: (_data, variables) => {
      Promise.all([
        queryClient.invalidateQueries({queryKey: ["profile", variables.username]}),
        queryClient.invalidateQueries({queryKey: ["sessionUser"]}),
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { follow, isPending };
};

export default useFollow;