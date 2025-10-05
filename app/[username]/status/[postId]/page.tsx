import Leftbar from "@/components/leftbar";
import PostDetail from "@/components/post-detail";
import Rightbar from "@/components/rightbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const StatusPage = async ({ params }: { params: { username: string, postId: string } }) => {
  const { username , postId } = await params;
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");
  }

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