import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const likeUnlikeComment = async ({ userId, postId, commentId }: { userId: string, postId?: string, commentId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}`, { userId });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useLikeComment = () => {
  const queryClient = useQueryClient();
  const { mutate: likeComment, isPending } = useMutation({
    mutationFn: likeUnlikeComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables?.postId]});
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { likeComment, isPending };
};

export default useLikeComment;