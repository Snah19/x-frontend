"use server";

import cloudinary from "@/config/cloudinary";

export const uploadImgToCloudinary = async (imgBase64: string) => {
  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(imgBase64, { folder: "twitter-clone" });
    return { url: secure_url, publicId: public_id }; 
  }
  catch (error: any) {
    console.log(error.message);
  }
};

export const uploadImgsToCloudinary = async (imgsBase64: string[]) => {
  try {
    const imgs = [];
    for (const imgBase64 of imgsBase64) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(imgBase64, { folder: "twitter-clone" });
      imgs.push({ url: secure_url, publicId: public_id });
    }

    return imgs;
  }
  catch (error: any) {
    console.log(error.message);
  }
};

export const deleteImgFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }
  catch (error: any) {
    console.log(error.message);
  }
};