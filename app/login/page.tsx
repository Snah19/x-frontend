import LoginForm from "@/components/login-form";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";

const LoginPage = () => {
  return (
    <main className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-20 min-h-screen mx-auto p-10">
      <BsTwitterX className="text-3xl sm:text-9xl md:text-[16rem] text-white" />
      <div className="w-full sm:w-96 space-y-4">
        <h1 className="text-2xl font-bold">Let's go.</h1>
        <LoginForm />
        <p className="text-sm">Didn't have an account?</p>
        <Link className="inline-block w-full py-2 text-lg text-center rounded-full border border-blue-400 hover:border-blue-500" href="/signup">Sign up</Link>
      </div>
    </main>
  );
};

export default LoginPage;