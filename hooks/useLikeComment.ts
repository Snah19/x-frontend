import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const likeUnlikeComment = async ({ userId, commentId }: { userId: string, commentId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}`, { userId });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useLikeComment = () => {
  const { mutate: likeComment, isPending } = useMutation({
    mutationFn: likeUnlikeComment,
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { likeComment, isPending };
};

export default useLikeComment;