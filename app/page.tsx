import Home from "@/components/home";
import Leftbar from "@/components/leftbar";
import Rightbar from "@/components/rightbar";

const HomePage = async ({ searchParams }: { searchParams: {feed: string } }) => {
  const { feed } = await searchParams;
  return (
    <>
      <div className="flex-1 flex">
        <Leftbar />
        <Home feed={feed || "for-you"} />
      </div>
      <Rightbar />
    </>
  );
};

export default HomePage;