import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const logoutFn = async () => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, { }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const useLogout = () => {
  const { mutate: logout } = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      toast.success("Logout successful");
    },
    onError: (error: any) => {
      toast.error("Logout failed");
    }
  });

  return { logout };
};

export default useLogout;