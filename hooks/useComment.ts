import { commentOnPost } from "@/mutation-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useComment = () => {
  const queryClient = useQueryClient();
  const { mutate: comment, isPending } = useMutation({
    mutationFn: commentOnPost,
    onSuccess: (_data, variables) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] }),
        queryClient.invalidateQueries({ queryKey: ["totalComments", variables.postId] }),
      ]);
      toast.success("Comment posted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { comment, isPending };
};

export default useComment;