import axios from "axios";
import { User } from "./types";

export const signup = async ({ email, username, fullname, password }: { email: string; username: string; fullname: string; password: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, { email, username, fullname, password });
    return data;
  }
  
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const updateProfile = async ({ userId, user }: { userId: string, user: Partial<User> }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/update/${userId}`, user);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

