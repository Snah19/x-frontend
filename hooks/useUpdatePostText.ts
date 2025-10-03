import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const updatePostTextFn = async ({ postId, text }: { postId: string, text: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/text/${postId}`, { text });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const useUpdatePostText = () => {
  const queryClient = useQueryClient();
  const { mutate: updatePostText } = useMutation({
    mutationFn: updatePostTextFn,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({queryKey: ["for-you"]}),
        queryClient.invalidateQueries({queryKey: ["following"]}),
      ]);
      toast("Updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { updatePostText };
};

export default useUpdatePostText;