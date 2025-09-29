import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const deleteCommentsFn = async ({ postId }: { postId: string }) => {
  try {
    const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${postId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
}

const useDeleteComments = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteComments } = useMutation({
    mutationFn: deleteCommentsFn,
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

  return { deleteComments };
};

export default useDeleteComments;