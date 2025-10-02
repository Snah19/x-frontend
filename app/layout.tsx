import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/fonts";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ScrollProvider } from "@/providers/scroll-provider";
import { Toaster } from "react-hot-toast";
import { NextAuthProvider } from "@/providers/next-auth-provider";

export const metadata: Metadata = {
  title: "X",
  description: "Twitter Clone Platform",
};

const RootLayout = ({ children }: Readonly<{children: React.ReactNode;}>) => {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={`${poppins.className} bg-black text-white`}>
          <NextAuthProvider>
            <ScrollProvider>
              <div className="flex md:gap-x-2 items-center max-w-[81.25rem] mx-auto">
                {children}
              </div>
            </ScrollProvider>
          </NextAuthProvider>
        </body>
      </html>
      <Toaster toastOptions={{ style: { width: "auto", maxWidth: "100%"}} }/>
    </ReactQueryProvider>
  );
};

export default RootLayout;