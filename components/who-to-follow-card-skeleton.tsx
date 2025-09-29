import Link from "next/link";

const WhoToFollowCardSkeleton = () => {
  return (
    <div className="w-full p-4 rounded-xl border border-gray-700 ">
      <h2 className="mb-4 text-lg font-bold">Who to follow</h2>
      <ul className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <div className="flex items-center gap-x-2">
              <Link href="#">
                <figure className="relative w-10 h-10 rounded-full overflow-hidden shimmer-card" />
              </Link>
              <div className="hidden xl:block">
                <Link className="block w-max mb-0.5 rounded-full text-sm leading-none hover:underline shimmer-card" href="/"><div className="opacity-0">Bol Veasna</div></Link>
                <span className="block w-max text-xs rounded-full text-gray-500 shimmer-card"><div className="opacity-0">@bolveasna12345</div></span>
              </div>
              <button className="ml-auto py-2 px-4 rounded-full text-xs text-black shimmer-card"><div className="opacity-0">Follow</div></button> 
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhoToFollowCardSkeleton;