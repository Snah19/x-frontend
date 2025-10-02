import { Dispatch, SetStateAction, useState } from "react";
import { deleteImgFromCloudinary, uploadImgToCloudinary } from "@/actions/cloundinary-actions";
import { updateProfile } from "@/mutation-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useSessionUser from "@/hooks/useSessionUser";

type Img = {
  url: string; 
  publicId: string; 
  base64: string; 
  isNew: boolean;
};

const UploadButton = ({profileImg, coverImg, setProfileImg, setCoverImg, setUpdateBtnVisible }: { profileImg: Img, coverImg: Img , setProfileImg: Dispatch<SetStateAction<Img>>, setCoverImg: Dispatch<SetStateAction<Img>>, setUpdateBtnVisible: Dispatch<SetStateAction<boolean>> }) => {
  const { sessionUser } = useSessionUser();
  const queryClient = useQueryClient();
  const { mutate: updatePfImgs } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", sessionUser?.username] });
      setUpdateBtnVisible(false);
      toast("Uploaded");
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateImgs = async () => {
    setIsUploading(true);
    if (profileImg?.isNew && coverImg?.isNew) {
      await deleteImgFromCloudinary(profileImg?.publicId);
      await deleteImgFromCloudinary(coverImg?.publicId);
      
      const uploadedProfileImg = await uploadImgToCloudinary(profileImg?.base64);
      const uploadedCoverImg = await uploadImgToCloudinary(coverImg?.base64);

      updatePfImgs({ userId: sessionUser?._id, user: { profileImg: uploadedProfileImg, coverImg: uploadedCoverImg } });
      setProfileImg(curr => ({ ...curr, isNew: false }));
      setCoverImg(curr => ({ ...curr, isNew: false }));
    }
    else if (profileImg?.isNew) {
      await deleteImgFromCloudinary(profileImg?.publicId);

      const uploadedProfileImg = await uploadImgToCloudinary(profileImg?.base64);
      updatePfImgs({ userId: sessionUser?._id, user: { profileImg: uploadedProfileImg } });
      setProfileImg(curr => ({ ...curr, isNew: false }));
    }
    else if (coverImg?.isNew) {
      await deleteImgFromCloudinary(coverImg?.publicId);

      const uploadedCoverImg = await uploadImgToCloudinary(coverImg?.base64);
      updatePfImgs({ userId: sessionUser?._id ,user: {coverImg: uploadedCoverImg }});
      setCoverImg(curr => ({ ...curr, isNew: false }));
    }
  };

  return (
    <button className="mt-[2rem] py-1 px-4 rounded-full border border-gray-500 bg-blue-500 hover:bg-blue-600" onClick={handleUpdateImgs}>{isUploading ? "Uploading..." : "Upload"}</button>
  );
};

export default UploadButton;