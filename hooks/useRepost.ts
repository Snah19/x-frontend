import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const repostUnrepostPost = async ({ userId, postId }: { userId: string, postId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/repost/${postId}`, { userId });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useRepost = () => {
  const queryClient = useQueryClient();
  const { mutate: repost, isPending } = useMutation({
    mutationFn: repostUnrepostPost,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["for-you"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["following"]
        }),
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { repost, isPending };
};

export default useRepost;