import Leftbar from "@/components/leftbar";
import Rightbar from "@/components/rightbar";
import NotificationsContainer from "@/components/notifications-container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const NotificationsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <NotificationsContainer />
      </div>
      <Rightbar />
    </>
  );
};

export default NotificationsPage;