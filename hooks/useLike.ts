import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const likeUnlikePost = async ({ postId }: { postId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/like/${postId}`, {  }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useLike = () => {
  const queryClient = useQueryClient();
  const { mutate: like, isPending } = useMutation({
    mutationFn: likeUnlikePost,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({queryKey: ["for-you"]}),
        queryClient.invalidateQueries({queryKey: ["following"]}),
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { like, isPending };
};

export default useLike;