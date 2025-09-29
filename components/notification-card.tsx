import Image from "next/image";
import Link from "next/link";
import { GoHeart } from "react-icons/go";
import { FaRegBookmark, FaUserFriends } from "react-icons/fa";
import userIcon from "@/public/img/user-icon.jpg";
import { Notification } from "@/types";
import { BiRepost } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { FaComments } from "react-icons/fa6";
import axios from "axios";
import useMarkNotificationAsRead from "@/hooks/useMarkNotificationAsRead";

const NotificationCard = ({ notification }: { notification: Notification }) => {
  let icon;
  let message;
  let postId = notification?.post?._id || null;
  if (notification?.type === "follow") {
    icon = <FaUserFriends className="text-2xl text-white" />
    message = "followed you";
  }
  else if (notification?.type === "like") {
    icon = <GoHeart className="text-2xl text-red-500" />
    message = "liked your post";
  }
  else if (notification?.type === "repost") {
    icon = <BiRepost className="text-2xl text-green-500" />
    message = "reposted your post";
  }
  else if (notification?.type === "favorite") {
    icon = <FaRegBookmark className="text-2xl text-yellow-500" />
    message = "added your post to favorite";
  }
  else if (notification?.type === "comment") {
    if (notification?.comment?.type === "comment") {
      icon = <FaComment className="text-2xl text-blue-500" />
      message = "commented on your post"
    }
    else if (notification?.comment?.type === "reply") {
      icon = <FaComments className="text-2xl text-blue-500" />
      message = "replied to your comment"
    }
    else if (notification?.comment?.type === "like") {
      icon = <GoHeart className="text-2xl text-red-500" />
      message = "liked to your comment"
    }
  }

  const { markNotificationAsRead } = useMarkNotificationAsRead();

  return (
    <Link className={`flex gap-x-2 p-2 border-b border-gray-700 ${notification?.read === false && "bg-gray-950"}`} href={postId ? `/${notification?.to?.username}/status/${notification?.post?._id}` : `/profile/${notification?.from?.username}?tab=posts`} onClick={() => markNotificationAsRead({ notificationId: notification?._id })}>
      <div>
        {icon}
      </div>
      <div className="space-y-2">
        <figure className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image className="object-cover" src={notification?.from?.profileImg?.url ||userIcon.src} alt="" width={40} height={40} />
        </figure>
        <div><span className="font-bold">@{notification?.from?.username}</span> <span className="text-gray-300">{message}</span></div>
        {notification?.post?.text && (
          <p className="text-sm text-gray-500">{notification?.post?.text}</p>
        )}
        {notification?.comment?.content && (
          <p className="text-sm text-gray-500">{notification?.comment?.content}</p>
        )}
      </div>
    </Link>
  );
};

export default NotificationCard;