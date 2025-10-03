import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const replyComment = async ({ userId, commentId, content }: { userId: string, commentId: string, content: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/replies/${commentId}`, { userId, content });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};


const useReplyComment = () => {
  const queryClient = useQueryClient();
  const { mutate: reply, isPending } = useMutation({
    mutationFn: replyComment,
    onSuccess: (_data, variables) => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["for-you"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["following"]
        }),
        queryClient.invalidateQueries({ queryKey: ["replies", variables.commentId] }),
      ]);
      toast("Comment posted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { reply, isPending };
};

export default useReplyComment;