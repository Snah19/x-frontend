import axios from "axios";

export const getProfile = async (username: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/${username}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const getUserPosts = async (username: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/user/${username}`);
    return data;  
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const getLikedPosts = async (username: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/posts/liked/${username}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const getFavoritePosts = async (username: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/posts/favorite/${username}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const getRepostedPosts = async (username: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/posts/repost/${username}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const getPost = async (postId: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/status/${postId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const getComments = async (postId: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${postId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  } 
};

export const getReplies = async (commentId: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/replies/${commentId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

export const getTotalComments = async (postId: string) => {
  try {
    if (!postId) return;
    
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/total/${postId}`);
    return data;
  }
  catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};