import axios from "axios";
import { Post, User } from "./types";

export const login = async ({ username, password }: { username: string; password: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, { username, password }, { withCredentials: true });
    return data;
  } catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const signup = async ({ email, username, fullname, password }: { email: string; username: string; fullname: string; password: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, { email, username, fullname, password });
    return data;
  }
  
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const logout = async () => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, { }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const updateProfileInfo = async (user: Partial<User>) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/update`, user, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const updateProfileImgs = async (user: Partial<User>) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/update`, user, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const createPost = async (post: Partial<Post>) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/create`, post, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const followUnfollowUser = async ({ username }: { username: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/follow/${username}`, { }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const likeUnlikePost = async ({ postId }: { postId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/like/${postId}`, {  }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const favUnfavPost = async ({ postId }: { postId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/favorite/${postId}`, {  }, { withCredentials: true });
    return data;   
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const repostUnrepostPost = async ({ postId }: { postId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/repost/${postId}`, {  }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const commentOnPost = async ({ postId, content }: { postId: string, content: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${postId}`, { content }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const likeUnlikeComment = async ({ commentId }: { commentId: string }) => {
  try {
    const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${commentId}`, {  }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};

export const replyComment = async ({ commentId, content }: { commentId: string, content: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/replies/${commentId}`, { content }, { withCredentials: true });
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message, field: error.response?.data?.field};
  }
};