import SignInForm from "@/components/sign-in-form";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";

const SignUpPage = () => {  
  return (
    <main className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-20 min-h-screen mx-auto p-10">
      <BsTwitterX className="text-3xl sm:text-9xl md:text-[16rem] text-white" />
      <div className="w-full sm:w-96 space-y-4">
        <h1 className="text-2xl font-bold">Join today.</h1>
        <SignInForm />
        <p className="text-sm">Already have an account?</p>
        <Link prefetch className="inline-block w-full py-2 text-lg text-center rounded-full border border-blue-400 hover:border-blue-500" href="/login">Sign in</Link>
      </div>
    </main>
  );
};

export default SignUpPage;