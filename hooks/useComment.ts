import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const commentOnPost = async ({ userId, postId, content }: { userId: string, postId: string, content: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${postId}`, { userId, content });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useComment = () => {
  const queryClient = useQueryClient();
  const { mutate: comment, isPending } = useMutation({
    mutationFn: commentOnPost,
    onSuccess: (_data, variables) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] }),
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { comment, isPending };
};

export default useComment;