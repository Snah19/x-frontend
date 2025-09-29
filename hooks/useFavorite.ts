import { favUnfavPost } from "@/mutation-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFavorite = () => {
  const queryClient = useQueryClient();
  const { mutate: favorite, isPending } = useMutation({
    mutationFn: favUnfavPost,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["for-you"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["following"]
        }),
      ]);
      toast.success("Added to favorite");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { favorite, isPending };
};

export default useFavorite;