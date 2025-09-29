"use client";

import { useMutation } from "@tanstack/react-query";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import toast from "react-hot-toast";
import { useState } from "react";
import { LiaEyeSolid } from "react-icons/lia";
import { LiaEyeSlashSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";
import axios from "axios";

const login = async ({ username, password }: { username: string; password: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, { username, password }, { withCredentials: true });
    return data;
  } catch (error: any) {
    throw { message: error.response?.data?.message };
  }
};

const LoginForm = () => {
  const [visiblePW, setVisiblePW] = useState<boolean>(false);
  const router = useRouter();
  const { mutate, isError, error } = useMutation({
    mutationFn: login
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const user = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    mutate(user, {
      onSuccess: () => {
        form.reset();
        toast.success("Account logged in successfully!");
        router.push("/");
      }
    });
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
      {isError && <p className="text-xs text-red-500">{error?.message}</p>}
    </>
  );
};

export default LoginForm;