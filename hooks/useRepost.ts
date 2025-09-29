import { repostUnrepostPost } from "@/mutation-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useRepost = () => {
  const queryClient = useQueryClient();
  const { mutate: repost, isPending } = useMutation({
    mutationFn: repostUnrepostPost,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["for-you"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["following"]
        }),
      ]);

      toast.success("Reposted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { repost, isPending };
};

export default useRepost;