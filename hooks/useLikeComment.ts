import { likeUnlikeComment } from "@/mutation-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useLikeComment = () => {
  const queryClient = useQueryClient();
  const { mutate: likeComment, isPending } = useMutation({
    mutationFn: likeUnlikeComment,
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

  return { likeComment, isPending };
};

export default useLikeComment;