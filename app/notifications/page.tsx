import Leftbar from "@/components/leftbar";
import Notifications from "@/components/notifications";
import Rightbar from "@/components/rightbar";

const NotificationsPage = async ({ searchParams }: { searchParams: { type: string; } }) => {
  const { type } = await searchParams;
  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <Notifications type={type} />
      </div>
      <Rightbar />
    </>
  );
};

export default NotificationsPage;