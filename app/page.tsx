import HomeContainer from "@/components/home-container";
import Leftbar from "@/components/leftbar";
import Rightbar from "@/components/rightbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const HomePage = async ({ searchParams }: { searchParams: {feed: string } }) => {
  const { feed } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <HomeContainer feed={feed || "for-you"} />
      </div>
      <Rightbar />
    </>
  );
};

export default HomePage;