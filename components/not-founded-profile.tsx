import { IoMdArrowRoundBack } from "react-icons/io";

const NotFoundedUser = ({ username }: { username: string }) => {
  return (
    <>
      <div className="sticky top-0 flex items-center gap-x-4 py-1 px-2 border-b border-gray-700 bg-black/50 backdrop-blur-md z-50">
        <button className="p-2 rounded-full hover:bg-gray-800"><IoMdArrowRoundBack className="text-xl" /></button>
        <div>
          <p className="text-sm font-medium">Profile</p>
          <span className="text-xs text-gray-500">0 posts</span>
        </div>
      </div>

      <div className="w-full h-[12.5rem] bg-gray-600" />

      <div className="-mt-[4.5rem] p-4">
        <div className="flex justify-between items-center mb-4">
          <figure className="relative size-32 rounded-full border-4 border-black bg-white overflow-hidden group">
          </figure>
          <div className="flex items-center gap-x-2">
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-gray-500">@{username}</p>
        </div>
        <div>
          <h1 className="text-3xl text-center">This account doesn't exist</h1>
          <p className="text-center text-gray-500">Try searching for another</p>
        </div>
      </div>
    </>
  );
};

export default NotFoundedUser;