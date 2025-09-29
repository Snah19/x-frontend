"use client";

import Leftbar from "@/components/leftbar";
import PostDetail from "@/components/post-detail";
import Rightbar from "@/components/rightbar";
import { useParams } from "next/navigation";

const StatusPage = () => {
  const params = useParams<{ username: string; postId: string }>();
  const {username , postId} = params;

  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <main className="flex-1 h-screen xs:border-r border-gray-700 overflow-auto hide-scrollbar">
          <PostDetail username={username} postId={postId} />
        </main>
      </div>
      <Rightbar />
    </>
  );
};

export default StatusPage;