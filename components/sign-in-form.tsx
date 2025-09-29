"use client";

import { MdOutlineEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import { MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signup } from "@/mutation-functions";
import { useRouter } from "next/navigation";

const fields = [
  {
    title: "Email",
    icon: <MdOutlineEmail className="block text-xl text-white" />,
    type: "email"
  },
  {
    title: "Username",
    icon: <FaUser className="block text-xl text-white" />,
    type: "text"
  },
  {
    title: "Fullname",
    icon: <TbPencilMinus className="block text-xl text-white" />,
    type: "text"
  },
  {
    title: "Password",
    icon: <MdPassword className="block text-xl text-white" />,
    type: "text"
  },
];

const SignInForm = () => {
  const router = useRouter();

  const { mutate, isError, error } = useMutation({
    mutationFn: signup
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const user = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      fullname: formData.get("fullname") as string,
      password: formData.get("password") as string,
    };

    mutate(user, {
      onSuccess: () => {
        form.reset();
        toast.success("Account created successfully. Please login");
        router.push("/login");
      },
    });
  };

  return (
    <>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {fields.map(({ title, icon, type }) => (
          <div className="flex items-center gap-x-1 p-1 rounded-md border border-gray-500" key={title}>
            {icon}
            <input className="flex-1 w-full bg-transparent focus:outline-none" type={type} name={title.toLowerCase()} placeholder={title} required/>
          </div>
        ))}      
        <button className="w-full py-2 text-lg rounded-full bg-blue-400 hover:bg-blue-500" type="submit">Sign up</button>
      </form>
      {isError && <p className="text-xs text-red-500">{error?.message}</p>}
    </>
  );
};

export default SignInForm;