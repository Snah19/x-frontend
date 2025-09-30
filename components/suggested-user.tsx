import { User } from "@/types";
import Link from "next/link";
import Image from "next/image";
import userIcon from "@/public/img/user-icon.jpg";
import useFollow from "@/hooks/useFollow";
import { useState } from "react";


const SuggestedUser = ({ user }: { user: User }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  const { follow } = useFollow();
  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    e.preventDefault();
    follow({ username: user?.username });
    setIsFollowing(curr => !curr);
  };
  
  return (
    <div className="flex items-center gap-x-2">
      <Link href={`/profile/${user?.username}`}>
        <figure className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image className="object-cover" src={user?.profileImg?.url || userIcon.src} alt="" width={40} height={40} />
        </figure>
      </Link>
      <div>
        <Link className="block mb-0.5 text-sm leading-none hover:underline" href={`/profile/${user?.username}`}>{user?.fullname}</Link>
        <span className="text-xs text-gray-500">@{user?.username}</span>
      </div>
      <button className={`ml-auto py-2 px-4 rounded-full text-xs ${!isFollowing ? "bg-white text-black hover:bg-white/90" : "bg-black text-white border border-white hover:boder-white/90"} `} onClick={e => handleFollow(e, user?._id)}>
        {!isFollowing ? "Follow" : "Following"}
      </button>
    </div>
  );
};

export default SuggestedUser;