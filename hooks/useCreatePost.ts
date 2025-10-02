import { Post } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const createPostFn = async ({ userId, post } :{userId: string, post: Partial<Post>}) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/create/${userId}`, post);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { mutate: createPost } = useMutation({
    mutationFn: createPostFn,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["for-you"]
        })
      ]);
      toast("Posted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return { createPost };
};

export default useCreatePost;