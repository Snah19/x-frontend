import Leftbar from "@/components/leftbar";
import Rightbar from "@/components/rightbar";
import ProfileContainer from "@/components/profile-container";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ProfilePage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const session = await getServerSession();
  
  if (!session) {
    redirect("/login");
  }
  
  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <ProfileContainer username={username} />
      </div>
      <Rightbar />
    </>
  );
};

export default ProfilePage;
