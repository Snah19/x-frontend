import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const favUnfavPost = async ({ userId, postId }: { userId: string , postId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/favorite/${postId}`, { userId });
    return data;   
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useFavorite = () => {
  const queryClient = useQueryClient();
  const { mutate: favorite, isPending } = useMutation({
    mutationFn: favUnfavPost,
    onSuccess: (_data, variables) => {
      Promise.all([
        queryClient.invalidateQueries({queryKey: ["for-you"]}),
        queryClient.invalidateQueries({queryKey: ["following"]}),
        queryClient.invalidateQueries({queryKey: ["postStats", variables?.postId]})
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { favorite, isPending };
};

export default useFavorite;