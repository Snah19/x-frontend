import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const deletePostFn = async ({ userId, postId }: { userId: string, postId: string }) => {
  try {
    const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`, { data: { userId } });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { mutate: deletePost } = useMutation({
    mutationFn: deletePostFn,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["for-you"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["following"]
        }),
      ]);
      toast.success("Post deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { deletePost };
};

export default useDeletePost;