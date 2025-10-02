"use client";

import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { useState } from "react";
import { LiaEyeSolid } from "react-icons/lia";
import { LiaEyeSlashSolid } from "react-icons/lia";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [visiblePW, setVisiblePW] = useState<boolean>(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", { username, password, redirect: false });

      if (res?.error) {
        setError("Invalid credentials");
        return;
      }

      router.replace("/");
      console.log("redirected"); // printed: redirected
    }
    catch (error: any) {
      console.log("Error logging in user:", error);
    }
  };
  
  return (
    <>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex items-center gap-x-1 p-1 rounded-md border border-gray-500">
          <FaUser className="block text-xl text-white" />
          <input className="flex-1 w-full bg-transparent focus:outline-none" type="text" name="username" placeholder="Username" required/>
        </div>
        <div className="flex items-center gap-x-1 p-1 rounded-md border border-gray-500">
          <MdPassword className="block text-xl text-white" />
          <input className="flex-1 w-full bg-transparent focus:outline-none" type={visiblePW ? "text" : "password"} name="password" placeholder="Password" required autoComplete="new-password"/>
          <button type="button" onClick={() => setVisiblePW(curr => !curr)}>{visiblePW ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}</button>
        </div>
        <button className="w-full py-2 text-lg rounded-full bg-blue-400 hover:bg-blue-500" type="submit">Login</button>
      </form>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </>
  );
};

export default LoginForm;