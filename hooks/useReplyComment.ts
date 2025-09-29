import { replyComment } from "@/mutation-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


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
      toast.success("Comment posted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { reply, isPending };
};

export default useReplyComment;