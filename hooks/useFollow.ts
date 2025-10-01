import { followUnfollowUser } from "@/mutation-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: followUnfollowUser,
    onSuccess: (_data, variables) => {
      Promise.all([
        queryClient.invalidateQueries({queryKey: ["profile", variables.username]}),
        queryClient.invalidateQueries({queryKey: ["loggedInUser"]}),
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { follow, isPending };
};

export default useFollow;